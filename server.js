const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        console.error('No file uploaded.');
        return res.status(400).send('No file uploaded.');
    }

    // Preserve the original file extension
    const ext = path.extname(req.file.originalname);
    const newFilePath = `${req.file.path}-${Date.now()}${ext}`;

    // Rename the file to include the extension and timestamp
    fs.rename(req.file.path, newFilePath, (err) => {
        if (err) {
            console.error('Error saving file:', err);
            return res.status(500).send('Error saving file.');
        }
        console.log(`File saved to ${newFilePath}`);
        res.json({ url: `http://localhost:3000/download/${path.basename(newFilePath)}` });
    });
});

// File download endpoint
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        console.error('File not found:', filePath);
        res.status(404).send('File not found');
    }
});

// Start the server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
