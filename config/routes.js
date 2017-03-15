const bot = require('../utils/MessengerBot');
const locationsController = require('../controllers/locations');
const usersConteroller = require('../controllers/users');

function routesConfig(app) {
  app.get('/webhook', bot.verifyToken.bind(bot));
  app.post('/webhook', bot.handleMessage.bind(bot));

  app.get('/locations', locationsController.getLocations);
  app.post('/addLocation', locationsController.addLocation);
  app.post('/userEnteredLocation', locationsController.userEnteredLocation);

  app.post('/getUser', usersConteroller.getUser);

  console.log('Routes configured successfully');
}

module.exports = routesConfig;
