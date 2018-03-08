var mongoose = require('mongoose');
var Schema = mongoose.Schema ;

var postSchema = new Schema({
  description : { type : String},
  likes : {type : Number , default : 0},
  image : {type : String },
  displayName : {type: String},
  username:{type:String},
  postedBy: {type: mongoose.Schema.Types.ObjectId,ref: 'User'},
  likedBy: {type : Array}
});


var Post = mongoose.model('Post',postSchema);
module.exports = Post;
