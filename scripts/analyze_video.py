import sys, json, math
import cv2
import numpy as np
import mediapipe as mp

mp_pose = mp.solutions.pose
mp_face = mp.solutions.face_mesh

def clamp(x, a, b):
    return max(a, min(b, x))

def dist(a, b):
    return float(np.linalg.norm(np.array(a) - np.array(b)))

def analyze(video_path: str, sample_fps: int = 10):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return {"error": "could_not_open_video"}

    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    frame_step = max(1, int(round(fps / sample_fps)))

    # Counters
    total_sampled = 0

    posture_valid = 0
    posture_good = 0

    eye_valid = 0
    eye_good = 0

    expr_valid = 0
    expr_good = 0

    # thresholds 
    # TODO: (Need Tuning Still)
    SHOULDER_LEVEL_MAX = 0.06   # normalized y-diff (image coords)
    LEAN_MAX = 0.18             # normalized x-shift of nose vs hips center
    FACE_YAW_MAX = 12.0         # degrees (approx proxy)
    FACE_PITCH_MAX = 12.0       # degrees (approx proxy)
    SMILE_MIN = 0.35            # heuristic "smile score" threshold

    pose = mp_pose.Pose(
        static_image_mode=False,
        model_complexity=1,
        enable_segmentation=False,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    )
    face = mp_face.FaceMesh(
        static_image_mode=False,
        refine_landmarks=True,   # better eyes/iris landmarks
        max_num_faces=1,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    )

    frame_idx = 0
    while True:
        ok, frame = cap.read()
        if not ok:
            break

        if frame_idx % frame_step != 0:
            frame_idx += 1
            continue

        total_sampled += 1
        frame_idx += 1

        h, w = frame.shape[:2]
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        pose_res = pose.process(rgb)
        face_res = face.process(rgb)

        # ---------------------------
        # Posture (Pose landmarks)
        # ---------------------------
        if pose_res.pose_landmarks:
            lm = pose_res.pose_landmarks.landmark
            # keypoints (normalized)
            ls = (lm[mp_pose.PoseLandmark.LEFT_SHOULDER].x,  lm[mp_pose.PoseLandmark.LEFT_SHOULDER].y)
            rs = (lm[mp_pose.PoseLandmark.RIGHT_SHOULDER].x, lm[mp_pose.PoseLandmark.RIGHT_SHOULDER].y)
            lh = (lm[mp_pose.PoseLandmark.LEFT_HIP].x,       lm[mp_pose.PoseLandmark.LEFT_HIP].y)
            rh = (lm[mp_pose.PoseLandmark.RIGHT_HIP].x,      lm[mp_pose.PoseLandmark.RIGHT_HIP].y)
            nose = (lm[mp_pose.PoseLandmark.NOSE].x,         lm[mp_pose.PoseLandmark.NOSE].y)

            posture_valid += 1

            shoulder_level = abs(ls[1] - rs[1])  # y-diff
            hip_center = ((lh[0] + rh[0]) / 2.0, (lh[1] + rh[1]) / 2.0)

            # "lean" proxy: how far nose is horizontally from hip center
            lean = abs(nose[0] - hip_center[0])

            good_posture = (shoulder_level <= SHOULDER_LEVEL_MAX) and (lean <= LEAN_MAX)
            if good_posture:
                posture_good += 1

        # ---------------------------
        # Eye contact (Face Mesh proxy)
        # ---------------------------
        if face_res.multi_face_landmarks:
            fl = face_res.multi_face_landmarks[0].landmark

            eye_valid += 1

            # points: left/right eye outer corners + nose tip-ish
            # MediaPipe indices: 33 (left eye outer), 263 (right eye outer), 1 (nose tip)
            pL = np.array([fl[33].x, fl[33].y])
            pR = np.array([fl[263].x, fl[263].y])
            pN = np.array([fl[1].x, fl[1].y])

            # Yaw proxy: nose closer to one eye indicates head turned.
            # Normalize by eye distance
            eye_dist = float(np.linalg.norm(pL - pR)) + 1e-6
            left_dist = float(np.linalg.norm(pN - pL)) / eye_dist
            right_dist = float(np.linalg.norm(pN - pR)) / eye_dist
            yaw_ratio = (left_dist - right_dist)  # ~0 when centered

            # convert ratio to pseudo-degrees (rough)
            yaw_deg = yaw_ratio * 60.0

            # Pitch proxy: nose y relative to eye line
            eye_y = (pL[1] + pR[1]) / 2.0
            pitch_ratio = (pN[1] - eye_y) / (eye_dist + 1e-6)
            pitch_deg = pitch_ratio * 60.0

            good_eye = (abs(yaw_deg) <= FACE_YAW_MAX) and (abs(pitch_deg) <= FACE_PITCH_MAX)
            if good_eye:
                eye_good += 1

            # ---------------------------
            # Facial expression (simple smile heuristic)
            # ---------------------------
            expr_valid += 1

            # mouth corners + upper/lower lip
            # indices: 61 (left mouth corner), 291 (right mouth corner), 13 (upper), 14 (lower)
            mL = np.array([fl[61].x, fl[61].y])
            mR = np.array([fl[291].x, fl[291].y])
            up = np.array([fl[13].x, fl[13].y])
            lo = np.array([fl[14].x, fl[14].y])

            mouth_width = float(np.linalg.norm(mL - mR)) + 1e-6
            mouth_open = float(np.linalg.norm(up - lo))

            # smile heuristic: wider mouth and not overly open (tends to correlate with smile vs talking)
            smile_score = (mouth_width) / (mouth_width + mouth_open + 1e-6)

            good_expr = smile_score >= SMILE_MIN
            if good_expr:
                expr_good += 1

    cap.release()
    pose.close()
    face.close()

    def pct(good, valid):
        return round((good / valid) * 100.0, 1) if valid > 0 else None

    return {
        "video": {
            "sample_fps": sample_fps,
            "total_sampled_frames": total_sampled,
        },
        "posture": {
            "valid_frames": posture_valid,
            "good_frames": posture_good,
            "good_percent": pct(posture_good, posture_valid),
            "notes": {
                "shoulder_level_max": SHOULDER_LEVEL_MAX,
                "lean_max": LEAN_MAX,
            },
        },
        "eye_contact": {
            "valid_frames": eye_valid,
            "good_frames": eye_good,
            "good_percent": pct(eye_good, eye_valid),
            "notes": {
                "yaw_max_deg_proxy": FACE_YAW_MAX,
                "pitch_max_deg_proxy": FACE_PITCH_MAX,
            },
        },
        "facial_expression": {
            "valid_frames": expr_valid,
            "good_frames": expr_good,
            "good_percent": pct(expr_good, expr_valid),
            "notes": {
                "smile_min": SMILE_MIN,
                "warning": "This is a simple heuristic; a real emotion model is more accurate."
            },
        },
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing video_path argument"}))
        sys.exit(1)

    video_path = sys.argv[1]
    result = analyze(video_path)
    print(json.dumps(result))
