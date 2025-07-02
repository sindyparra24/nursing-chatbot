from django.urls import path 
from . import views

urlpatterns = [
    path("register/", views.register_student, name="register_student"),
    path("test/", views.save_test_result, name="save_test_result"),
    path("test/check/", views.check_test_completion, name="check_test_completion"),
    path("test/errores/", views.get_wrong_answers, name="get_wrong_answers"),
    path("students/", views.listar_estudiantes, name="listar_estudiantes"),
    path("test/comparar/", views.comparar_resultados_por_tema, name="comparar_resultados_por_tema"),
    path("test/prediccion/", views.predecir_resultado_posttest, name="predecir_resultado_posttest"),
    path("analizar-mejora/", views.analizar_mejora_por_tema, name="analizar_mejora_por_tema"),  
]
