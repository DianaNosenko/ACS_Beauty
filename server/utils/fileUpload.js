const fs = require("fs");
const path = require("path");
const multer = require("multer");
const ServerError = require("../errors/ServerError");
const env = process.env.NODE_ENV || "development";
const devFilePath = path.resolve(__dirname, "../../public/images");

const filePath = env === "production" ? "/var/www/html/images/" : devFilePath;

if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath, {
    recursive: true,
  });
}

const storageImageFiles = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, filePath);
  },
  filename(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const uploadImageMulter = multer({ storage: storageImageFiles }).single("file");

module.exports.uploadImage = (req, res, next) => {
  uploadImageMulter(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      next(new ServerError());
    } else if (err) {
      next(new ServerError());
    }
    return next();
  });
};
