const Locations = require('../models/Location');
const { botSendMessage } = require('../bot');

async function getLocations(req, res) {
  const locations = await Locations.getAll();

  return res.json({
    status: 'success',
    data: {
      locations,
    },
  });
}

async function addLocation(req, res) {
  await Locations.add(req.body.location);

  return res.json({
    status: 'success',
    data: {
      location: req.body.location,
    },
  });
}

async function userEnteredLocation(req, res) {
  const userId = req.body.userId;
  const locationId = req.body.locationId;
  const enteredLocation = await Locations.get(locationId);

  botSendMessage(userId, `Welcome to ${enteredLocation.name}`);
  res.sendStatus(200);
}

module.exports = {
  getLocations,
  addLocation,
  userEnteredLocation,
};

