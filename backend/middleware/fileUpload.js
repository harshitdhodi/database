const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the directories for catalogue and photo uploads
const catalogueDir = path.join(__dirname, '../catalogues');
const photoDir = path.join(__dirname, '../images');

// Ensure the directories exist
if (!fs.existsSync(catalogueDir)) {
    fs.mkdirSync(catalogueDir);
}

if (!fs.existsSync(photoDir)) {
    fs.mkdirSync(photoDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Determine the directory based on the field name
        let uploadDir;
        if (file.fieldname === 'catalogue') {
            uploadDir = catalogueDir;
        } else if (file.fieldname === 'photo') {
            uploadDir = photoDir;
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        let fileName;
        if (file.fieldname === 'catalogue') {
            fileName = file.originalname;
            req.fileName = fileName; // Store the original file name in the request object
        } else if (file.fieldname === 'photo') {
            fileName = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
        }
        cb(null, fileName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: function (req, file, cb) {
        // Optional: Check file types here if needed
        cb(null, true);
    }
});

// Middleware function to handle single catalogue uploads and multiple photo uploads
const uploadPhoto = (req, res, next) => {
    upload.fields([
        { name: 'catalogue', maxCount: 1 },
        { name: 'photo', maxCount: 5 }
    ])(req, res, function (err) {
        if (err) {
            return res.status(400).send({ error: err.message });
        }
        next();
    });
};

module.exports = { uploadPhoto };
