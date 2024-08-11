const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Industry schema
const industrySchema = new Schema({
  industry_address: {
    type: String,
    required: true
  },
  office_address: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true  
  },
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: true
  },
  products: [{
    type: String,
    required: true 
  }],
  photo: [{
    type: String,
    required: true
  }]
});
const Industry = mongoose.model('industrySchema', industrySchema);

module.exports = Industry;