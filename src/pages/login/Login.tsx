import { useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useContext } from "react";
import useForm from "react-hook-form";
import { Link } from "react-router-dom";
import * as yup from "yup";
import AuthContext from "../../context/auth-context";
import styles from "./Login.module.scss";

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
  const [login, { loading, data }] = useLazyQuery(LOGIN, {
    onCompleted: data => {
      authContext.login(
        data.adminLogin.token,
        data.adminLogin.userId,
        data.adminLogin.tokenExpiration
      );
    }
  });
  const authContext = useContext(AuthContext);

  if (loading) {
    return <p>LOADING...</p>;
  }

  if (data && data.adminLogin) {
    localStorage.setItem("auth_token", data.adminLogin.token);
  }

  const onSubmit = handleSubmit(({ email, password }) => {
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
    <div className={styles["page-wrapper"]}>
      <div className={styles.container}>
        <div className={styles.signup}>
          <img
            src={`${process.env.PUBLIC_URL}/assets/logo.png`}
            srcSet={`${process.env.PUBLIC_URL}/assets/logo@2x.png 2x`}
            alt="logo"
          />
          <p>Let's Connect!</p>

          <Link className="button" to="/register">
            <span>Sign up</span>
          </Link>
        </div>
        <div className={styles.login}>
          <h1>Welcome Back!</h1>
          <form className={styles["login-form"]} onSubmit={onSubmit}>
            <div className="form-control">
              <label htmlFor="email">E-mail:</label>
              <input type="text" name="email" ref={register} />
              <span className={styles["form-error-msg"]}>
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
            <button type="submit">
              <span>Login</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
