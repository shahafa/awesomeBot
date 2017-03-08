/* eslint func-names: "off" */
/* eslint space-before-function-paren: "off" */

const mongoose = require('mongoose');

// Temporary fix to suppress false DeprecationWarning
// https://github.com/Automattic/mongoose/issues/4951
mongoose.Promise = global.Promise;

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

LocationSchema.statics.get = async function(locationId) {
  const location = await this.findOne({ id: locationId }).exec();
  if (!location) {
    return false;
  }

  return location;
};

LocationSchema.statics.getAll = async function() {
  const locations = await this.find().exec();
  if (!locations) {
    return false;
  }

  return locations;
};

module.exports = mongoose.model('Location', LocationSchema);
