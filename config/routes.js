const botController = require('../controllers/bot');

function routesConfig(app) {
  app.use('/test', botController.test);

  app.get('/webhook', botController.validateToken);
  app.post('/webhook', botController.parseMessage);

  console.log('Routes configured successfully');
}

module.exports = routesConfig;
