import { useQuery } from "@apollo/react-hooks";
import React, { useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import useForm from "react-hook-form";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import ListItem from "../../components/listItem/ListItem";
import Loading from "../../components/loading/Loading";
import Modal from "../../components/modal/modal";
import Sidenav from "../../components/sidenav/Sidenav";
import Speaker from "../../interfaces/Speaker";
import { GET_SPEAKERS } from "../meetups/queries";
import styles from "./Speakers.module.scss";

const Speakers: React.FC = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const { register, handleSubmit } = useForm();
  const { loading: speakerLoading } = useQuery(GET_SPEAKERS, {
    onCompleted: data => {
      setSpeakers(data.speakers);
    }
  });

  const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`;
  const upload_preset = process.env.REACT_APP_CLOUDINARY_PRESET;

  const setDateHandler = (date: Date) => {
    // if (editMeetup && editMeetup.date) {
    //   setDate(new Date(editMeetup.date));
    // }
    // setDate(date);

    console.log({ date });
  };

  const addSpeakerHandler = (formData: any) => {
    console.log({ formData });
  };

  if (speakerLoading) return <Loading />;

  return (
    <React.Fragment>
      {isCreating && (
        <Modal
          title="Create speaker"
          onCancel={() => setIsCreating(false)}
          onClickOutsideModal={() => setIsCreating(false)}
        >
          <form onSubmit={handleSubmit(addSpeakerHandler)}>
            <div className="form-control">
              <label htmlFor="name">Name:</label>
              <input type="text" name="name" ref={register} />
            </div>
            <div className="form-control">
              <label htmlFor="age">Age:</label>
              <DayPickerInput
                onDayChange={(day: Date) => setDateHandler(day)}
                // value={editMeetup && convertDate(editMeetup.date)}ImageUploader
              />
            </div>
            <div className="form-control">
              <label htmlFor="nationality">Nationality:</label>
              <input type="text" name="nationality" ref={register} />
            </div>
            <div className="form-control">
              <label htmlFor="avatar">Avatar:</label>
              {/* <input
                type="file"
                name="avatar"
                ref={register}
                accept="image/png, image/jpeg"
              /> */}

              {upload_preset && (
                <ImageUploader uploadUrl={url} uploadPreset={upload_preset} />
              )}
            </div>
            <div className="form-control">
              <label htmlFor="expertise">Expertise:</label>
              <span>Domain:</span>
              <input type="text" name="expertise_domain" ref={register} />
              <span>Title:</span>
              <input type="text" name="expertise_title" ref={register} />
            </div>
            <div className="modal__actions">
              <button
                className="button modal__button--cancel modal__button"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </button>
              <button className="button modal__button--confirm modal__button">
                Confirm
              </button>
            </div>
          </form>
        </Modal>
      )}
      <Sidenav>
        <div className="main-wrapper">
          <div className={`flex ${styles["page-header"]}`}>
            <h1>Speakers</h1>
            <button
              className={styles["cta-button"]}
              onClick={() => {
                setIsCreating(true);
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
                        <img src={speaker.avatar} alt="Speaker avatar" />
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
    </React.Fragment>
  );
};

export default Speakers;
