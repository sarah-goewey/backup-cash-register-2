import React, { useEffect, useRef } from "react";
import CashRegister from "./CashRegister";
import Login from "./Login";
import Landing from "./Landing";
import CreateAccount from "./CreateAccount";
import MyTransactions from "./MyTransactions";
import { useSelector, useDispatch } from "react-redux";
import {
  loginWithToken,
  fetchTransactions,
  fetchItems,
  logout,
} from "../store";
import { Link, Routes, Route, useNavigate } from "react-router-dom";

const App = () => {
  const { auth } = useSelector((state) => state);
  const prevAuth = useRef(auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loginWithToken());
  }, []);

  useEffect(() => {
    if (!prevAuth.current.id && auth.id) {
      console.log("logged in");
      dispatch(fetchTransactions());
      dispatch(fetchItems());
    }
    if (prevAuth.current.id && !auth.id) {
      console.log("logged out");
    }
  }, [auth]);

  useEffect(() => {
    prevAuth.current = auth;
  });

  const startLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div>
      <h1>Backup Cash Register</h1>
      <h2>For when your point-of-sale is being a POS.</h2>
      {!!auth.id && (
        <div>
          <div>
            <h3>
              Welcome {auth.username}!!
              <button onClick={startLogout}>Logout</button>
            </h3>
          </div>
          <nav>
            <Link to="/">Cash Register</Link>
            <Link to="/transactions">My Transactions</Link>
          </nav>
        </div>
      )}
      <Routes>
        <Route path="/" element={auth.id ? <CashRegister /> : <Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/transactions" element={<MyTransactions />} />
      </Routes>
    </div>
  );
};

export default App;
