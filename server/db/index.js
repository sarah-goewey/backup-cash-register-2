const conn = require("./conn");
const User = require("./User");
const Transaction = require("./Transaction");
const Item = require("./Item");

Transaction.hasMany(Item);
Item.belongsTo(Transaction);

User.hasMany(Transaction);
Transaction.belongsTo(User);

const syncAndSeed = async () => {
  await conn.sync({ force: true });
  const [moe, lucy, larry, ethyl] = await Promise.all([
    User.create({ username: "moe", password: "123" }),
    User.create({ username: "lucy", password: "123" }),
    User.create({ username: "larry", password: "123" }),
    User.create({ username: "ethyl", password: "123" }),
  ]);

  const moesTransaction = await Transaction.create({
    taxState: "NY",
    userId: moe.id,
  });

  await Promise.all([
    Item.create({
      name: "Moby Dick",
      quantity: 2,
      price: 17.99,
      transactionId: moesTransaction.id,
      taxState: "NY",
    }),
    Item.create({
      name: "Jane Eyre",
      price: 18.99,
      transactionId: moesTransaction.id,
      taxState: "NY",
    }),
    Item.create({
      price: 10.0,
      discount: 25,
      transactionId: moesTransaction.id,
      taxState: "NY",
    }),
  ]);

  return {
    users: {
      moe,
      lucy,
      larry,
      ethyl,
    },
  };
};

module.exports = {
  syncAndSeed,
  User,
  Transaction,
  Item,
};
