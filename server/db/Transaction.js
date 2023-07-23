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
  total: {
    type: DECIMAL(10, 2),
  },
  tendered: {
    type: DECIMAL(10, 2),
  },
  change: {
    type: DECIMAL(10, 2),
  },
  complete: {
    type: BOOLEAN,
    defaultValue: false,
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
