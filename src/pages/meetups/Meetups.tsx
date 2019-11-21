import React from "react";
import Sidenav from "../../components/sidenav/Sidenav";
import styles from "./Meetups.module.scss";

const Meetups: React.FC = () => {
  return (
    <div className={styles["nav-wrapper"]}>
      <Sidenav>
        <h1>MEETUPS</h1>
      </Sidenav>
    </div>
  );
};

export default Meetups;
