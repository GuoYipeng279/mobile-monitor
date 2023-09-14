const express = require('express');
const Pusher = require('pusher');

const app = express();
const port = process.env.PORT || 3000;

const pusher = new Pusher({
    appId: '1670948',
    key: '80d79350fe76710ea755',
    secret: '821032f4612f7201499a',
    cluster: 'eu',
});

// Handle incoming requests (e.g., HTTP routes)
app.get('/', (req, res) => {
    // Trigger a Pusher event
    pusher.trigger('my-channel', 'my-event', {
        message: 'Hello, world!',
    });

    res.send('Event triggered!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});