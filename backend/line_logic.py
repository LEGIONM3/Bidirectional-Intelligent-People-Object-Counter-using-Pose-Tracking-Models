import numpy as np

def ccw(A, B, C):
    """Check if three points are listed in counter-clockwise order."""
    return (C[1] - A[1]) * (B[0] - A[0]) > (B[1] - A[1]) * (C[0] - A[0])

def intersect(A, B, C, D):
    """Return True if line segments AB and CD intersect."""
    return ccw(A, C, D) != ccw(B, C, D) and ccw(A, B, C) != ccw(A, B, D)

def get_direction(pt_start, pt_end, line_pt1, line_pt2):
    """
    Determine the direction of crossing.
    Uses the cross product of the line vector and the movement vector.
    """
    line_vec = np.array([line_pt2[0] - line_pt1[0], line_pt2[1] - line_pt1[1]])
    move_vec = np.array([pt_end[0] - pt_start[0], pt_end[1] - pt_start[1]])
    cross_prod = np.cross(line_vec, move_vec)
    return "entry" if cross_prod > 0 else "exit"
