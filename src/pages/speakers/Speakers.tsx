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
          {speakers.map((speaker: Speaker) => (
            <ListItem key={speaker._id}>
              <div className={styles["speaker-info"]}>
                <div className={styles["speaker-info__left"]}>
                  <p className={styles["speaker-info__left__name"]}>
                    {speaker.name} ({speaker.age}
                    <span className="subscript">yr</span>)
                  </p>
                  {speaker.expertise && (
                    <p className={styles["speaker-info__left__expertise"]}>
                      {speaker.expertise.domain} - {speaker.expertise.title}
                    </p>
                  )}
                  <hr />
                  <span className={styles.label}>Nationality</span>
                  <p className={styles["speaker-info__left__nationality"]}>
                    {speaker.nationality}
                  </p>
                </div>
                <div className={styles["speaker-info__right"]}>
                  <div className={styles["speaker-info__right__avatar"]}>
                    {speaker.avatar ? (
                      <img src={speaker.avatar} />
                    ) : (
                      <i className="icofont-user-alt-3"></i>
                    )}
                  </div>
                </div>
              </div>
            </ListItem>
          ))}
        </ul>
      </div>
    </Sidenav>
  );
};

export default Speakers;
