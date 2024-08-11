const mongoose = require('mongoose');

const PageHeadingSchema = new mongoose.Schema({
  pageType: {
    type: String,
    required: true,
    enum: ['product', 'service', 'news', 'testimonial', 'banner', 'faq', 'ourStaff','gallery','partner','achievement','inquiry','career','missionvision','corevalue','aboutcompany','qualityControl','infrastructure']
  },
  heading: {
    type: String,
    required: true
  },
  subheading: {
    type: String
  }
});

module.exports = mongoose.model('PageHeadings', PageHeadingSchema);