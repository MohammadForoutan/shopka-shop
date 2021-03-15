const fs = require('fs')
const path = require('path')
const multer = require('multer')


// delete file
const deleteFile = (filePath) => {
    fs.unlink(filePath, err=> {
        console.log(err);
    })
}

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



module.exports = {
    deleteFile,
    upload
}