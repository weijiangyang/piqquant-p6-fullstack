//importer le modèle Sauce
const Sauce = require('../models/sauce');

// importer le package 'fs' 
const fs = require("fs");
// importer winston logger
const logger = require("../configue/logger")


// créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
    //créer une instance de Sauce 
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes:0,
      dislikes:0
    });
    // enregistrer le nouveau objet dans la base de données et renvoyer la reponse sur le status de la réponse et des messages de reusis ou échec  
    sauce.save()
      .then(function(){
        res.status(201).json({ message: 'Objet enregistré !'});
        logger.log('info','Objet enregistré !')
      })
      .catch(function(error){
        res.status(400).json({ error });
        logger.log('info',error)
        })
};

      
    
// lire tous les sauces
exports.getAllSauces = (req,res,next) => {
  
    Sauce.find()
    
    .then(function(sauces){
      res.status(200).json(sauces);
    })
    .catch(function(error){
      res.status(404).json({error});
      logger.log('info',error)
    })
};  

// lire une sauce spécifique
exports.getOneSauce = (req,res,next) => {
    Sauce.findOne({_id:req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(function(error){
      res.status(400).json({error});
      logger.log('info',error)
    });
};    

// modifier une sauce
exports.modifySauce = (req, res, next) => {
    
        //2 conditions pour la modification : il faut changer l'image ou non. 
        const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body};
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        
        .then(function(){
          res.status(200).json({ message: 'Objet modifié !'});
          logger.log('info','Objet modifié !')
        })
      
        .catch(function(error){
          res.status(400).json({ error });
          logger.log('info',error)
        });
}        
// supprimer une sauce   
exports.deleteSauce = (req,res,next) =>{
    Sauce.findOne({_id:req.params.id})
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      // supprimer son fichier de l'image dans le serveur pendant la suppression de la sauce 
      fs.unlink(`images/${filename}`,() => {
        Sauce.deleteOne({_id:req.params.id })
        
        .then(function(){
          res.status(200).json({message:'Objet supprime!'});
          logger.log('info','Objet supprime!')
        })
        .catch(function(error){
          res.status(400).json({error});
          logger.log('info',error)
        });
      })
    })
    .catch(function(error){
      res.status(500).json({error});
      logger.log('info',error)
    });
};    
  
//Like une sauce
exports.likeSauce = (req, res, next) => {
  switch (req.body.like) {
    // Défault = 0
    //  si l'utilisateur a déjâ like cette sauce
    case 0:
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          if (sauce.usersLiked.find(user => user === req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId },
              _id: req.params.id
            })
              .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); })
              
              .catch(function(error){
                res.status(400).json({ error: error });
                logger.log('info',error)
              });

            //  si l'utilisateur a déjâ dislike cette sauce
          } if (sauce.usersDisliked.find(user => user === req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
              _id: req.params.id
            })
              .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); })
              
              .catch(function(error){
                res.status(400).json({ error: error });
                logger.log('info',error)
              })
          }
        })
        
        .catch(function(error){
          res.status(404).json({ error: error }); 
          logger.log('info',error)
        });
      break;
    //Updates likes. likes = 1 
    case 1:
      Sauce.updateOne({ _id: req.params.id }, {
        $inc: { likes: 1 },
        $push: { usersLiked: req.body.userId },
        _id: req.params.id
      })
        .then(() => { res.status(201).json({ message: 'Ton like a été pris en compte!' }); })
        
        .catch(function(error){
          res.status(400).json({ error: error });
          logger.log('info',error)
        });
      break;

    //Updates dislikes. dislikes = -1
    case -1:
      Sauce.updateOne({ _id: req.params.id }, {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: req.body.userId },
        _id: req.params.id
      })
        .then(() => { res.status(201).json({ message: 'Ton dislike a été pris en compte!' }); })
        
        .catch(function(){
          res.status(400).json({ error: error });
          logger.log('info',error)
        })
      break;
    default:
      console.error('mauvaise requête');
  }
}