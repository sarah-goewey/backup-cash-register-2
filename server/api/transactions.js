const express = require("express");
const app = express.Router();
const { Transaction, User } = require("../db");
const { isLoggedIn } = require("./middleware.js");

module.exports = app;

app.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const response = await req.user.usersTransactions();
    res.send(response);
  } catch (ex) {
    next(ex);
  }
});
