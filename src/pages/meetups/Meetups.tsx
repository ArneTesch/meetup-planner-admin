import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import Sidenav from "../../components/sidenav/Sidenav";
import styles from "./Meetups.module.scss";

const GET_MEETUPS = gql`
  {
    meetups {
      _id
      title
      description
      date
      location
      speakers {
        _id
        name
        age
        expertise {
          title
          domain
        }
        nationality
        avatar
      }
      visitors {
        _id
        lastName
        firstname
        email
      }
    }
  }
`;

const Meetups: React.FC = () => {
  const { loading, error, data } = useQuery(GET_MEETUPS);

  if (error) {
    return <p>ERROR ${error.message}</p>;
  }
  if (loading) {
    return <p>LOADING</p>;
  }
  console.log({ data });

  return (
    <div className={styles["nav-wrapper"]}>
      <Sidenav>
        <main>
          <h1>MEETUPS</h1>
          <div className="meetup-list"></div>
        </main>
      </Sidenav>
    </div>
  );
};

export default Meetups;
