/* eslint-disable class-methods-use-this */

const EventEmitter = require('events');
const fetch = require('node-fetch');

class MessengerBot extends EventEmitter {
  verifyToken(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === process.env.MESSENGER_VERIFY_TOKEN) {
      res.status(200).send(req.query['hub.challenge']);
    } else {
      res.sendStatus(403);
    }
  }

  handleMessage(req, res) {
    const data = req.body;

    // Make sure this is a page subscription
    if (data.object === 'page') {
      const entries = data.entry;

      // Iterate over each entry
      // There may be multiple if batched
      entries.forEach((entry) => {
        const events = entry.messaging;

        // Iterate over each messaging event
        events.forEach((event) => {
          if (event.optin) {
            this.emit('authentication', event);
          } else if (event.message) {
            this.emit('message', event);
          } else if (event.delivery) {
            this.emit('delivery', event);
          } else if (event.postback) {
            this.emit('postback', event);
          } else if (event.read) {
            this.emit('read', event);
          } else if (event.account_linking) {
            this.emit('accountLinked', event);
          } else if (event.referral) {
            this.emit('referral', event);
          }
        });
      });

      // Send back a 200, within 20 seconds, to ACK callback successfully received.
      // Otherwise, the request will time out.
      res.sendStatus(200);
    }
  }

  getProfile(userId) {
    return fetch(`https://graph.facebook.com/v2.6/${userId}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${encodeURIComponent(process.env.PAGE_ACCESS_TOKEN)}`,
      {
        method: 'GET',
      })
    .then(response => response.json())
    .then((response) => {
      if (response.error) {
        return Promise.reject(response.error);
      }

      return Promise.resolve(response);
    })

    .catch(error => Promise.reject(error));
  }

  sendMessage(recipientId, payload) {
    return fetch(
      `https://graph.facebook.com/v2.6/me/messages?access_token=${encodeURIComponent(process.env.PAGE_ACCESS_TOKEN)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: payload,
        }),
      })
    .catch(error => Promise.reject(error));
  }

  setGetStartedButton() {
    return fetch(
      `https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${encodeURIComponent(process.env.PAGE_ACCESS_TOKEN)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          get_started: {
            payload: 'GET_STARTED_PAYLOAD',
          },
        }),
      })
    .catch(error => Promise.reject(error));
  }

  removeGetStartedButton() {
    return fetch(
      `https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${encodeURIComponent(process.env.PAGE_ACCESS_TOKEN)}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: [
            'get_started',
          ],
        }),
      })
    .catch(error => Promise.reject(error));
  }

}

module.exports = new MessengerBot();
