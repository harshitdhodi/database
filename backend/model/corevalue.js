// mission.model.js
const mongoose = require('mongoose');

const corevalueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photo: [{
        type: String,
       
    }],
    alt:[{type:String,default:""}],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Corevalue = mongoose.model('Corevalue', corevalueSchema);

module.exports = Corevalue;
