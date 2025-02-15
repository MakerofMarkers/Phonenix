import cv2


def extractFrames(videoPath, fps): 
    # Path to the input video file
    input_video_path = videoPath

    # Desired frames per second (FPS)
    desired_fps = fps

    # Open the video file
    video_capture = cv2.VideoCapture(input_video_path)

    # Check if the video file opened successfully
    if not video_capture.isOpened():
        print("Error: Could not open the video file.")
        exit()

    # Get the original FPS of the video
    original_fps = video_capture.get(cv2.CAP_PROP_FPS)

    # Calculate the interval between frames to extract
    frame_interval = int(original_fps // desired_fps)

    # Frame counter
    frame_count = 0

    while True:
        # Read the next frame from the video
        ret, frame = video_capture.read()

        # If the frame was not read successfully, break the loop
        if not ret:
            break

        # Save the frame if it's at the correct interval
        if frame_count % frame_interval == 0:
            frame_filename = f'frame_{frame_count:04d}.jpg'
            cv2.imwrite('extracted_images/' + frame_filename, frame)

        # Increment the frame counter
        frame_count += 1

    # Release the video capture object
    video_capture.release()

