
from src.chroma_db import MyDb
from src.model import MyModel
from logging import logger
from PIL import Image

class Compare():
    def __init__(self):
        self.model=MyModel()
        self.db = MyDb(db_path="./chroma_data", collection_name="image_embeddings")
        self.collection=self.db.collection
    

    def compare_image(self, input_image_path):
        image = Image.open(input_image_path).convert("RGB")
        input_embedding = self.model.image_to_embedding(image)
        results = self.collection.query(query_embeddings=[input_embedding], n_results=5) 
        print("Results of compare:", results)
        logger.info("comparison between the images is completed")
        return results

