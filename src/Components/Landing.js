import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { attemptLogin } from "../store";

const Landing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="landing">
      <button onClick={() => navigate("/login")}>Login</button>
      <button onClick={() => navigate("/createaccount")}>Create Account</button>
      <button
        onClick={() =>
          dispatch(attemptLogin({ username: "moe", password: "123" }))
        }
      >
        Demo
      </button>
    </div>
  );
};

export default Landing;
