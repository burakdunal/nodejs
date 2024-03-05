const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images/');
    },
    filename: function(req, file, cb) {
        cb(null, path.parse(file.originalname).name +"-"+ Date.now() + path.extname(file.originalname));
    }
});

const imageUpload = multer({
    storage: storage
}); 

//export module

module.exports = imageUpload;