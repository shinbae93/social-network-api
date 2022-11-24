const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: 'dpor8tl65',
  api_key: '965494638649583',
  api_secret: 'LQyRWAyM93mgFX5C3pU52trrPvw'
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'posts'
  },
  allowedFormats: ['jpg', 'png'],
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
