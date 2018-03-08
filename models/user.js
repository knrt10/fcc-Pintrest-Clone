var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String,
    profilePic : String
  }
});

module.exports = mongoose.model('User',userSchema);
