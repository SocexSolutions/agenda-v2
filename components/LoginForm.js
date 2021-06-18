import { useState } from "react";
//Import Daves button component

const LoginForm = () => {
  return (
    <form>
      <div>
        <label>Email:</label>
        <input type="text" placeholder="Email"></input>
      </div>
      <div>
        <label>Password:</label>
        <input type="text" placeholder="Password"></input>
      </div>
    </form>

    //Dave's Submit button
  );
};

export default LoginForm;
