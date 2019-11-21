import React from "react";
import { Link } from "react-router-dom";
import styles from "./Sidenav.module.scss";

type SideNavProps = {
  children: React.ReactNode;
};

export const Sidenav: React.FC<SideNavProps> = props => {
  const { children } = props;
  return (
    <main>
      <nav className={styles.navbar}>
        <div className={styles["navbar-logo"]}>
          <img
            src={`${window.location.origin}/assets/logo.png`}
            srcSet={`${window.location.origin}/assets/logo@2x.png 2x`}
            alt="logo"
          />
          <p>Meetup Planner Admin</p>
        </div>
        <div className={styles["navbar-items"]}>
          <Link to="/meetups">Meetups</Link>
        </div>
      </nav>
      <div className={styles.container}>{children}</div>
    </main>
  );
};

export default Sidenav;
