from line_logic import intersect, get_direction
import cv2

class OccupancyTracker:
    def __init__(self):
        self.tracks = {}  # History of centroids map tracking ID to List of (x,y)
        self.counted_ids = set() # Prevents double counting
        self.entries = 0
        self.exits = 0
        # Lines in relative coordinates (0 to 1)
        self.relative_lines = [] 
        self.classes_count = {}

    def set_lines(self, lines_config):
        self.relative_lines = lines_config.lines

    def get_absolute_lines(self, width, height):
        abs_lines = []
        for line in self.relative_lines:
            pt1 = (line.pt1.x * width, line.pt1.y * height)
            pt2 = (line.pt2.x * width, line.pt2.y * height)
            abs_lines.append((pt1, pt2))
        return abs_lines

    def update(self, detections, width, height):
        """Updates internal centroid history and executes mathematical intersection scans."""
        abs_lines = self.get_absolute_lines(width, height)
        
        for det in detections:
            track_id = det["id"]
            if track_id is None:
                continue
                
            bbox = det["bbox"]
            cls_name = det["class"]
            
            cx = (bbox[0] + bbox[2]) / 2.0
            cy = (bbox[1] + bbox[3]) / 2.0
            centroid = (cx, cy)
            
            if track_id not in self.tracks:
                self.tracks[track_id] = []
                
            self.tracks[track_id].append(centroid)
            
            # Prune queue to keep minimal historical data required for a cross check
            if len(self.tracks[track_id]) > 10:
                self.tracks[track_id].pop(0)
                
            if track_id in self.counted_ids:
                continue
                
            # Perform Cross Detection
            if len(self.tracks[track_id]) >= 2 and len(abs_lines) > 0:
                p1_historical = self.tracks[track_id][-2]
                p2_current = self.tracks[track_id][-1]
                
                for line_start, line_end in abs_lines:
                    if intersect(p1_historical, p2_current, line_start, line_end):
                        cross_dir = get_direction(p1_historical, p2_current, line_start, line_end)
                        
                        if cross_dir == "entry":
                            self.entries += 1
                        else:
                            self.exits += 1
                            
                        self.counted_ids.add(track_id)
                        self.classes_count[cls_name] = self.classes_count.get(cls_name, 0) + 1
                        break

    def get_stats(self):
        return {
            "entries": self.entries,
            "exits": self.exits,
            "current_occupancy": max(0, self.entries - self.exits),
            "class_breakdown": self.classes_count
        }

    def reset(self):
        self.entries = 0
        self.exits = 0
        self.tracks.clear()
        self.counted_ids.clear()
        self.classes_count.clear()

    def draw_lines(self, frame, width, height):
        abs_lines = self.get_absolute_lines(width, height)
        for pt1, pt2 in abs_lines:
            cv2.line(frame, (int(pt1[0]), int(pt1[1])), (int(pt2[0]), int(pt2[1])), (0, 0, 255), 2)

tracker = OccupancyTracker()
