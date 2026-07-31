const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * Creates a multer instance that stores files inside /uploads/<folderName>
 * Usage: upload("products").single("image")  OR  upload("products").array("images", 5)
 */
const upload = (folderName = "misc") => {
  const uploadPath = path.join(__dirname, "..", "uploads", folderName);

  // Make sure the destination folder exists
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${folderName}-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${ext}`;
      cb(null, uniqueName);
    },
  });
const fileFilter = (req, file, cb) => {

  // Images
  const imageTypes = /jpeg|jpg|png|webp|gif/;

  // Videos
  const videoTypes = /mp4|mov|avi|mkv|webm/;

  // Audio
  const audioTypes = /mp3|wav|aac|ogg|m4a/;

  const ext = path.extname(file.originalname).toLowerCase();

  // Image
  if (
    imageTypes.test(ext) &&
    file.mimetype.startsWith("image/")
  ) {
    return cb(null, true);
  }

  // Video
  if (
    videoTypes.test(ext) &&
    file.mimetype.startsWith("video/")
  ) {
    return cb(null, true);
  }

  // Audio
  if (
    audioTypes.test(ext) &&
    file.mimetype.startsWith("audio/")
  ) {
    return cb(null, true);
  }

  cb(
    new Error(
      "Only image, video and audio files are allowed"
    )
  );
};
  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 }, // 5MB
  });
};

module.exports = upload;
