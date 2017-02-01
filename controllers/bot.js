const request = require('request');

function test(req, res) {
  return res.json({
    status: 'success',
  });
}

function validateToken(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === process.env.MESSENGER_VALIDATION_TOKEN) {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
}

/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData,
  }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      console.error('Failed calling Send API', response.statusCode, response.statusMessage, body.error);
    }
  });
}

/*
 * Send a text message using the Send API.
 *
 */
function sendTextMessage(recipientId, messageText) {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: messageText,
    },
  };

  callSendAPI(messageData);
}

function receivedMessage(event) {
  const message = event.message;
  const messageText = message.text;
  const senderID = event.sender.id;

  if (messageText) {
    sendTextMessage(senderID, messageText);
  }
}

function parseMessage(req, res) {
  const data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach((pageEntry) => {
      // Iterate over each messaging event
      pageEntry.messaging.forEach((messagingEvent) => {
        if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        }
      });
    });

    // Assume all went well.
    //
    // We must send back a 200, within 20 seconds, to ACK message
    // received successfully the callback. Otherwise, the request will time out.
    res.sendStatus(200);
  }
}

module.exports = {
  test,
  validateToken,
  parseMessage,
};
