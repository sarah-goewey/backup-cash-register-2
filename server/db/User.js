const conn = require("./conn");
const { STRING, UUID, UUIDV4, TEXT, BOOLEAN } = conn.Sequelize;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT;
const { Op } = require("sequelize");

const User = conn.define("user", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  username: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    unique: true,
  },
  password: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

User.addHook("beforeSave", async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 5);
  }
});

User.addHook("beforeFind", async (options) => {
  if (
    options &&
    options.where &&
    options.where.id &&
    !options.excludeFromHook
  ) {
    const user = await User.findByPk(options.where.id);
    if (user) {
      const transactions = await Transaction.findAll({
        where: {
          userId: user.id,
        },
      });

      const transactionIds = transactions.map((transaction) => transaction.id);

      options.where = {
        ...options.where,
        transactionId: {
          [Op.in]: transactionIds,
        },
      };
    }
  }
});

User.findByToken = async function (token) {
  try {
    const { id } = jwt.verify(token, process.env.JWT);
    const user = await this.findByPk(id, { excludeFromHook: true });
    if (user) {
      return user;
    }
    throw "user not found";
  } catch (ex) {
    const error = new Error("bad credentials");
    error.status = 401;
    throw error;
  }
};

User.prototype.generateToken = function () {
  return jwt.sign({ id: this.id }, JWT);
};

User.authenticate = async function ({ username, password }) {
  const user = await this.findOne({
    where: {
      username,
    },
  });
  if (user && (await bcrypt.compare(password, user.password))) {
    return jwt.sign({ id: user.id }, JWT);
  }
  const error = new Error("bad credentials");
  error.status = 401;
  throw error;
};

User.prototype.usersTransactions = function () {
  return conn.models.transaction.findAll({
    order: [["createdAt"]],
    where: {
      userId: this.id,
    },
  });
};

User.prototype.usersItems = async function () {
  try {
    const transactions = await this.getTransactions({
      order: [["createdAt"]],
      excludeFromHook: true,
    });

    const transactionIds = transactions.map((transaction) => transaction.id);

    const items = await conn.models.item.findAll({
      where: {
        transactionId: {
          [Op.in]: transactionIds,
        },
      },
    });

    return items;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = User;
