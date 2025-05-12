const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

const cors = require('cors');
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.post('/api/chat', (req, res) => {
    const conversationHistory = req.body.conversation;

    // 将整个对话历史传递给 Python 脚本
    const pythonProcess = spawn('python', ['./python.py', JSON.stringify(conversationHistory)]);

    let pythonOutput = '';
    pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error('Python error:', data.toString());
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            res.json({ reply: pythonOutput.trim() });
        } else {
            res.status(500).json({ reply: 'Sorry, something went wrong.' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
