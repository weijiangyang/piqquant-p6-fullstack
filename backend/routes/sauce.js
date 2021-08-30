//importer le framework ' Express ' 
const express = require('express');
const router = express.Router();
// importer le fichier controllers 
const sauceCtrl = require('../controllers/sauce');
// importer le fichier middleware pour l'authentification 
const auth = require('../middleware/auth');
// importer le fichier middleware pour le multer 
const multer = require('../middleware/multer-config');
const session = require("../middleware/session");

// les routes pour chaque fonctionnement
router.post('/',auth,multer, sauceCtrl.createSauce );

router.get('/',auth, sauceCtrl.getAllSauces);

router.get('/:id',auth,sauceCtrl.getOneSauce);

router.put('/:id',auth,multer,sauceCtrl.modifySauce);

router.delete('/:id',auth,sauceCtrl.deleteSauce);

router.post('/:id/like',auth,sauceCtrl.likeSauce);

// exporter le modèle router pour les sauces
module.exports = router;

