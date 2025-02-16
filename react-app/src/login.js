import React from "react";
import supabase from "./supabase";
import "./login.css";

const Log_in_form = ({
  email,
  setEmail,
  password,
  setPassword,
  page,
  setPage,
}) => {
  const attemptSignIn = async () => {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (!error) {
      setPage("Menu");
    } else {
      console.log(email);
      console.log(password);
    }
    setEmail("");
    setPassword("");
  };

  return (
    <div className="loginPageWrapper">
      <div className="loginBox">
        <h2>Welcome to AI Speech Coach!</h2>
        <p>
          Sign in to access your personalized speech training and real-time AI
          feedback.
        </p>
        <div className="loginForms">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="loginForms">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="loginButton" onClick={attemptSignIn}>
          Log In
        </button>
        <p>
          New here?{" "}
          <a
            className="createAccountLink"
            onClick={() => setPage("Create_Account")}
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
};

export default Log_in_form;
