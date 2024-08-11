const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Country = require("./country");

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isoCode: { type: String, required: true },
  countryCode: { type: String, required: true },
  countryName: { type: String, required: true },
  slug: { type: String, unique: true }  // Add slug field
});

// Pre-save hook to generate the slug from the name field
stateSchema.pre("save", function (next) {
  this.slug = this.name.toLowerCase().replace(/ /g, "-");  // Generate slug
  this.updatedAt = Date.now();
  next();
});

const state = mongoose.model("state", stateSchema);
module.exports = state;
