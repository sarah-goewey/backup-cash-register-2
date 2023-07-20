import axios from "axios";

const transactions = (state = [], action) => {
  if (action.type === "SET_TRANSACTIONS") {
    return action.transactions;
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

export default transactions;
