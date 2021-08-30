//importer le modèle Sauce
const Sauce = require('../models/sauce');

// importer le package 'fs' 
const fs = require("fs");


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
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
    };
// lire tous les sauces
exports.getAllSauces = (req,res,next) => {
  
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({error}));
};

// lire une sauce spécifique
exports.getOneSauce = (req,res,next) => {
    Sauce.findOne({_id:req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({error}));
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
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
        }
// supprimer une sauce   
exports.deleteSauce = (req,res,next) =>{
    Sauce.findOne({_id:req.params.id})
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      // supprimer son fichier de l'image dans le serveur pendant la suppression de la sauce 
      fs.unlink(`images/${filename}`,() => {
        Sauce.deleteOne({_id:req.params.id })
        .then(() => res.status(200).json({message:'Objet supprime!'}))
        .catch(error => res.status(400).json({error}))
      })
    })
    .catch(error => res.status(500).json({error}));
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
              .catch((error) => { res.status(400).json({ error: error }); });

            //  si l'utilisateur a déjâ dislike cette sauce
          } if (sauce.usersDisliked.find(user => user === req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
              _id: req.params.id
            })
              .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); })
              .catch((error) => { res.status(400).json({ error: error }); });
          }
        })
        .catch((error) => { res.status(404).json({ error: error }); });
      break;
    //Updates likes. likes = 1 
    case 1:
      Sauce.updateOne({ _id: req.params.id }, {
        $inc: { likes: 1 },
        $push: { usersLiked: req.body.userId },
        _id: req.params.id
      })
        .then(() => { res.status(201).json({ message: 'Ton like a été pris en compte!' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
      break;

    //Updates dislikes. dislikes = -1
    case -1:
      Sauce.updateOne({ _id: req.params.id }, {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: req.body.userId },
        _id: req.params.id
      })
        .then(() => { res.status(201).json({ message: 'Ton dislike a été pris en compte!' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
      break;
    default:
      console.error('mauvaise requête');
  }
}