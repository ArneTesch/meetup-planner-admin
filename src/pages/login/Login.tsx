import { useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import useForm from "react-hook-form";
import * as yup from "yup";
import "./Login.scss";

type FormData = {
  email: string;
  password: string;
};

const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please provide a valid e-mailadress.")
    .required("E-mail is a required field."),
  password: yup.string().required("Password is a required field.")
});

const LOGIN = gql`
  query adminLogin($email: String!, $password: String!) {
    adminLogin(email: $email, password: $password) {
      userId
      token
      tokenExpiration
    }
  }
`;

const Login: React.FC = () => {
  const { register, errors, handleSubmit } = useForm<FormData>({
    validationSchema: LoginSchema
  });
  const [login, { loading, data }] = useLazyQuery(LOGIN);

  if (loading) {
    return <p>LOADING...</p>;
  }

  if (data && data.adminLogin) {
    localStorage.setItem("auth_token", data.adminLogin.token);
  }

  const onSubmit = handleSubmit(({ email, password }) => {
    console.log({ email }, { password });

    if (
      (!email && email.trim().length === 0) ||
      (!password && password.trim().length === 0)
    ) {
      return;
    }

    login({
      variables: {
        email: email,
        password: password
      }
    });
  });

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
          <p>Let's Connect</p>
          <button>
            <span>Sign up</span>
          </button>
        </div>
        <div className="login">
          <h1>Welcome Back!</h1>
          <form className="login-form" onSubmit={onSubmit}>
            <div className="form-control">
              <label htmlFor="email">E-mail:</label>
              <input type="text" name="email" ref={register} />
              <span className="form-error-msg">
                {errors.email && errors.email.message}
              </span>
            </div>
            <div className="form-control">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                name="password"
                ref={register({ required: "This field is required" })}
              />
              <span className="form-error-msg">
                {errors.password && errors.password.message}
              </span>
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
