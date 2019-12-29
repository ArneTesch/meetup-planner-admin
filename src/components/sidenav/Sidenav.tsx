import React, { useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import AuthContext from "../../context/auth-context";
import styles from "./Sidenav.module.scss";

type SideNavProps = {
  children: React.ReactNode;
};

export const Sidenav: React.FC<SideNavProps> = props => {
  const { children } = props;
  const authContext = useContext(AuthContext);
  let history = useHistory();

  const logoutHandler = () => {
    authContext.logout();
    history.push("/login");
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
          <NavLink to="/meetups" activeClassName={styles.active}>
            <i className="icofont-meetup"></i>Meetups
          </NavLink>
          <NavLink to="/users" activeClassName={styles.active}>
            <i className="icofont-users"></i>Users
          </NavLink>
          <NavLink to="/speakers" activeClassName={styles.active}>
            <i className="icofont-users"></i>Speakers
          </NavLink>
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
