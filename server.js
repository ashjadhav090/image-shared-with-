const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    const filePath = `${req.file.path}-${Date.now()}`;
    fs.renameSync(req.file.path, filePath);
    res.json({ url: `http://localhost:3000/download/${path.basename(filePath)}` });
});

// File download endpoint
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    if (fs.existsSync(filePath)) res.download(filePath);
    else res.status(404).send('File not found');
});

// Start the server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
