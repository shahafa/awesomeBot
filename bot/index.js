const bot = require('../utils/MessengerBot');
const Users = require('../models/User');

bot.setGetStartedButton();

bot.on('postback', async (payload) => {
  if (payload.postback.payload === 'GET_STARTED_PAYLOAD') {
    const senderId = payload.sender.id;
    const referral = payload.postback.referral;

    const user = await Users.get(senderId);
    if (user) {
      const text = `Hi ${user.firstName}, I'll text you when something interesting will come up ;)`;
      bot.sendMessage(senderId, { text });
    } else if (!referral) {
      const profile = await bot.getProfile(senderId); // TODO change to cache
      const text = `Hi ${profile.first_name}, I'm Awesome Bot, your personal assistant. I'll help you keep track of sales opprtunities and find new leads. To subscribe to the service please open the app.`;
      bot.sendMessage(senderId, { text });
    } else {
      const profile = await bot.getProfile(senderId); // TODO change to cache

      Users.add({
        id: referral.ref,
        firstName: profile.first_name,
        lastName: profile.last_name,
        psid: senderId,
      });

      const text = 'You\'ve subscribed successfully, hold on I\'ll text you when something interesting will come up ;)';
      bot.sendMessage(senderId, { text });
    }
  }
});

bot.on('message', (payload) => {
  bot.getProfile(payload.sender.id)
     .then((profile) => {
       const text = `Echoed back to ${profile.first_name} ${profile.last_name}: ${payload.message.text}`;
       bot.sendMessage(payload.sender.id, { text });
     });
});

function botSendMessage(recipientId, payload) {
  bot.sendMessage(recipientId, payload);
}

module.exports = {
  botSendMessage,
};
