import torch
from transformers import ViTModel, ViTImageProcessor 
from PIL import Image
import numpy as np
#from utils.common import read_yaml
#from logging1 import logger
class MyModel():
    def __init__(self):

        
        
        model = ViTModel.from_pretrained('google/vit-base-patch16-224-in21k')
        self.feature_extractor = ViTImageProcessor.from_pretrained('google/vit-base-patch16-224-in21k')
        self.model=model.eval()
    
    def image_to_embedding(self, image):
        inputs = self.feature_extractor(images=image, return_tensors="pt")
        with torch.no_grad():
            outputs = self.model(**inputs)
            embedding = outputs.last_hidden_state.mean(dim=1).squeeze().numpy().tolist()  # Convert to list
        return embedding
