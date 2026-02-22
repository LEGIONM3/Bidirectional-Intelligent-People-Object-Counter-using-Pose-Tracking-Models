# FlowCount AI

FlowCount AI is an AI-powered bidirectional entry and exit monitoring system built using deep learning and multi-object tracking. It detects, tracks, and counts people or objects crossing a defined boundary in both live and pre-recorded video streams.

The system is designed for workplace safety monitoring, occupancy tracking, and intelligent surveillance applications.

---

## Overview

FlowCount AI processes video input using object detection and tracking models to:

- Detect entities in real-time
- Assign persistent IDs using tracking
- Determine movement direction across a defined line
- Count entries and exits accurately
- Display live occupancy statistics

The monitoring boundary can be configured dynamically through the web interface.

---

## Features

- **Object Detection**: Uses YOLOv8 to detect people and objects in video frames.
- **Multi-Object Tracking**: Integrates ByteTrack to maintain consistent object identities across frames.
- **Bidirectional Counting**: Determines entry and exit direction using centroid tracking and vector-based line-crossing logic.
- **Dynamic Line Configuration**: Allows users to draw a monitoring line directly on the video feed.
- **Live & Pre-recorded Support**: Works with webcam feeds and uploaded video files.
- **Interactive Dashboard**: Displays real-time entry, exit, and occupancy statistics.

---

## Tech Stack

### Backend
- Python
- FastAPI
- OpenCV
- Ultralytics YOLOv8
- ByteTrack
- Uvicorn

### Frontend
- React (Vite)
- Tailwind CSS
- Lucide React

---

## System Workflow

1. Capture video frame (live or uploaded).
2. Perform object detection using YOLOv8.
3. Track detected objects using ByteTrack.
4. Compute centroids for each tracked object.
5. Evaluate object position relative to the configured line.
6. Update entry or exit count based on movement direction.
7. Display updated statistics on the frontend dashboard.

Double counting is prevented using object ID state tracking.

---

## Project Structure

backend/
- FastAPI server
- YOLO model initialization
- Tracking pipeline
- Line crossing logic
- Video processing loop

frontend/
- React application
- Interactive video canvas
- API integration
- Live statistics components

---

## Setup & Installation

### Prerequisites

- Python 3.8+
- Node.js & npm

---

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/Scripts/activate   # Windows
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
