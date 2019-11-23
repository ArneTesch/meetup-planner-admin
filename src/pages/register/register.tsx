import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import useForm from "react-hook-form";
import * as yup from "yup";
import styles from "./register.module.scss";

const REGISTER_USER = gql`
  mutation CreateUser($email: String!, $password: String!) {
    createUser(userInput: { email: $email, password: $password }) {
      _id
      email
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

  const [registerUser, { data }] = useMutation(REGISTER_USER, {
    variables: {
      email: "",
      password: ""
    }
  });

  /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
  const onSubmit = (data: FormData) => {
    console.log(data);
    console.log("ok");
  };

  return (
    <div className={styles["page-wrapper"]}>
      <div className={styles.container}>
        <h1>Create your account</h1>
        <form
          className={styles["register-form"]}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={`form-control ${styles["register-form__item"]}`}>
            <label htmlFor="email">E-mail:</label>
            <input type="text" name="email" ref={register} />
            <span className="form-error-msg">
              {errors.password && errors.password.message}
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
