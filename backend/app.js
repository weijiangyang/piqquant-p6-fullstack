//importer le framwork 'express'
require('dotenv').config();
const express = require('express');
//importer le package 'mongoose' 
const mongoose = require('mongoose');
const app = express();
//importer le package 'body-parser'
const bodyParser = require('body-parser');
//importer le fichier route de sauce
const sauceRoutes = require('./routes/sauce');
//importer le fichier route de user
const userRoutes = require('./routes/user');
//importer le package 'path'
const path = require('path');
//importer le package 'helmet'
const helmet = require('helmet');


//connecter l'api avec la base de données MongoDB

mongoose.connect('mongodb+srv://weijiangyang:${process.env.MONGO_PASS}@cluster0.6pe6i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



//set HTTP headers avec 'helmet' pour la sécurité de site web
app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard({action: 'deny'}));
app.use(helmet.xssFilter({}));
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());
//set le header de reponse pour que le frontend et le bakcend puissent communiquer entre eux
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader("Set-Cookie", "cookiename=value; Path=/;Domain=domainvalue;Max-Age=seconds;HTTPOnly"); 
    next();
  });

//pour transformer le body du request en JSON 
app.use(bodyParser.json());
//pour accéder aux fichiers statics de local
app.use('/images', express.static(path.join(__dirname, 'images')));
// lier avec les fichiers des routes importés 
app.use('/api/sauces',sauceRoutes);
app.use('/api/auth', userRoutes);



    
  

module.exports = app;

console.log(process.env.MONGO_PASS);