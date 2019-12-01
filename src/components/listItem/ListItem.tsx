import React from "react";
import styles from "./ListItem.module.scss";

type ListItemProps = {
  children: React.ReactNode;
};

const ListItem: React.FC<ListItemProps> = props => {
  const { children } = props;
  return <li className={styles["list-item"]}>{children}</li>;
};

export default ListItem;
