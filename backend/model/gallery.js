const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    images:{
        type: String,
    },
    alt: {
        type: String,
        default: '',
    },
   
    categories: [{ type: String, ref: 'galleryCategory' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
