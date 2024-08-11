// models/career.js
const mongoose = require('mongoose');

const CareerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    requirement: {
        type: String,
        required: true,
    },
    shortDescription: {
        type: String,
        required: true,
    },
    longDescription: {
        type: String,
        required: true,
    },
    photo: [{
        type: String,
    }],
    alt:[ {
        type: String, 
        default:'' 
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Career = mongoose.model('Career', CareerSchema);

module.exports = Career;
