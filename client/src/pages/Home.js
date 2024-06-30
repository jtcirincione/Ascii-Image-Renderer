import { useEffect, useRef, useState } from "react";
import socketIOClient from 'socket.io-client';
import io from 'socket.io-client'


function Home() {

    // get data from backend
    const [data, setData] = useState(null);
    const[isPlaying, setIsPlaying] = useState(false)
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const ENDPOINT = "http://localhost:3001";
    let socket = io(ENDPOINT)
    
    const capture_frame = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext("2d");
            
            if (video && context && isPlaying == false) {
                context.drawImage(video , 0, 0);
                const image_data = canvas.toDataURL("image/jpeg", 0.1);                
                socket.emit("vid-frame", image_data);
            }
        }
    }

    useEffect(() => {
        // Set up video stream
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                const video = videoRef.current;
                if (video && isPlaying == false) {
                    video.srcObject = stream;
                    video.play().catch(error => console.log(error));
                    setIsPlaying(true)
                }
            })
            .catch(error => console.log("Error accessing video stream:", error));

        // Set up the interval to capture frames
        const intervalId = setInterval(capture_frame, 75);

        // Clean up the interval on component unmount
        return () => {
            clearInterval(intervalId);
            const video = videoRef.current;
            if (video) {
                video.pause();
                setIsPlaying(false)
            }
        }
    }, []);


    


    useEffect(() => {
        // Handle receiving data from the server
        socket.on('ascii_image', (data) => {
            setData(data.image);
        });

        // Clean up the socket connection on component unmount
    }, [socket]);


    return (
        <div>

            <video ref={videoRef} className="" width={640} height={480}></video>

            <canvas className="hidden" ref={canvasRef} width={640} height={480}>

            </canvas>
            {data && <pre>{data}</pre>}
        </div>


    );
}

export default Home;