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

//untested
Item.prototype.findTransaction = function () {
  return conn.models.transaction.findOne({
    where: {
      id: this.transactionId,
    },
  });
};

Item.addHook("afterSave", async (item) => {
  const transaction = await item.findTransaction();
  if (transaction) {
    const items = await transaction.findItems();
    let total = 0.0;

    for (const item of items) {
      if (item.discount) {
        const discountFraction = item.discount / 100;
        const discountedPrice = item.price * (1 - discountFraction) * 1;
        total += discountedPrice;
        if (item.taxState === "NY") {
          total += discountedPrice * 0.08875;
        }
      } else {
        total += item.price * 1;
        if (item.taxState === "NY") {
          total += item.price * 0.08875;
        }
      }
    }

    transaction.total = total.toFixed(2);
    await transaction.save();
  }
});

module.exports = Item;
