const botController = require('../controllers/bot');

function routesConfig(app) {
  app.use('/test', (req, res) =>
    res.json({
      status: 'success',
    }));

  app.get('/webhook', botController.validateToken);
  app.post('/webhook', botController.userMessageReceived);
  app.post('/locationEntered', botController.userEnteredLocation);

  console.log('Routes configured successfully');
}

module.exports = routesConfig;
