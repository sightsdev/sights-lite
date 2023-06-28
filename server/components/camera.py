from dataclasses import dataclass
import cv2
import asyncio

import simplejpeg as simplejpeg
from pydantic import BaseModel
from starlette.requests import Request
from starlette.exceptions import HTTPException

class CameraParameters(BaseModel):
    source: int | str
    id: str
    framerate: int
    width: int 
    height: int
    quality: int

class Camera:
    def __init__(self, parameters: CameraParameters):
        self.parameters = parameters
        self.capture = cv2.VideoCapture(parameters.source) #, cv2.CAP_OPENCV_MJPEG)
        # Resolution
        if parameters.width != 0 and parameters.height != 0:
            self.capture.set(cv2.CAP_PROP_FRAME_WIDTH, parameters.width)
            self.capture.set(cv2.CAP_PROP_FRAME_HEIGHT, parameters.height)
        # Framerate
        if parameters.framerate != 0:
            self.capture.set(cv2.CAP_PROP_FPS, parameters.framerate)
        # Try open camera
        if not self.capture.isOpened():
            raise RuntimeError("Could not start video.")

    async def frames(self):
        ret, frame = self.capture.read()
        #frame_bytes = cv2.imencode(".jpg", frame)[1].tobytes()
        # Using simplejpeg should be much more performant than OpenCV for compressing JPGs
        frame_bytes = simplejpeg.encode_jpeg(
            frame,
            quality=self.parameters.quality,
            colorspace="BGR",
            colorsubsampling="422",
            fastdct=True,
        )
        yield frame_bytes
        await asyncio.sleep(0)

class CameraComponent:
    @staticmethod
    def list_available():
        # checks the first 10 indexes.
        index = 0
        arr = []
        i = 10
        while i > 0:
            cap = cv2.VideoCapture(index)
            if cap.read()[0]:
                arr.append(index)
                cap.release()
            index += 1
            i -= 1
        return arr

    @staticmethod
    async def stream(scope, receive, send):
        message = await receive()
        request = Request(scope, receive)

        camera_id: str = request.path_params['id']
        try:
            camera = Camera(request.app.state.cameras[camera_id])
        except:
            raise HTTPException(404)
        
        if message["type"] == "http.request":
            await send(
                {
                    "type": "http.response.start",
                    "status": 200,
                    "headers": [
                        [b"Content-Type", b"multipart/x-mixed-replace; boundary=frame"]
                    ],
                }
            )
            while not receive.__self__.disconnected:
                async for frame in camera.frames():
                    data = b"".join(
                        [
                            b"--frame\r\n",
                            b"Content-Type: image/jpeg\r\n\r\n",
                            frame,
                            b"\r\n",
                        ]
                    )
                    await send(
                        {"type": "http.response.body", "body": data, "more_body": True}
                    )
                