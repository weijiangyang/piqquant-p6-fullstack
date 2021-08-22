const multer = require('multer');
const MIME_TYPES = {
    'image/jpeg':'jpg',
    'image/jpg':'jpg',
    'image/png':'png'
}
const storage = multer.diskStorage({
    destination:(req,file,callback) => {
        callback(null,'images')
    },
    filename:(req,file,callback) => {
        const name = file.originalname.split(' ').join('_');
        const extention = MIME_TYPES[file.mimetype];
        callback(null,name + Date.now() +'.' + extention);

    }
});

module.exports = multer({storage}).single('image')