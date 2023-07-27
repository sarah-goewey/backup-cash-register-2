import React from "react";
import { useSelector, useDispatch } from "react-redux";

const MyTransactions = () => {
  const { auth, transactions, items } = useSelector((state) => state);
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
              <ul>
                {items
                  .filter((item) => item.transactionId === trans.id)
                  .map((item) => {
                    return (
                      <li key={item.id}>
                        {item.name}, {item.price}. (tax:{" "}
                        {item.taxState === "NY" ? "New York" : "none"}.{" "}
                        discount: {item.discount || "none"}{" "}
                        {item.discount ? "%" : ""})
                      </li>
                    );
                  })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MyTransactions;
