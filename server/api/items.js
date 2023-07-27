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

app.post("/", async (req, res, next) => {
  try {
    console.log("req.body for post item", req.body);
    const newItem = await Item.create(req.body);
    res.status(201).send(newItem);
  } catch (ex) {
    next(ex);
  }
});
