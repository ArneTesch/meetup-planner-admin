import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useContext } from "react";
import useForm from "react-hook-form";
import * as yup from "yup";
import Loading from "../../components/loading/Loading";
import AuthContext from "../../context/auth-context";
import styles from "./register.module.scss";

type RegisterResultData = {
  token: string;
  userId: string;
  tokenExpiration: number;
};

const REGISTER_USER = gql`
  mutation CreateUser($email: String!, $password: String!) {
    createUser(userInput: { email: $email, password: $password }) {
      userId
      token
      tokenExpiration
    }
  }
`;

type FormData = {
  email: string;
  password: string;
  passwordRepeat: string;
};

const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please provide a valid e-mailadress.")
    .required("E-mail is a required field."),
  password: yup
    .string()
    .required("Password is a required field.")
    .min(8, "Password must be at least 8 characters"),
  passwordRepeat: yup
    .string()
    .required("Password is a required field.")
    .oneOf([yup.ref("password"), null], "Passwords must match!")
});

export const Register: React.FC = () => {
  const { register, errors, handleSubmit } = useForm<FormData>({
    validationSchema: registerSchema
  });
  const authContext = useContext(AuthContext);

  const [createUser, { loading, error }] = useMutation(REGISTER_USER, {
    onCompleted: ({ createUser }) => {
      authContext.login(
        createUser.token,
        createUser.userId,
        createUser.tokenExpiration
      );
      localStorage.setItem("auth_token", createUser.token);
    }
  });
  /* "handleSubmit" will validate your inputs before invoking "registerHandler" */
  const registerHandler = (formData: FormData) => {
    createUser({
      variables: {
        email: formData.email,
        password: formData.password
      }
    });
  };

  if (loading) {
    return <Loading />;
  }
  if (error) return <p>An error occurred</p>;

  return (
    <div className={styles["page-wrapper"]}>
      <div className={styles.container}>
        <h1>Create your account</h1>
        <form
          className={styles["register-form"]}
          onSubmit={handleSubmit(registerHandler)}
        >
          <div className={`form-control ${styles["register-form__item"]}`}>
            <label htmlFor="email">E-mail:</label>
            <input type="text" name="email" ref={register} />
            <span className="form-error-msg">
              {errors.email && errors.email.message}
            </span>
          </div>

          <div className={`form-control ${styles["register-form__item"]}`}>
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" ref={register} />
            <span className="form-error-msg">
              {errors.password && errors.password.message}
            </span>
          </div>
          <div className={`form-control ${styles["register-form__item"]}`}>
            <label htmlFor="passwordRepeat">Repeat Password:</label>
            <input type="password" name="passwordRepeat" ref={register} />
            <span className="form-error-msg">
              {errors.passwordRepeat && errors.passwordRepeat.message}
            </span>
          </div>
          <button>
            <span>Create account</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
