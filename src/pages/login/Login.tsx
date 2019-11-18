import React from "react";
import "./Login.scss";

const Login: React.FC = () => {
  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="signup">
          <img
            src={`${window.location.origin}/assets/logo.png`}
            srcSet={`${window.location.origin}/assets/logo@2x.png`}
            alt="logo"
          />
          <h2>Welcome!</h2>
          <p>Let's Create your Account</p>
          <button>
            <span>Sign up</span>
          </button>
        </div>
        <div className="login">
          <h1>Welcome Back!</h1>
          <form className="login-form">
            <div className="form-control">
              <label htmlFor="e-mail">E-mail:</label>
              <input type="text" />
            </div>
            <div className="form-control">
              <label htmlFor="e-mail">Password:</label>
              <input type="password" />
            </div>
            <button>
              <span>Login</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
