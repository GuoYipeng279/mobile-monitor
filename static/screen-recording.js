console.log('JavaScript file loaded');

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const recordedVideo = document.getElementById('recordedVideo');
const liveVideo = document.getElementById('liveVideo'); // Add an element for live video

let mediaRecorder;
let recordedChunks = [];

startButton.addEventListener('click', async () => {
    console.log('Button clicked');
    
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

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            recordedChunks = [];
            const url = window.URL.createObjectURL(blob);
            recordedVideo.src = url;
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