// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer les dossiers s'ils n'existent pas
const uploadDirs = ['uploads/events', 'uploads/candidates', 'uploads/agencies'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    if (file.fieldname === 'eventImage') {
      uploadPath += 'events/';
    } else if (file.fieldname.startsWith('candidateImage')) {
      uploadPath += 'candidates/';
    } else {
      uploadPath += 'agencies/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

exports.uploadEventFiles = upload.fields([
  { name: 'eventImage', maxCount: 1 },
  { name: 'candidateImage0', maxCount: 1 },
  { name: 'candidateImage1', maxCount: 1 },
  { name: 'candidateImage2', maxCount: 1 },
  { name: 'candidateImage3', maxCount: 1 },
  { name: 'candidateImage4', maxCount: 1 },
  { name: 'candidateImage5', maxCount: 1 }
]);

exports.uploadSingle = upload.single('image');