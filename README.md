# Ascii-Image-Renderer
Fun little Flask/JavaScript project that generates an ASCII rendering of live video feed
- This application utilizes socket connections between the client/server 
## Usage
The app is deployed in docker via docker-compose:
- _docker-compose up --build_ to build the project
- Allow the app to use your camera
- Wait a few seconds for the client/server to initiate a socket connection
- Watch the live feed of ASCII frames print to the page!
