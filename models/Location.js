/* eslint func-names: "off" */
/* eslint space-before-function-paren: "off" */

const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  id: { type: String, required: true, index: { unique: true } },
  name: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  radius: { type: Number, required: true },
  userId: { type: String, required: true, index: true },
});

LocationSchema.statics.add = async function(location) {
  const newLocation = new this(location);
  await newLocation.save();

  return newLocation;
};

LocationSchema.statics.getLocations = async function() {
  const filters = await this.find().exec();
  if (!filters) {
    return false;
  }

  return filters;
};

module.exports = mongoose.model('Location', LocationSchema);
