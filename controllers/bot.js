const { sendTextMessage } = require('../utils/messengar');

function validateToken(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === process.env.MESSENGER_VALIDATION_TOKEN) {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
}

function userMessageReceived(req, res) {
  const data = req.body;

  if (data.object === 'page') {
    data.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && !event.message.is_echo) {
          // Retrieve the Facebook user ID of the sender
          const senderId = event.sender.id;

          // Retrieve the message content
          const { text } = event.message;

          // Process user message in wit
          sendTextMessage(senderId, text);
        }
      });
    });
  }

  // Send back a 200, within 20 seconds, to ACK message received successfully
  // the callback. Otherwise, the request will time out.
  res.sendStatus(200);
}

module.exports = {
  validateToken,
  userMessageReceived,
};
