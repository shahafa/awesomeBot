const bot = require('../utils/MessengerBot');
const Users = require('../models/User');

bot.setGetStartedButton();

bot.on('postback', async (payload) => {
  if (payload.postback.payload === 'GET_STARTED_PAYLOAD') {
    const senderId = payload.sender.id;

    const user = await Users.get(senderId);
    if (user) {
      const text = `Hi ${user.firstName}`;
      bot.sendMessage(senderId, { text });
    } else {
      const profile = await bot.getProfile(senderId); // TODO change to cache
      const text = `Hi ${profile.first_name}, I'm Awesome Bot, your personal assistant. I'll help you keep track of sales opprtunities and find new leads.`;
      const messagePayload = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text,
            buttons: [{
              type: 'postback',
              title: 'Subscribe',
              payload: 'SUBSCRIBE',
            }],
          },
        },
      };

      bot.sendMessage(senderId, messagePayload);
    }
  } else if (payload.postback.payload === 'SUBSCRIBE') {
    const senderId = payload.sender.id;
    const profile = await bot.getProfile(senderId); // TODO change to cache

    Users.add({
      id: senderId,
      firstName: profile.first_name,
      lastName: profile.last_name,
    });

    const text = `Subscribed successfully, token: ${senderId}`;
    bot.sendMessage(senderId, { text });
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
