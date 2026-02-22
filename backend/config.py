import os
from pydantic import BaseModel

class AppConfig(BaseModel):
    model_path: str = os.getenv("MODEL_PATH", "yolov8n.pt")
    confidence_threshold: float = float(os.getenv("CONFIDENCE_THRESHOLD", 0.4))
    tracker_type: str = os.getenv("TRACKER_TYPE", "bytetrack.yaml")
    video_fps: int = 30
    camera_id: int = int(os.getenv("CAMERA_ID", 0))

config = AppConfig()
