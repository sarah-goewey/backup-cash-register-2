import React, { useState } from "react";
import { attemptLogin, register } from "../store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const onChange = (ev) => {
    setCredentials({ ...credentials, [ev.target.name]: ev.target.value });
  };

  const createAccount = (ev) => {
    ev.preventDefault();
    dispatch(register(credentials));
    navigate("/");
  };
  return (
    <div>
      <h2>Create Account</h2>
      <form onSubmit={createAccount}>
        <input
          placeholder="username"
          value={credentials.username}
          name="username"
          onChange={onChange}
        />
        <input
          placeholder="password"
          name="password"
          value={credentials.password}
          onChange={onChange}
        />
        <button>Create Account</button>
      </form>
    </div>
  );
};

export default CreateAccount;
