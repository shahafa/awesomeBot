const bot = require('../utils/MessengerBot');

bot.setGetStartedButton();

bot.on('authentication', (payload) => {
  const senderId = payload.sender.id;
  bot.sendMessage(senderId, { text: 'hello' });
});

bot.on('message', (payload) => {
  bot.getProfile(payload.sender.id)
     .then((profile) => {
       const text = `Echoed back to ${profile.first_name} ${profile.last_name}: ${payload.message.text}`;
       bot.sendMessage(payload.sender.id, { text });
     });
});
