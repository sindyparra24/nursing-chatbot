from pymongo import MongoClient


client = MongoClient("mongodb+srv://sparrav:S213517p@cluster0.95m5oo5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")


db = client["nursing_db"]
students = db["students"]


resultado = students.delete_many({
    "$or": [
        {"name": {"$exists": False}},
        {"correo": {"$exists": False}}
    ]
})

print(f"Documentos eliminados: {resultado.deleted_count}")
