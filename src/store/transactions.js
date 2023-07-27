import axios from "axios";

const transactions = (state = [], action) => {
  if (action.type === "SET_TRANSACTIONS") {
    return action.transactions;
  }
  if (action.type === "CREATE_TRANSACTION") {
    return [...state, action.transaction];
  }
  return state;
};

export const fetchTransactions = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem("token");
    const response = await axios.get("/api/transactions", {
      headers: {
        authorization: token,
      },
    });
    dispatch({ type: "SET_TRANSACTIONS", transactions: response.data });
  };
};

export const createTransaction = ({ transaction, items }) => {
  return async (dispatch) => {
    const newTransaction = await axios.post("/api/transactions", transaction);
    console.log("newTransaction", newTransaction);
    dispatch({ type: "CREATE_TRANSACTION", transaction: newTransaction.data });
    for (const item of items) {
      const response = await axios.post("/api/items", {
        ...item,
        transactionId: newTransaction.data.id,
      });
      dispatch({ type: "CREATE_ITEM", item: response.data });
    }
    return newTransaction.data;
  };
};

export default transactions;
