// importer le package 'jsonwebtoken'
const jwt = require('jsonwebtoken');
// importer le modèle 'User'
const User = require('../models/User');
// importer le package 'bycrypt'
const bcrypt = require('bcrypt');


// sign up d'un nouveau user
exports.signup = (req, res, next) => {
   // hasher le mot de passe
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        //créer une instance de User avec le email entré et le password hashé
        const user = new User({
          email: req.body.email,
          password: hash
        });
        // engirstrer le nouveau user dans la base de donnée
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
      };
// login d'un user existant
  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
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
            res.status(200).json({
              userId: user._id,
              // créer un token pour une session de login
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };