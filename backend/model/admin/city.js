const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CitySchema = new Schema({
  name: { type: String, required: true }, // City name
  stateName: { type: String, required: true }, // State name
  countryCode: { type: String, required: true },
  slug: { type: String, unique: true }, // Slug field
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save hook to generate the slug from the name field
CitySchema.pre("save", function (next) {
  this.slug = this.name.toLowerCase().replace(/ /g, "-"); // Generate slug
  this.updatedAt = Date.now();
  next();
});

const City = mongoose.model("City", CitySchema);
module.exports = City;

  