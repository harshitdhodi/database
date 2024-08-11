const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify'); // Ensure to install slugify package

const CountrySchema = new Schema({
    name: { type: String, required: true },
    countryCode: { type: String, required: true },
    photo: [{ type: String}],
    slug: { type: String, unique: true }, // Add slug field
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Generate a slug before saving the document
CountrySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    if (this.name) {
        this.slug = slugify(this.name, { lower: true });
    }
    next();
});

const Country = mongoose.model('Country', CountrySchema);
module.exports = Country;
 