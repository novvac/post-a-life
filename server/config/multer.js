const multer = require("multer");
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './api/uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + req.user.short_id + '-' + Date.now() + "." + file.mimetype.replace("image/", ''));
    }
})

module.exports = storage;