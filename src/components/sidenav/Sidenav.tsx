import React from "react";
import styles from "./Sidenav.module.scss";

type SideNavProps = {
  children: React.ReactNode;
};

export const Sidenav: React.FC<SideNavProps> = props => {
  const { children } = props;
  return (
    <main>
      <nav className={styles.navbar}></nav>
      <div className={styles.container}>{children}</div>
    </main>
  );
};

export default Sidenav;
