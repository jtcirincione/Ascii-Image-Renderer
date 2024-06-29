import { useEffect, useRef, useState } from "react";
import socketIOClient from 'socket.io-client';


function Home() {

    // get data from backend
    const [data, setData] = useState(null);
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const ENDPOINT = "http://localhost:80";
    let socket = socketIOClient(ENDPOINT)
    
    const capture_frame = () => {
        let video = videoRef.current;
        let canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext("2d");
            
            if (video && context) {
                context.drawImage(video , 0, 0);
                const image_data = canvas.toDataURL("image/png");
                socket.emit("video_frame", image_data);
            }
        }
    }

    useEffect(() => {
        // Set up video stream
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                const video = videoRef.current;
                if (video) {
                    video.srcObject = stream;
                    video.play().catch(error => console.log(error));
                }
            })
            .catch(error => console.log("Error accessing video stream:", error));

        // Set up the interval to capture frames
        const intervalId = setInterval(capture_frame, 100);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);


    useEffect(() => {
        // Handle receiving data from the server
        socket.on('ascii_image', (data) => {
            setData(data.image);
        });

        // Clean up the socket connection on component unmount
        return () => socket.disconnect();
    }, [socket]);


    return (
        <div>

            <video ref={videoRef} className="" width={640} height={480} autoPlay></video>

            <canvas ref={canvasRef} width={640} height={480}>

            </canvas>
        </div>


    );
}

export default Home;