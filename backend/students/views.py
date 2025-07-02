from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from .mongo import db
from .ml_model import predecir_mejora
import json

students_collection = db["students"]
test_collection = db["test_results"]

@csrf_exempt
def register_student(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            name = data.get("name")
            correo = data.get("correo")

            if not name or not correo:
                return JsonResponse({"error": "Faltan campos requeridos"}, status=400)

            existing = students_collection.find_one({"correo": correo})
            if existing:
                return JsonResponse({"error": "El estudiante ya está registrado"}, status=400)

            students_collection.insert_one({"name": name, "correo": correo})
            return JsonResponse({"message": "Estudiante registrado correctamente"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Método no permitido"}, status=405)

@csrf_exempt
def save_test_result(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            test_collection.insert_one(data)
            return JsonResponse({"message": "Respuestas guardadas correctamente"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Método no permitido"}, status=405)

@csrf_exempt
def check_test_completion(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            correo = data.get("correo")
            test_type = data.get("testType")

            if not correo or not test_type:
                return JsonResponse({"error": "Faltan datos"}, status=400)

            student = students_collection.find_one({"correo": correo})
            if not student:
                return JsonResponse({"error": "Estudiante no encontrado"}, status=404)

            test_done = test_collection.find_one({
                "correo": correo,
                "testType": test_type
            })

            return JsonResponse({
                "completed": bool(test_done),
                "name": student["name"]
            }, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Método no permitido"}, status=405)

@require_GET
def listar_estudiantes(request):
    try:
        estudiantes = list(students_collection.find({}, {"_id": 0, "name": 1, "correo": 1}))
        return JsonResponse(estudiantes, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def get_wrong_answers(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            correo = data.get("correo")

            if not correo:
                return JsonResponse({"error": "Correo es requerido"}, status=400)

            test = test_collection.find_one(
                { "correo": correo, "testType": "pre" },
                sort=[("_id", -1)]
            )

            if not test:
                return JsonResponse({"error": "Pre-Test no encontrado"}, status=404)

            respuestas_usuario = test.get("respuestas", [])
            errores = []

            respuestas_correctas = {
                "1": {"respuesta": "b", "tema": "asepsia"},
                "2": {"respuesta": "a", "tema": "signos vitales"},
                "3": {"respuesta": "c", "tema": "inyeccion"},
                "4": {"respuesta": "d", "tema": "bioseguridad"},
                "5": {"respuesta": "c", "tema": "lavado de manos"}
            }

            for respuesta in respuestas_usuario:
                pregunta_id = str(respuesta.get("pregunta")).strip()
                respuesta_dada = str(respuesta.get("respuesta")).strip().lower()

                correcta = respuestas_correctas.get(pregunta_id)
                if correcta and respuesta_dada != correcta["respuesta"]:
                    errores.append({
                        "pregunta": pregunta_id,
                        "respuesta_incorrecta": respuesta_dada,
                        "respuesta_correcta": correcta["respuesta"],
                        "tema": correcta["tema"]
                    })

            return JsonResponse({"errores": errores}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Método no permitido"}, status=405)

@csrf_exempt
def comparar_resultados_por_tema(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            correo = data.get("correo")

            if not correo:
                return JsonResponse({"error": "Correo es requerido"}, status=400)

            respuestas_correctas = {
                "1": {"respuesta": "b", "tema": "asepsia"},
                "2": {"respuesta": "a", "tema": "signos vitales"},
                "3": {"respuesta": "c", "tema": "inyeccion"},
                "4": {"respuesta": "d", "tema": "bioseguridad"},
                "5": {"respuesta": "c", "tema": "lavado de manos"}
            }

            pre = test_collection.find_one({ "correo": correo, "testType": "pre" })
            post = test_collection.find_one({ "correo": correo, "testType": "post" })

            if not pre or not post:
                return JsonResponse({"error": "Faltan resultados para comparar"}, status=404)

            comparacion = {}

            for key, val in respuestas_correctas.items():
                tema = val["tema"]
                correcta = val["respuesta"]

                r_pre = next((r for r in pre.get("respuestas", []) if str(r.get("pregunta")) == key), {})
                r_post = next((r for r in post.get("respuestas", []) if str(r.get("pregunta")) == key), {})

                respuesta_pre = str(r_pre.get("respuesta", "")).strip().lower()
                respuesta_post = str(r_post.get("respuesta", "")).strip().lower()

                pre_ok = int(respuesta_pre == correcta)
                post_ok = int(respuesta_post == correcta)

                comparacion[tema] = {
                    "pre": pre_ok,
                    "post": post_ok
                }

            return JsonResponse(comparacion, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Método no permitido"}, status=405)

@csrf_exempt
def predecir_resultado_posttest(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            correo = data.get("correo")

            if not correo:
                return JsonResponse({"error": "Correo es requerido"}, status=400)

            pre = test_collection.find_one({ "correo": correo, "testType": "pre" })

            if not pre:
                return JsonResponse({"error": "Pre-Test no encontrado"}, status=404)

            respuestas_correctas = {
                "1": "b", "2": "a", "3": "c", "4": "d", "5": "c"
            }

            respuestas = pre.get("respuestas", [])
            vector = []

            for i in range(1, 6):
                r = next((x for x in respuestas if str(x["pregunta"]) == str(i)), {})
                valor = int(r.get("respuesta", "").strip().lower() == respuestas_correctas[str(i)])
                vector.append(valor)

            prediccion = predecir_mejora(vector)

            return JsonResponse({
                "correo": correo,
                "respuestas": vector,
                "prediccion": "Probable mejora en el post-test" if prediccion == 1 else "Probable dificultad en el post-test"
            }, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Método no permitido"}, status=405)

@csrf_exempt
def analizar_mejora_por_tema(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            correo = data.get("correo")

            if not correo:
                return JsonResponse({"error": "Correo es requerido"}, status=400)

            respuestas_correctas = {
                "1": {"respuesta": "b", "tema": "asepsia"},
                "2": {"respuesta": "a", "tema": "signos vitales"},
                "3": {"respuesta": "c", "tema": "inyeccion"},
                "4": {"respuesta": "d", "tema": "bioseguridad"},
                "5": {"respuesta": "c", "tema": "lavado de manos"}
            }

            pre = test_collection.find_one({ "correo": correo, "testType": "pre" })
            post = test_collection.find_one({ "correo": correo, "testType": "post" })

            if not pre or not post:
                return JsonResponse({"error": "Faltan resultados para analizar"}, status=404)

            analisis = []

            for key, val in respuestas_correctas.items():
                tema = val["tema"]
                correcta = val["respuesta"]

                r_pre = next((r for r in pre.get("respuestas", []) if str(r.get("pregunta")) == key), {})
                r_post = next((r for r in post.get("respuestas", []) if str(r.get("pregunta")) == key), {})

                respuesta_pre = str(r_pre.get("respuesta", "")).strip().lower()
                respuesta_post = str(r_post.get("respuesta", "")).strip().lower()

                pre_ok = int(respuesta_pre == correcta)
                post_ok = int(respuesta_post == correcta)

                if post_ok == 1 and pre_ok == 0:
                    analisis.append(f"Mejoraste en {tema}. ¡Buen trabajo!")
                elif post_ok == 1 and pre_ok == 1:
                    analisis.append(f"Mantuviste un buen rendimiento en {tema}.")
                else:
                    analisis.append(f"Aún necesitas repasar el tema {tema}.")

            return JsonResponse({"analisis": analisis}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Método no permitido"}, status=405)
