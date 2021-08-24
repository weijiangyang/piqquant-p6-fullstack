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
const passwordValidator = require('password-validator');
var schema = new passwordValidator();
schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); 
console.log(schema.validate('123'));