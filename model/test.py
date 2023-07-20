
import tensorflow
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from keras.layers import GlobalMaxPool2D
import cv2
import numpy as np
from numpy.linalg import norm
import pickle
from sklearn.neighbors import NearestNeighbors


feature_list = np.array(pickle.load(
    open('D:/ML internship/image-search-engine/main/featurevector1.pkl', 'rb')))
filename_list = pickle.load(
    open('D:/ML internship/image-search-engine/main/filenames1.pkl', 'rb'))


model = ResNet50(weights='imagenet', include_top=False,
                 input_shape=(224, 224, 3))
model.trainable = False


model = tensorflow.keras.Sequential([
    model,
    GlobalMaxPool2D()
])
model.summary()


img = cv2.imread('D:/ML internship/image-search-engine/Dataset/MY_data/0.jpeg')
img = cv2.resize(img, (224, 224))
img = np.array(img)
expand_img = np.expand_dims(img, axis=0)
pre_img = preprocess_input(expand_img)
results = model.predict(pre_img).flatten()
normalized = results/norm(results)


neighbors = NearestNeighbors(
    n_neighbors=6, algorithm='brute', metric='euclidean')

neighbors.fit(feature_list)

distance, indices = neighbors.kneighbors([normalized])


# print(indices)

for file in indices[0][1:6]:
    # print(filename_list[file])
    imgname = cv2.imread(filename_list[file])
    cv2.imshow('image', imgname)
    cv2.waitKey(0)
