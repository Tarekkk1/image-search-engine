from flask import Flask, request, jsonify
import tensorflow
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from keras.layers import GlobalMaxPool2D
import cv2
import numpy as np
from numpy.linalg import norm
import pickle
from sklearn.neighbors import NearestNeighbors

app = Flask(__name__)

feature_list = np.array(pickle.load(
    open('D:/ML internship/image-search-engine/main/model/featurevector1.pkl', 'rb')))
filename_list = pickle.load(
    open('D:/ML internship/image-search-engine/main/model/filenames1.pkl', 'rb'))

model = ResNet50(weights='imagenet', include_top=False,
                 input_shape=(224, 224, 3))
model.trainable = False

model = tensorflow.keras.Sequential([
    model,
    GlobalMaxPool2D()
])
model.summary()


@app.route('/search', methods=['POST'])
def search_image():
    try:

        file = request.files['image']
        img = cv2.imdecode(np.fromstring(
            file.read(), np.uint8), cv2.IMREAD_COLOR)

        img = cv2.resize(img, (224, 224))
        img = np.array(img)
        expand_img = np.expand_dims(img, axis=0)
        pre_img = preprocess_input(expand_img)
        results = model.predict(pre_img).flatten()
        normalized = results / norm(results)

        neighbors = NearestNeighbors(
            n_neighbors=6, algorithm='brute', metric='euclidean')
        neighbors.fit(feature_list)

        distance, indices = neighbors.kneighbors([normalized])

        similar_images = [filename_list[file] for file in indices[0][1:6]]

        return jsonify(similar_images)
    except Exception as e:
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True)
