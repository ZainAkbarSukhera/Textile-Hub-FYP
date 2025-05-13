# file: sync_chromadb.py

import chromadb
from pymongo import MongoClient

def sync_chromadb_with_mongo(
    mongo_uri="ac-7lnljtl-shard-00-02.ju4fzv7.mongodb.net",
    db_name="FYP",
    collection_name="products",
    chroma_path="./chroma_db",
    chroma_collection_name="image_embeddings"
):
    # 1. Connect to MongoDB
    mongo_client = MongoClient(mongo_uri)
    db = mongo_client[db_name]
    product_collection = db[collection_name]

    # 2. Connect to ChromaDB
    chroma_client = chromadb.PersistentClient(path=chroma_path)
    collection = chroma_client.get_or_create_collection(name=chroma_collection_name)

    # 3. Load all product documents
    products = product_collection.find()

    updated_count = 0

    for product in products:
        try:
            product_id = str(product["_id"])
            name = product.get("name", "")
            category = product.get("category", "")
            shop_id = str(product.get("shopId", "N/A"))
            shop_name = product.get("shop", {}).get("name", "N/A")
            price = product.get("discountPrice", product.get("originalPrice", 0))
            description = product.get("description", "")
            tags = product.get("tags", "")

            for img in product.get("images", []):
                image_url = img["url"]
                image_id = f"{category}_{img['public_id'].split('/')[-1]}.jpg"

                # Build new metadata
                new_metadata = {
                    "product_id": product_id,
                    "shop_id": shop_id,
                    "shop_name": shop_name,
                    "name": name,
                    "category": category,
                    "image_url": image_url,
                    "price": price,
                    "description": description,
                    "tags": tags
                }

                try:
                    # Fetch embedding if it exists
                    existing = collection.get(ids=[image_id])
                    if not existing["ids"]:
                        print(f"Not found: {image_id}")
                        continue

                    embedding = existing["embeddings"][0]

                    # Re-insert updated metadata
                    collection.delete(ids=[image_id])
                    collection.add(
                        ids=[image_id],
                        embeddings=[embedding],
                        documents=[None],
                        metadatas=[new_metadata]
                    )
                    updated_count += 1
                    print(f"Updated metadata for {image_id}")

                except Exception as e:
                    print(f" Failed to update {image_id}: {e}")

        except Exception as err:
            print(f" Error processing product: {err}")

    print(f"\n Metadata sync complete. Total updated: {updated_count}")
