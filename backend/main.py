import cv2
import threading
import time
import os
import shutil
import uvicorn
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from config import config
from tracking import tracker
from detection import Detector
from api_routes import router as api_router

app = FastAPI(title="FocusTrack Occ-Mon Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

detector = Detector()

class VideoState:
    def __init__(self):
        self.cap = None
        self.running = False
        self.lock = threading.Lock()
        self.current_frame = None
        self.mode = "live"

video_state = VideoState()

def process_video_loop():
    while True:
        with video_state.lock:
            if not video_state.running or video_state.cap is None:
                pass
            else:
                ret, frame = video_state.cap.read()
                if not ret:
                    if video_state.mode == "video":
                        video_state.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                else:
                    height, width = frame.shape[:2]
                    detections, annotated_frame = detector.process_frame(frame)
                    tracker.update(detections, width, height)
                    tracker.draw_lines(annotated_frame, width, height)

                    ret_encode, buffer = cv2.imencode('.jpg', annotated_frame)
                    if ret_encode:
                        video_state.current_frame = buffer.tobytes()

        time.sleep(1 / config.video_fps)

thread = threading.Thread(target=process_video_loop, daemon=True)
thread.start()

def video_generator():
    while True:
        frame_bytes = None
        with video_state.lock:
            if video_state.current_frame is not None:
                frame_bytes = video_state.current_frame
                
        if frame_bytes:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        time.sleep(1 / config.video_fps)

@app.get("/video-feed")
async def video_feed():
    return StreamingResponse(video_generator(), media_type="multipart/x-mixed-replace; boundary=frame")

@app.post("/upload-video")
async def upload_video(file: UploadFile = File(...)):
    with video_state.lock:
        if video_state.cap is not None:
            video_state.cap.release()
        
        file_location = f"temp_{file.filename}"
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
        
        video_state.cap = cv2.VideoCapture(file_location)
        video_state.running = True
        video_state.mode = "video"
        tracker.reset()
        
    return {"message": "Video uploaded and started successfully", "filename": file.filename}

@app.post("/start-live")
async def start_live():
    with video_state.lock:
        if video_state.cap is not None:
            video_state.cap.release()
            
        video_state.cap = cv2.VideoCapture(config.camera_id)
        video_state.running = True
        video_state.mode = "live"
        tracker.reset()
        
    return {"message": "Live camera started successfully"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
