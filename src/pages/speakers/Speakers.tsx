import { useQuery } from "@apollo/react-hooks";
import React, { useState } from "react";
import ListItem from "../../components/listItem/ListItem";
import Loading from "../../components/loading/Loading";
import Sidenav from "../../components/sidenav/Sidenav";
import Speaker from "../../interfaces/Speaker";
import { GET_SPEAKERS } from "../meetups/queries";
import styles from "./Speakers.module.scss";

const Speakers: React.FC = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const { loading: speakerLoading } = useQuery(GET_SPEAKERS, {
    onCompleted: data => {
      setSpeakers(data.speakers);
    }
  });

  if (speakerLoading) return <Loading />;

  return (
    <Sidenav>
      <div className="main-wrapper">
        <div className={`flex ${styles["page-header"]}`}>
          <h1>Speakers</h1>
          <button
            className={styles["cta-button"]}
            onClick={() => {
              console.log("createSpeaker");
            }}
          >
            <i className="icofont-ui-add"></i>
            <span>Add speaker</span>
          </button>
        </div>
        <ul className={styles["speakers-list"]}>
          {speakers.map(speaker => (
            <ListItem key={speaker._id}>
              <div className="flex">{speaker.name}</div>
            </ListItem>
          ))}
        </ul>
      </div>
    </Sidenav>
  );
};

export default Speakers;
