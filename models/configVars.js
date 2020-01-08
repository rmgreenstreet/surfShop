const multer = require('multer');
const cloudinary = require('cloudinary');


//configure where/how files are stored in cloudinary
let storage = multer.diskStorage({
    filename: function(req,file,callback) {
        callback(null,Date.now() + file.originalname);
    },
    folder:'surf_shop/users'
});

//only accept image files for cloudinary
let imageFilter = function (req,file,cb) {
    //accept image files only
    if (!file.originalname.match(/\.jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed!'), false);
    }
    else {
        cb(null,true);
    }
};

//configure multer as upload parameters for cloudinary
let upload = multer({storage:storage, filefilter:imageFilter});

//configure cloudinary upload settings
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = {storage,imageFilter,upload};