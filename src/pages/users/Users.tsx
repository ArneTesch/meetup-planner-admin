import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import ListItem from "../../components/listItem/ListItem";
import Loading from "../../components/loading/Loading";
import { Sidenav } from "../../components/sidenav/Sidenav";
import styles from "./Users.module.scss";

const GET_USERS = gql`
  {
    users {
      _id
      email
      password
    }
  }
`;

type User = {
  _id: string;
  email: string;
  password: string;
};

const Users: React.FC = () => {
  const { data, loading, error } = useQuery(GET_USERS);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    console.log("Error fetching users", error);
  }

  return (
    <Sidenav>
      <div className="main-wrapper">
        <div className="flex">
          <h1>Users</h1>
        </div>
        <ul className={styles["users-list"]}>
          {data &&
            data.users.map((user: User) => (
              <ListItem key={user._id}>
                <h1 className={styles["title"]}>{user.email}</h1>
              </ListItem>
            ))}
        </ul>
      </div>
    </Sidenav>
  );
};

export default Users;
