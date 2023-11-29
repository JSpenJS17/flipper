const express = require('express');
const fs = require('fs/promises');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;

// Coin flip logic (heads: +1 point)
async function flipCoin() {
    const isHeads = Math.random() < 0.5;
    if (isHeads) {
        await points;
        points += 1;
        savePointsToFile();
    }
    console.log(`Coin flip: ${isHeads ? 'heads' : 'tails'}`);

    updateHistory(isHeads);
}

// Update coin flip history
async function updateHistory(isHeads) {
    const date = new Date();
    const flip = isHeads ? 'heads' : 'tails';
    try {
        await fs.appendFile('history.txt', `${flip} - ${date.toDateString()}\n`);
    } catch (error) {
        console.error('Error writing history file:', error.message);
    }
}

// Read points from file on server start
async function loadPointsFromFile() {
    try {
        const data = await fs.readFile('points.txt', 'utf-8');
        points = parseInt(data) || 0;
    } catch (error) {
        console.error('Error reading points file:', error.message);
    }
}

// Save points to file
async function savePointsToFile() {
    try {
        await fs.writeFile('points.txt', points.toString());
    } catch (error) {
        console.error('Error writing points file:', error.message);
    }
}

let points = loadPointsFromFile();
// Schedule daily coin flip (minute 0, hour 0)
cron.schedule('0 0 * * *', flipCoin);

// Endpoint to get points
app.get('/points.txt', (req, res) => {
    res.json({ points });
});

// Start server
(async () => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();

