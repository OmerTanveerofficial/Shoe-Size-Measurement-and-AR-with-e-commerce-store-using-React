from flask import Flask, request, jsonify
from flask_cors import CORS
from skimage.io import imread
import os
import shutil

from utils import *
import cv2

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'data'
OUTPUT_FOLDER = 'output'

@app.route('/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'success': False, 'message': 'No image file provided'}), 400

    # Save uploaded file as 'barefeet1.jpeg'
    file = request.files['image']
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    img_path = os.path.join(UPLOAD_FOLDER, 'barefeet1.jpeg')
    file.save(img_path)

    try:
        # ✅ Exact same logic from your main()
        oimg = imread(img_path)

        if not os.path.exists(OUTPUT_FOLDER):
            os.makedirs(OUTPUT_FOLDER)

        preprocessedOimg = preprocess(oimg)
        cv2.imwrite('output/preprocessedOimg.jpg', preprocessedOimg)

        clusteredImg = kMeans_cluster(preprocessedOimg)
        cv2.imwrite('output/clusteredImg.jpg', clusteredImg)

        edgedImg = edgeDetection(clusteredImg)
        cv2.imwrite('output/edgedImg.jpg', edgedImg)

        boundRect, contours, contours_poly, img = getBoundingBox(edgedImg)
        pdraw = drawCnt(boundRect[1], contours, contours_poly, img)
        cv2.imwrite('output/pdraw.jpg', pdraw)

        croppedImg, pcropedImg = cropOrig(boundRect[1], clusteredImg)
        cv2.imwrite('output/croppedImg.jpg', croppedImg)

        newImg = overlayImage(croppedImg, pcropedImg)
        cv2.imwrite('output/newImg.jpg', newImg)

        fedged = edgeDetection(newImg)
        fboundRect, fcnt, fcntpoly, fimg = getBoundingBox(fedged)
        fdraw = drawCnt(fboundRect[2], fcnt, fcntpoly, fimg)
        cv2.imwrite('output/fdraw.jpg', fdraw)

        feet_size_cm = calcFeetSize(pcropedImg, fboundRect) / 10
        return jsonify({'success': True, 'size_cm': round(feet_size_cm, 2)})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)