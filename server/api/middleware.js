const { CashUser } = require("../db");

const isLoggedIn = async (req, res, next) => {
  try {
    const user = await CashUser.findByToken(req.headers.authorization);
    req.user = user;
    next();
  } catch (ex) {
    next(ex);
  }
};

module.exports = {
  isLoggedIn,
};
