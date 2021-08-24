//importer le package 'mongoose'
const mongoose = require('mongoose');

//configurer le Schema pour la sauce
const sauceSchema = mongoose.Schema({
    name:{type:String,required:true},
    manufacturer:{type:String,required:true},
    description:{type:String,required:true},
    mainPepper:{type:String,required:true},
    imageUrl:{type:String,required:true},
    heat:{type:Number,required:true},
    userId: { type: String,required:true  },
    id:{type:Object},
    likes:{type:Number},
    dislikes:{type:Number},
    usersLiked:{type:Array},
    usersDisliked:{type:Array}
})    

// exporter le modèle de sauceSchema sous le nom 'Sauce'
module.exports = mongoose.model('Sauce',sauceSchema);