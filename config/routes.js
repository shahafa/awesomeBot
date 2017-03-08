const botController = require('../controllers/bot');
const locationsController = require('../controllers/locations');

function routesConfig(app) {
  app.use('/test', (req, res) =>
    res.json({
      status: 'success',
    }));

  app.get('/webhook', botController.validateToken);
  app.post('/webhook', botController.userMessageReceived);

  app.get('/locations', locationsController.getLocations);
  app.get('/addLocation', locationsController.addLocations);
  app.post('/locationEntered', locationsController.userEnteredLocation);

  console.log('Routes configured successfully');
}

module.exports = routesConfig;
