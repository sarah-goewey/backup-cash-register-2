import React from "react";
import { useSelector, useDispatch } from "react-redux";

const MyTransactions = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  return (
    <div>
      <h1>My Transactions</h1>
    </div>
  );
};

export default MyTransactions;
