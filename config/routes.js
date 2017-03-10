const bot = require('../utils/MessengerBot');
const locationsController = require('../controllers/locations');

function routesConfig(app) {
  app.get('/webhook', bot.verifyToken.bind(bot));
  app.post('/webhook', bot.handleMessage.bind(bot));

  app.get('/locations', locationsController.getLocations);
  app.post('/addLocation', locationsController.addLocation);
  app.post('/userEnteredLocation', locationsController.userEnteredLocation);

  console.log('Routes configured successfully');
}

module.exports = routesConfig;
