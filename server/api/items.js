const express = require("express");
const app = express.Router();
const { Transaction, User, Item } = require("../db");
const { isLoggedIn } = require("./middleware.js");

module.exports = app;

app.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const response = await req.user.usersItems();
    res.send(response);
  } catch (ex) {
    next(ex);
  }
});
