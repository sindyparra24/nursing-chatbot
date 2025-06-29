from sklearn.linear_model import LogisticRegression
import numpy as np
import pandas as pd

# Entrenamiento básico con datos simulados de ejemplo
# Puedes reemplazar esto con datos reales más adelante
def entrenar_modelo():
    # Simulación de respuestas del pre-test (5 preguntas, 1 = correcta, 0 = incorrecta)
    X = np.array([
        [1, 1, 1, 1, 1],
        [1, 0, 1, 0, 1],
        [0, 0, 1, 1, 0],
        [1, 1, 0, 1, 0],
        [0, 0, 0, 0, 0]
    ])
    # Resultado del post-test (1 = aprobado, 0 = no aprobado)
    y = np.array([1, 1, 0, 1, 0])

    modelo = LogisticRegression()
    modelo.fit(X, y)
    return modelo

modelo_entrenado = entrenar_modelo()

def predecir_mejora(respuestas_pretest):
    X_nuevo = np.array([respuestas_pretest])
    prediccion = modelo_entrenado.predict(X_nuevo)
    return int(prediccion[0])