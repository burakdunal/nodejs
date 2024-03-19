//product edit için file upload gerekli mi kontrolü
const isUploadRequired = (req, res, next) => {

  let fileExists = false;

  if(req.image !== ""){
    fileExists = true;
  }
  // req.fileExists = fileExists
  next();
};

module.exports = isUploadRequired;