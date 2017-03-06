const fetch = require('node-fetch');

function sendTextMessage(recipientId, messageText) {
  const body = JSON.stringify({
    recipient: { id: recipientId },
    message: { text: messageText },
  });

  const queryString = `access_token=${encodeURIComponent(process.env.PAGE_ACCESS_TOKEN)}`;

  return fetch(`https://graph.facebook.com/me/messages?${queryString}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
}

module.exports = {
  sendTextMessage,
};
