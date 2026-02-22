# FocusTrack Occ-Mon Engine

FocusTrack Occ-Mon Engine is a comprehensive, AI-powered bidirectional occupancy monitoring system. It leverages advanced computer vision models to detect and track entities (people, animals, objects) as they move through a defined space, accurately counting entries and exits over a dynamically configurable goal line.

## Features

- **Object Detection**: Uses YOLOv8 to accurately identify objects in the video feed.
- **Multi-Object Tracking**: Utilizes ByteTrack to consistently track objects across multiple frames, handling occlusion smoothly.
- **Dynamic Configuration**: Draw a goal line directly on the video feed to monitor entries and exits in real-time.
- **Bidirectional Counting**: Accurately determines the direction of movement (entry vs. exit) using vector mathematics and centroid calculations.
- **Live & Pre-recorded Video**: Supports both live camera feeds and pre-recorded video file uploads.
- **Interactive UI**: A sleek, responsive dashboard built with React and Tailwind CSS.

## Tech Stack

- **Backend**: Python, FastAPI, OpenCV, Ultralytics (YOLOv8), Uvicorn
- **Frontend**: React (Vite), Tailwind CSS, Lucide React

## Project Structure

- `/backend`: Contains the FastAPI server, YOLOv8 model initialization, line crossing mathematical logic, and video processing loops.
- `/frontend`: Contains the Vite + React application, interactive video canvas, and live statistics components.

## Setup & Installation

### Prerequisites

- Python 3.8+
- Node.js & npm 

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/Scripts/activate # Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend Server:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to the frontend URL (typically `http://localhost:5173`).
2. Choose to **Start Live Camera** or **Upload a Video**.
3. Once the video feed is playing, click and drag on the video player to draw your goal line.
4. The system will track objects and update the live statistics as they cross the configured line.
