const conn = require("./conn");
const { STRING, UUID, UUIDV4, TEXT, BOOLEAN, ENUM, INTEGER, DECIMAL, VIRTUAL } =
  conn.Sequelize;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT;

const Transaction = conn.define("transaction", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  total: {
    type: DECIMAL(10, 2),
  },
  tendered: {
    type: DECIMAL(10, 2),
  },
  change: {
    type: DECIMAL(10, 2),
  },
});

//untested
Transaction.prototype.findItems = function () {
  return conn.models.item.findAll({
    order: [["createdAt"]],
    where: {
      transactionId: this.id,
    },
  });
};

module.exports = Transaction;
