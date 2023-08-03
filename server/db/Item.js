const conn = require("./conn");
const { STRING, UUID, UUIDV4, ENUM, INTEGER, DECIMAL } = conn.Sequelize;

const Item = conn.define("item", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  taxState: {
    type: ENUM("NY", "NJ", "CT", "PA", "none"),
    defaultValue: "NY",
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

module.exports = Item;
