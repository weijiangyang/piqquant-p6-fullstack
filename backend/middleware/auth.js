//importer le package 'jsonwebtoken'
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const logger = require('../configue/logger');
dotenv.config();
// authentifier le token de la requête
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
    //   throw 'Invalid user ID';
        res.status(403).json({message:"request non authorisé"});
        logger.log('info','request non authorisé')
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
    logger.log('info','Invalid request!')
  }
};