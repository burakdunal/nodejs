const multer = require("multer");
const path = require("path");
const slugField = require("./slugfield");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images/products/');
    },
    filename: function(req, file, cb) {
        const customFileName = slugField(req.body.name);
        cb(null, customFileName +"-"+ Date.now() + path.extname(file.originalname));
    }
});

const imageUpload = multer({
    storage: storage
}); 


//export module

module.exports = imageUpload;