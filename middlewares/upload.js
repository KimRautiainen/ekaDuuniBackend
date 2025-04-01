const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// ✅ Job media storage configuration
const jobMediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/jobs/';
    createUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `job_${Date.now()}${path.extname(file.originalname)}`);
  },
});

// ✅ Profile picture storage
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/profiles/';
    createUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `profile_${req.user.id}${path.extname(file.originalname)}`);
  },
});

// ✅ Profile cover photo storage
const coverPhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/profiles/cover_photos/';
    createUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `cover_${req.user.id}${path.extname(file.originalname)}`);
  },
});

// ✅ Project media storage (handles multiple images/videos)
const projectMediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/projects/';
    createUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `project_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// ✅ File filter: Allow images & videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(
      new Error(
        'Only images (jpeg, jpg, png, gif) and videos (mp4, mov, avi, mkv) are allowed!'
      ),
      false
    );
  }
};

// ✅ Multer configurations
const uploadProfilePicture = multer({
  storage: profileStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
});

const uploadCoverPhoto = multer({
  storage: coverPhotoStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

const uploadProjectMedia = multer({
  storage: projectMediaStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max file size for videos/images
});

const uploadJobMedia = multer({
  storage: jobMediaStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max file size
});

// ✅ Combined profile asset upload (profile picture + cover photo)
const uploadProfileAssets = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadPath;
      if (file.fieldname === 'profile_picture') {
        uploadPath = 'uploads/profiles/';
      } else if (file.fieldname === 'cover_photo') {
        uploadPath = 'uploads/profiles/cover_photos/';
      } else {
        return cb(new Error('Invalid file field'), false);
      }

      createUploadDir(uploadPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      if (file.fieldname === 'profile_picture') {
        cb(null, `profile_${req.user.id}${ext}`);
      } else if (file.fieldname === 'cover_photo') {
        cb(null, `cover_${req.user.id}${ext}`);
      } else {
        cb(new Error('Invalid file field'), false);
      }
    },
  }),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

module.exports = {
  uploadProfilePicture,
  uploadProjectMedia,
  uploadJobMedia,
  uploadCoverPhoto,
  uploadProfileAssets,
};
