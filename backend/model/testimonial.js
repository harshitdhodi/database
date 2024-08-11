const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the testimonial
const TestimonialSchema = new Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  testimony: { type: String, required: true },
  alt:[{type:String,default: ''}],
  photo:[{ type: String ,required: true}],
  status: {type: String,default: false, },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }

});

TestimonialSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });
// Create the model
const Testimonial = mongoose.model('Testimonial', TestimonialSchema);

module.exports = Testimonial;
