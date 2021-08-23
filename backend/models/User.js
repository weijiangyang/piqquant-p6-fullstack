//importer le package 'mongoose'
const mongoose = require('mongoose');
//importer le plugin de mongoose 'mongoose-unique-validator'
const uniqueValidator = require('mongoose-unique-validator');

// configurer le userSchema
const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true },
  password: {type: String, required: true },
});  
userSchema.plugin(uniqueValidator);
// exporter le modèle userSchema sous le nom 'User'
module.exports = mongoose.model('User', userSchema);
