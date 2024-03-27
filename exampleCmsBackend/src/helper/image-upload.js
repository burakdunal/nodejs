const multer = require("multer");
const path = require("path");
const slugField = require("./slugfield");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let fileDestination;
        if (req.body.isProduct === 'true') {
            fileDestination = path.join(__dirname, '../public/images/products/');
        } else {
            fileDestination = path.join(__dirname,'../public/images/categories/');
        }
        cb(null, fileDestination);
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