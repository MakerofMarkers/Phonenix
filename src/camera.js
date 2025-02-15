import React, { useEffect, useRef } from "react";

function CameraComponent() {
  const videoRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startCamera();
  }, []);

  return (
    <div>
      <video className="cameraFrame" ref={videoRef} autoPlay playsInline />
    </div>
  );
}

export default CameraComponent;
