import cv2
import numpy as np
import paramiko
import pyautogui
import time

# Screen recording settings
screen_width, screen_height = pyautogui.size()
codec = cv2.VideoWriter_fourcc(*"MJPG")
fps = 25
frame_size = (screen_width, screen_height)

# SSH settings for the remote machine
hostname = "shell3.doc.ic.ac.uk"
port = 22
username = "yg2719"
password = "Ss@97209258"
remote_path = "Videos"

# Create an SSH client
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    # Connect to the remote machine
    ssh.connect(hostname, port, username, password)
    transport = ssh.get_transport()

    # Create an SSH session for SFTP
    sftp = transport.open_session()
    sftp.get_pty()
    sftp.exec_command(f"mkdir -p {remote_path}")  # Create the remote directory if it doesn't exist

    # Create an MJPEG VideoWriter
    video_stream = cv2.VideoWriter("appsrc ! videoconvert ! "
                                   "x264enc noise-reduction=10000 speed-preset=ultrafast tune=zerolatency ! "
                                   "rtph264pay config-interval=1 pt=96 ! "
                                   f"udpsink host={hostname} port=5000", cv2.CAP_GSTREAMER, codec, fps, frame_size)

    while True:
        stdin, stdout, stderr = ssh.exec_command("echo LULU")
        # Read and print the output
        for line in stdout:
            print(line.strip())
        img = pyautogui.screenshot()
        frame = np.array(img)
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Write the frame to the video stream
        video_stream.write(frame)

except KeyboardInterrupt:
    # Stop recording on Ctrl+C
    pass

finally:
    # Release the video stream and close SSH connection
    video_stream.release()
    ssh.close()
    print("Screen recording stopped.")