const Locations = require('../models/Location');

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
  const locationId = req.body.locationId;
  const enteredLocation = await Locations.get(locationId);

  // sendTextMessage(`Welcome to ${enteredLocation.name}`);
  res.sendStatus(200);
}

module.exports = {
  getLocations,
  addLocation,
  userEnteredLocation,
};

