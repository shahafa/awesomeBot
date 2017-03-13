/* eslint func-names: "off" */
/* eslint space-before-function-paren: "off" */

const mongoose = require('mongoose');

// Temporary fix to suppress false DeprecationWarning
// https://github.com/Automattic/mongoose/issues/4951
mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, index: { unique: true } },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  psid: { type: String, required: true, index: { unique: true } },
});

UserSchema.statics.add = async function(user) {
  const userObj = await this.findOne({ id: user.id }).exec();
  if (userObj) {
    return false;
  }

  const newUser = new this(user);
  await newUser.save();

  return newUser;
};

UserSchema.statics.getByPsid = async function(psid) {
  const user = await this.findOne({ psid }).exec();
  if (!user) {
    return false;
  }

  return user;
};

UserSchema.statics.get = async function(userId) {
  const user = await this.findOne({ id: userId }).exec();
  if (!user) {
    return false;
  }

  return user;
};

module.exports = mongoose.model('User', UserSchema);
