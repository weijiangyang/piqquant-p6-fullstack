// importer le package 'jsonwebtoken'
const jwt = require('jsonwebtoken');
// importer le modèle 'User'
const User = require('../models/User');
// importer le package 'bycrypt'
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
dotenv.config();
const CryptoJS = require("crypto-js");
const session = require('express-session');


// sign up d'un nouveau user
exports.signup = (req, res, next) => {
  // validation du mot de passe
  const passwordValidator = require('password-validator');
  const schema = new passwordValidator();
  schema
  .is().min(8)                                    // Minimum length 8
  .is().max(100)                                  // Maximum length 100
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits(2)                                // Must have at least 2 digits
  .has().not().spaces()                           // Should not have spaces
  .is().not().oneOf(['Passw0rd', 'Password123']);
    
  if (!schema.validate(req.body.password)){
    res.status(400).json({message:"choisir un mot de passe plus fort qui contient 8-100 caractères, des lettres majuscules et minuscules, au moins 2 chiffres et pas d'espace entre eux"})
  }else{//crypter l'email stocké dans le BDD
    const cipherEmail= CryptoJS.HmacSHA1(req.body.email, process.env.SECRET_KEY).toString();
   // hasher le mot de passe
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        //créer une instance de User avec le email entré et le password hashé
        const user = new User({
          email: cipherEmail,
          password: hash
        });
        // engirstrer le nouveau user dans la base de donnée
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
      };
    };
// login d'un user existant
  exports.login = (req, res, next) => {
    // req.session.userInfo = "zhansan111";
    // res.send("login success")
//récupérer l'email crypté[]
    const cipherEmail= CryptoJS.HmacSHA1(req.body.email, process.env.SECRET_KEY).toString();
    
    User.findOne({ email: cipherEmail})
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        //comparer le mot de passe hashé stocké dans la base de donnée et celui dans la requête
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            req.session.userInfo = "zhansan111";
            res.status(200).json({
              userId: user._id,
              // créer un token pour une session de login
              token: jwt.sign(
                { userId: user._id },
                process.env.RANDOM_TOKEN_SECRET,
                { expiresIn: '24h' }
              ),
              message:"login sucess!"
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  