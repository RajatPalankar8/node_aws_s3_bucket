const fs = require('fs');
const path = require('path');
const multer = require("multer");

//Multer that handle File Uploads
exports.upload = () => {
    return imageUpload = multer({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          const folderName = req.query.folderName;
          console.log(req.query);
          const path = `bucketFolder/${folderName}/`;
          fs.mkdirSync(path, { recursive: true })
          cb(null, path);
        },
        filename: function (req, file, cb) {
          cb(null, Date.now() + path.extname(file.originalname));
        }
      }),
      limits: { fileSize: 10000000 },
      fileFilter: function (req, file, cb) {
        cb(null, true);
      }
    })
  }