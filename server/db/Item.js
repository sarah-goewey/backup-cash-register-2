const conn = require("./conn");
const { STRING, UUID, UUIDV4, TEXT, BOOLEAN, ENUM, INTEGER, DECIMAL } =
  conn.Sequelize;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT;

const Item = conn.define("item", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  taxState: {
    type: ENUM("NY", "none"),
    defaultValue: "none",
  },
  discount: {
    type: INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 99,
    },
  },
  name: {
    type: STRING,
    allowNull: false,
    defaultValue: "unnamed item",
  },
  quantity: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 0,
    },
  },
  price: {
    type: DECIMAL(10, 2),
    allowNull: false,
  },
});

module.exports = Item;
