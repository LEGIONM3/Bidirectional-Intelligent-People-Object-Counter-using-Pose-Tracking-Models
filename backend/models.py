from pydantic import BaseModel
from typing import List

class Point(BaseModel):
    x: float
    y: float

class LineDefinition(BaseModel):
    pt1: Point
    pt2: Point

class LinesConfig(BaseModel):
    lines: List[LineDefinition]
    video_width: int
    video_height: int
