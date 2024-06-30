from flask import Flask, render_template, Response
from flask_socketio import SocketIO, emit
import numpy as np, base64
import cv2
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello, World!"

socketio = SocketIO(app, cors_allowed_origins="*")

ascii_chars = "@$%#BWXT*+=-:.          "

table = [ascii_chars[(i * (len(ascii_chars) - 1)) // 255] for i in range(256)]


@socketio.on('vid-frame')
def process_frame(frame_data):
    image_data = base64.b64decode(frame_data.split(",")[1])
    np_arr = np.frombuffer(image_data, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    # print("received!")
    ascii_image = frame_to_ascii(frame)
    
    # Send the ASCII image back to the client
    emit('ascii_image', {'image': ascii_image})



def frame_to_ascii(frame):

    height, width = frame.shape[:2]
    aspect_ratio = height / width
    ## play with these numbers to change resolution/size of ascii image
    new_width = 200
    new_height = int(aspect_ratio * new_width * .5)
    resized_frame = cv2.resize(frame, (new_width, new_height))
    
    # Convert to grayscale
    gray_frame = cv2.cvtColor(resized_frame, cv2.COLOR_BGR2GRAY)
    ascii_image = ""
    for row in gray_frame:
            for pixel_value in row:
                idx = pixel_value
                if idx < 0: idx = 0
                ascii_image += table[idx]
            ascii_image += '\n'

    # print(f"Ascii image: {ascii_image}")
    return ascii_image


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0',  port=3001, debug=True, allow_unsafe_werkzeug=True)