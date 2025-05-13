from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from io import BytesIO
import requests
import uuid

from src.model import MyModel
from src.chroma_db import MyDb
from src.save_image import Store_img  

app = Flask(__name__)
CORS(app) 



model = MyModel()
db = MyDb(db_path="./chroma_db", collection_name="image_embeddings")
# collection = db.collection
store = Store_img(dataset_path="./chroma_db", collection="image_embeddings") 
# dataset_path="images\\data"

# --- Helper function to download image ---
def download_image(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        return Image.open(BytesIO(response.content)).convert("RGB")
    except Exception as e:
        print(f"Error downloading image: {e}")
        return None

# --- ROUTE 1: Add Embedding ---
@app.route("/add-embedding", methods=["POST"])
def add_embedding():
    data = request.get_json()
    image_url = data.get("image_url")
    product_id = data.get("product_id")
    shop_id = data.get("shop_id")
    name = data.get("name")
    category = data.get("category")

    img = download_image(image_url)
    if img is None:
        return jsonify({"error": "Invalid image URL"}), 400
    embedding = model.image_to_embedding(img)
    # image_id = str(uuid.uuid4())

    metadata = {
        "product_id": product_id,
        "shop_id": shop_id,
        "name": name,
        "category": category,
        "image_url": image_url,
        # Add other metadata here!
    }
    db.store_embedding(embedding, product_id, metadata)
    return jsonify({"message": "Embedding stored", "id": product_id}), 200

# --- ROUTE 2: Delete Image ---
@app.route("/delete-embedding/<product_id>", methods=["DELETE"])
def delete_embedding(product_id):
    try:
        db.delete_embedding(product_id)
        return jsonify({"message": f"Embedding for product ID '{product_id}' deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Error deleting embedding: {str(e)}"}), 500

# --- ROUTE 3: Compare Uploaded Image ---
@app.route("/compare", methods=["POST"])
def compare_image():
    print("compare_image: Model invoked with an image")

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files["image"]
    print(request.files);
    print(f"Headers: {request.headers}")
    print(f"Content-Type: {request.content_type}")

    try:
        print("Entering try block")
        img = Image.open(image_file.stream).convert("RGB")

    except Exception as e:
        return jsonify({"error": f"Invalid image: {str(e)}"}), 400
    
    
    print("Image received and converted to PIL:",img)


    results = store.compare_image(img)  

    if not results or not isinstance(results, list):
        return jsonify({"results": []}), 200

    matches = []
    for metadata in results[0]:
        if metadata is None:
            continue  

        matches.append({
            "_id": metadata.get("product_id", "N/A"),  
            "name": metadata.get("name", "N/A"),
            "images": [{"url": metadata.get("image_url", "N/A")}],  
        })

        
    print("Final Matches:", matches)

    return jsonify({
    "results": matches  
    }),200

if __name__ == "__main__":
    host = "0.0.0.0"
    port = 5000
    print(f"Flask server running on http://{host}:{port}")
    app.run(debug=True, host=host, port=port)


