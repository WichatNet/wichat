const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();

// Configure multer to store uploaded files in the 'uploads' directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/avatars'); // Directory for avatar uploads
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
});
const upload = multer({ storage: storage });

app.use(express.json()); // Parse JSON bodies

// Serve static files (HTML, JS, etc.)
app.use(express.static('public'));

// Endpoint to create a new user (signup)
app.post('/create_user', upload.single('avatar'), (req, res) => {
    const userData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.file ? `/uploads/avatars/${req.file.filename}` : '', // Store avatar path
        onlineStatus: false
    };

    const userFilePath = path.join(__dirname, 'users', `${userData.username}.json`);

    // Check if user already exists
    if (fs.existsSync(userFilePath)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Write new user data to JSON file
    fs.writeFile(userFilePath, JSON.stringify(userData), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to create user' });
        }
        res.status(201).json({ message: 'User created successfully' });
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
