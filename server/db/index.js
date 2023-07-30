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
    userId: moe.id,
    tendered: 70.0,
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

  //calculate total of moesTransaction
  const items = await moesTransaction.getItems();
  let totalCents = 0;
  for (const item of items) {
    if (item.discount) {
      const discountFraction = item.discount / 100;
      const discountedPriceCents = Math.round(
        item.price * (1 - discountFraction) * 100
      );
      totalCents += discountedPriceCents * item.quantity;
      if (item.taxState === "NY") {
        const taxAmountCents = Math.round(
          discountedPriceCents * 0.08875 * item.quantity
        );
        totalCents += taxAmountCents;
      }
    } else {
      const priceCents = Math.round(item.price * 100);
      totalCents += priceCents * item.quantity;
      if (item.taxState === "NY") {
        const taxAmountCents = Math.round(priceCents * 0.08875 * item.quantity);
        totalCents += taxAmountCents;
      }
    }
  }
  const totalDollars = (totalCents / 100).toFixed(2);
  moesTransaction.total = totalDollars;
  await moesTransaction.save();

  //calculate change of moesTransaction
  const tenderedCents = moesTransaction.tendered * 100;
  const totalInCents = moesTransaction.total * 100;
  const changeCents = tenderedCents - totalInCents;
  moesTransaction.change = (changeCents / 100).toFixed(2);
  await moesTransaction.save();

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
