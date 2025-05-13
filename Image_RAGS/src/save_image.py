
import os 
from src.model import MyModel
from src.chroma_db import MyDb
#from logging import logger 
from PIL import Image
import torch

class Store_img():
    def __init__(self,dataset_path,collection):
        self.model=MyModel()
        self.db=MyDb(dataset_path,collection)
        self.collection=self.db.collection
        self.dataset_path=dataset_path
        

    
    def process_dataset_and_store_embeddings(self, dataset_path):
        """
        Processes a dataset directory and stores image embeddings in ChromaDB
        along with full metadata (image_path, label, etc.).
        """
        for root, _, files in os.walk(dataset_path):
            label = os.path.basename(root)  # Use folder name as label/category

            for file in files:
                image_path = os.path.join(root, file)

                try:
                    with Image.open(image_path).convert('RGB') as img:
                        embedding = self.model.image_to_embedding(img)

                    # Generate unique ID
                    image_id = f"{label}_{file}"

                    # Construct metadata dictionary
                    metadata = {
                        "image_path": image_path,
                        "label": label,
                        "image_id": image_id,
                        "name": os.path.splitext(file)[0], 
                        "shop_id": "N/A",                  
                        "product_id": "N/A",               
                        "category": label
                    }

                    # Store in ChromaDB
                    self.db.store_embedding(embedding, image_id, metadata)

                    print(f" Stored embedding for {file} (ID: {image_id}, Label: {label})")

                except Exception as e:
                    print(f" Skipping {file} due to error: {e}")






    def compare_image(self, image):
         # Ensure input is a PIL image
        if not isinstance(image, Image.Image):
            raise ValueError("Input must be a PIL Image.")
        
        input_embedding = self.model.image_to_embedding(image)
        print(input_embedding)

        results = self.collection.query(query_embeddings=[input_embedding], n_results=3,
        include=["metadatas"])
        print("Query Results:", results)


        return results["metadatas"]




