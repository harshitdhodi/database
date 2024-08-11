const mongoose = require('mongoose');

const  GallerycategorySchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  photo: { type: String},
  alt:{type:String},
 
});

module.exports = mongoose.model('GalleryCategory', GallerycategorySchema);
