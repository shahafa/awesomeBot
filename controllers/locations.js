const Location = require('../models/Location');
const { sendTextMessage } = require('../utils/messengar');

async function getLocations(req, res) {
  const locations = await Location.getLocations();

  return res.json({
    status: 'success',
    data: {
      locations,
    },
  });
}

async function addLocation(req, res) {
  await Location.add(req.body.location);

  return res.json({
    status: 'success',
    data: {
      location: req.body.location,
    },
  });
}

function userEnteredLocation(req, res) {
  const data = req.body;

  console.log('location entered');

  sendTextMessage();
  res.sendStatus(200);
}

module.exports = {
  getLocations,
  addLocation,
  userEnteredLocation,
};
