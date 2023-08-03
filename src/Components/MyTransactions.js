import React from "react";
import { useSelector, useDispatch } from "react-redux";

const MyTransactions = () => {
  const { transactions, items } = useSelector((state) => state);

  return (
    <div>
      <h1>My Transactions</h1>
      <ul>
        {transactions.map((trans) => {
          return (
            <li key={trans.id} className="transaction">
              <p>Transaction # {trans.id}</p>
              <p>Date: {trans.updatedAt.slice(0, 10)}</p>
              <p>Total: {trans.total}</p>
              <p>Tendered: {trans.tendered}</p>
              <p>Change: {trans.change}</p>
              <hr />
              <ul>
                {items
                  .filter((item) => item.transactionId === trans.id)
                  .map((item, idx) => {
                    return (
                      <li key={item.id} className="itemInTrans">
                        <p>
                          <b>item #{idx + 1}</b>
                        </p>
                        <p>name: {item.name}</p>
                        <p>quantity: {item.quantity}</p>
                        <p>price: {item.price}</p>
                        <p>
                          discount: {item.discount || "none"}
                          {item.discount ? "%" : ""}
                        </p>
                        <p>
                          tax: {item.taxState === "NY" ? "New York" : "none"}
                        </p>
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
