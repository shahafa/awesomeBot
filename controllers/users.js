const Users = require('../models/User');

async function getUser(req, res) {
  const userId = req.body.userId;
  const user = await Users.get(userId);

  return res.json({
    status: 'success',
    data: {
      user,
    },
  });
}

module.exports = {
  getUser,
};
