import cv2
from ultralytics import YOLO
from config import config
import numpy as np

class Detector:
    def __init__(self):
        self.model = YOLO(config.model_path)
        
    def process_frame(self, frame):
        """Processes frame with YOLO & ByteTrack, returns unified detection list."""
        results = self.model.track(
            frame, 
            persist=True, 
            tracker=config.tracker_type, 
            verbose=False, 
            conf=config.confidence_threshold
        )
        
        detections = []
        annotated_frame = frame.copy()
        
        if len(results) > 0 and results[0].boxes is not None:
            boxes = results[0].boxes
            
            for box in boxes:
                if box.id is None:
                    continue
                track_id = int(box.id[0])
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                cls_id = int(box.cls[0].cpu().numpy())
                cls_name = self.model.names[cls_id]
                
                detections.append({
                    "id": track_id,
                    "bbox": [float(x1), float(y1), float(x2), float(y2)],
                    "class": cls_name
                })
                
                cv2.rectangle(annotated_frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
                cv2.putText(annotated_frame, f"#{track_id} {cls_name}", 
                            (int(x1), int(max(0, y1-10))), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                    
        return detections, annotated_frame
