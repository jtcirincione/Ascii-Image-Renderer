from flask import Flask, render_template, Response
from flask_socketio import SocketIO, emit
import numpy as np, base64
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello, World!"

socketio = SocketIO(app, cors_allowed_origins="*")



@socketio.on('vid-frame')
def process_frame(frame_data):
    image_data = base64.b64decode(frame_data.split(",")[1])
    print(image_data)


# def frame_to_ascii(frame):
#     ascii_chars = " .:-=+*#%$@"
#     ascii_image = ""
#     for row in gray_frame:
#             for pixel_value in row:
#                 ascii_image += ascii_chars[(pixel_value * (len(ascii_chars) - 1)) // 255]
#             ascii_image += '\n'


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)