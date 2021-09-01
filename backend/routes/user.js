// importer le framework 'express'
const express = require('express');
const router = express.Router();
// importer le fichier controller pour l'user
const userCtrl = require('../controllers/user');
// limiter le numbre des requêtes pour eviter l'attaque force brute
const rateLimit = require("express-rate-limit");
const createAccountLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 hour window
    max: 15, // start blocking after 5 requests
    message:
      "Too many accounts created from this IP, please try again after an hour"
  });
// les routers pour le signup et le login de l'user
router.post('/signup', userCtrl.signup);
router.post('/login',createAccountLimiter, userCtrl.login);

// exporter le modèle de router pour l'user 
module.exports = router;