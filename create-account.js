import React from "react";
import supabase from "./supabase";
import "./createAccount.css";

const Create_Account_Form = ({
  firstName,
  setFirstName,
  email,
  setEmail,
  password,
  setPassword,
  page,
  setPage,
}) => {
  const attemptSignUp = async () => {
    console.log("Email:", email);
    console.log("Password:", password);

    let { data, error } = await supabase.auth.signUp({
      email: email, // Ensure this is a string
      password: password, // Ensure this is a string
    });

    if (!error) {
      console.log("Successful sign up");
      const { data, error } = await supabase
        .from("names")
        .insert([{ id: { email }, name: { firstName } }])
        .select();
      setPage("Login");
    }

    setFirstName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="createAccountPageWrapper">
      <div className="createAccountBox">
        <h2 className="createAccountHeader">Create Your Account</h2>
        <p className="createAccountText">
          Join AI Speech Coach and start improving your speech today!
        </p>

        <div className="createAccountForms">
          <label htmlFor="firstName" className="createAccountLabel">
            First Name:
          </label>
          <input
            type="text"
            id="firstName"
            className="createAccountInput"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="createAccountForms">
          <label htmlFor="username" className="createAccountLabel">
            Email:
          </label>
          <input
            type="text"
            id="username"
            className="createAccountInput"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="createAccountForms">
          <label htmlFor="password" className="createAccountLabel">
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="createAccountInput"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="createAccountButton" onClick={attemptSignUp}>
          Create Account
        </button>

        <p className="createAccountText">
          Already have an account?{" "}
          <a
            href="#"
            className="createAccountLink"
            onClick={() => setPage("Login")}
          >
            Log in here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Create_Account_Form;
