const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const recordedVideo = document.getElementById('recordedVideo');
const liveVideo = document.getElementById('liveVideo'); // Add an element for live video

let mediaRecorder;
let recordedChunks = [];

startButton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: 'always' } }); // Record the entire screen

        // Display the live video stream
        liveVideo.srcObject = stream;

        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                recordedChunks.push(e.data);
            }
        };

        mediaRecorder.onstop = async () => {
            window.alert("STOP!!");
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            recordedChunks = [];
            const url = window.URL.createObjectURL(blob);
            recordedVideo.src = url;

            // Upload the recorded video to your server via SSH
            try {
                const { NodeSSH } = require('node-ssh');
                const ssh = new NodeSSH();

                // SSH connection parameters
                const sshConfig = {
                    host: 'shell3.doc.ic.ac.uk',
                    username: 'yg2719',
                    privateKey: 'private-key-file.pem', // Replace with your private key file path
                };

                // Connect to the SSH server
                await ssh.connect(sshConfig);

                // Upload the video file to the remote server
                await ssh.putFile(blob, 'Videos/recorded-video.webm');

                // Disconnect from the SSH server
                ssh.dispose();
                window.alert("SUCCESS");

                console.log('Video uploaded successfully via SSH.');
            } catch (error) {
                window.alert("FAIL");
                window.alert(error);
                console.error('Error uploading video via SSH:', error);
            }
        };

        mediaRecorder.start();
        startButton.disabled = true;
        stopButton.disabled = false;
    } catch (error) {
        console.error('Error accessing screen recording:', error);
    }
});

stopButton.addEventListener('click', () => {
    mediaRecorder.stop();
    startButton.disabled = false;
    stopButton.disabled = true;
});