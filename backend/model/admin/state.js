const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isoCode: { type: String, required: true },
  countryCode: { type: String, required: true },
  countryName: { type: String, required: true },
  // Removed slug field
});

// Removed pre-save hook

const State = mongoose.model("State", stateSchema);
module.exports = State;
