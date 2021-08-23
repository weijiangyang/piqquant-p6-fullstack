// importer le framework 'express'
const express = require('express');
const router = express.Router();
// importer le fichier controller pour l'user
const userCtrl = require('../controllers/user');

// les routers pour le signup et le login de l'user
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// exporter le modèle de router pour l'user 
module.exports = router;