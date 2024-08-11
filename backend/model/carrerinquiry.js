const mongoose = require('mongoose');

const careerInquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  resume: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
 
}, { timestamps: true });

const CareerInquiry = mongoose.model('CareerInquiry', careerInquirySchema);

module.exports = CareerInquiry;
