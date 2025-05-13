import chromadb
#from logging import logger
from chromadb.config import Settings


class MyDb():
    def __init__(self,db_path,collection_name):
    
        settings = Settings(persist_directory=db_path)

        self.client = chromadb.PersistentClient(path=db_path)

        self.collection = self.client.get_or_create_collection(collection_name)

        print("ChromaDB configured with persistent storage at:", db_path)

    def store_embedding(self, embedding, image_id, metadata):
        self.collection.add(embeddings=[embedding], ids=[image_id], metadatas=[metadata])


    print("Database populated with image embeddings!")


    def delete_embedding(self, product_id):
        self.collection.delete(ids=[product_id])

