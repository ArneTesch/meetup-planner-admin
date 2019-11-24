import React from "react";
import styles from "./Loading.module.scss";

export const Loading = () => (
  <div className={styles.spinner}>
    <div className={styles["lds-ripple"]}>
      <div></div>
      <div></div>
    </div>
  </div>
);

export default Loading;
