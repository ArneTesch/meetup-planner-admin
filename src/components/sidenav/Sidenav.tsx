import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth-context";
import styles from "./Sidenav.module.scss";

type SideNavProps = {
  children: React.ReactNode;
};

export const Sidenav: React.FC<SideNavProps> = props => {
  const { children } = props;
  const authContext = useContext(AuthContext);

  const logoutHandler = () => {
    console.log("ok");
    authContext.logout();
  };
  return (
    <main>
      <nav className={styles.navbar}>
        <div className={styles["navbar-logo"]}>
          <img
            src={`${process.env.PUBLIC_URL}/assets/logo.png`}
            srcSet={`${process.env.PUBLIC_URL}/assets/logo@2x.png 2x`}
            alt="logo"
          />
          <p>Meetup Planner Admin</p>
        </div>
        <div className={styles["navbar-items"]}>
          <Link to="/meetups">
            <i className="icofont-meetup"></i>Meetups
          </Link>
          <button onClick={logoutHandler} className={`${styles.button} button`}>
            <i className="icofont-logout"></i>
            <span>Logout</span>
          </button>
        </div>
      </nav>
      <div className={styles.container}>{children}</div>
    </main>
  );
};

export default Sidenav;
