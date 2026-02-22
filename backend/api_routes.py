from fastapi import APIRouter
from models import LinesConfig
from tracking import tracker

router = APIRouter()

@router.post("/set-lines")
async def set_lines(config: LinesConfig):
    tracker.set_lines(config)
    return {"message": "Lines updated successfully"}

@router.get("/get-stats")
async def get_stats():
    return tracker.get_stats()

@router.post("/reset-count")
async def reset_count():
    tracker.reset()
    return {"message": "Count reset successfully"}
