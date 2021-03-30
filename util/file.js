const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

// initialize multer
// upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + Math.random() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // allow ext
    const fileTypes = /jpg|jpeg|png|gif|svg/;
    // check ext
    const extname = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    // check mime
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('فایل اپلودی باید تصویر باشه');
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// delete file
const deleteFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};

module.exports = {
    deleteFile,
    upload
};
