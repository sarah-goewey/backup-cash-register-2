import React from "react";
import { useSelector, useDispatch } from "react-redux";

const MyTransactions = () => {
  const { auth, transactions } = useSelector((state) => state);
  const dispatch = useDispatch();
  return (
    <div>
      <h1>My Transactions</h1>
      <ul>
        {transactions.map((trans) => {
          return (
            <li key={trans.id}>
              <p>Transaction # {trans.id}</p>
              <p>Date: {trans.updatedAt}</p>
              <p>Total: {trans.total}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MyTransactions;
