import { useMutation, useQuery } from "@apollo/react-hooks";
import React, { useContext, useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import useForm from "react-hook-form";
import { Redirect } from "react-router-dom";
import Select, { ValueType } from "react-select";
import ListItem from "../../components/listItem/ListItem";
import Loading from "../../components/loading/Loading";
import LocationSearchInput from "../../components/locationSearchInput/LocationSearchInput";
import Modal from "../../components/modal/modal";
import Sidenav from "../../components/sidenav/Sidenav";
import AuthContext from "../../context/auth-context";
import convertDate from "../../helpers/convertDate";
import Meetup from "../../interfaces/Meetup";
import Speaker from "../../interfaces/Speaker";
import styles from "./Meetups.module.scss";
import {
  CREATE_MEETUP,
  DELETE_MEETUP,
  GET_MEETUPS,
  GET_SPEAKERS,
  UPDATE_MEETUP
} from "./queries";

type MeetupFormData = {
  title: string;
  description: string;
  date?: Date | string;
  location: string;
  speakers: string[];
};

type SpeakerOption = {
  value: string;
  label: string;
};

const Meetups: React.FC = () => {
  const auth = useContext(AuthContext);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [speakerOptions, setspeakerOptions] = useState<SpeakerOption[]>([]);
  const [chosenSpeakers, setChosenSpeakers] = useState<SpeakerOption[]>([]);
  const [date, setDate] = useState<Date>();
  const [location, setLocation] = useState<string>("");
  const [editMeetup, setEditMeetup] = useState<Meetup>();
  const { data, loading: meetupLoading, error, refetch } = useQuery(
    GET_MEETUPS
  );
  const { loading: speakerLoading } = useQuery(GET_SPEAKERS, {
    onCompleted: data => {
      data.speakers.forEach((speaker: Speaker) => {
        setspeakerOptions(prevState => [
          ...prevState,
          {
            value: speaker._id,
            label: speaker.name
          }
        ]);
      });
    },
    onError: err => {
      localStorage.clear();
      console.error(err);
    },
    errorPolicy: "all"
  });
  const { register, handleSubmit } = useForm<MeetupFormData>();
  const [createMeetup] = useMutation(CREATE_MEETUP, {
    onCompleted: () => {
      refetch();
      setIsCreating(false);
    }
  });
  const [deleteMeetup, { loading: deleteMeetupLoading }] = useMutation(
    DELETE_MEETUP,
    {
      onCompleted: () => {
        refetch();
      }
    }
  );

  const [updateMeetup, { loading: updateMeetupLoading }] = useMutation(
    UPDATE_MEETUP,
    {
      onCompleted: () => {
        refetch();
        setIsCreating(false);
      }
    }
  );

  if (error) {
    return <p>ERROR ${error.message}</p>;
  }
  if (
    meetupLoading ||
    speakerLoading ||
    deleteMeetupLoading ||
    updateMeetupLoading
  )
    return <Loading />;

  const addMeetupHandler = (formData: MeetupFormData) => {
    formData.date = date;
    formData.location = location;
    const speakerArr = chosenSpeakers.map(speaker => speaker.value);

    if (editMeetup) {
      updateMeetup({
        variables: {
          id: editMeetup._id,
          title: formData.title,
          description: formData.description,
          date: formData.date ? formData.date : editMeetup.date,
          location: formData.location ? formData.location : editMeetup.location,
          speakers: speakerArr
        }
      });
    } else {
      createMeetup({
        variables: {
          title: formData.title,
          description: formData.description,
          date: formData.date,
          location: formData.location,
          speakers: speakerArr
        }
      });
    }
  };

  const deleteMeetupHandler = (meetupId: string) => {
    deleteMeetup({
      variables: {
        id: meetupId
      }
    });
  };

  const editMeetupHandler = (meetup: Meetup) => {
    setEditMeetup(meetup);
    setIsCreating(true);
  };

  const speakerSelectionHandler = (
    speakerOption: ValueType<SpeakerOption>[]
  ) => {
    setChosenSpeakers(speakerOption as Array<SpeakerOption>);
  };

  const setDateHandler = (date: Date) => {
    if (editMeetup && editMeetup.date) {
      setDate(new Date(editMeetup.date));
    }
    setDate(date);
  };

  const selectLocationHandler = (location: string) => {
    setLocation(location);
  };

  if (!auth.token) {
    return <Redirect to="/login" />;
  }

  return (
    <React.Fragment>
      {isCreating && (
        <Modal
          title="Create Meetup"
          onCancel={() => setIsCreating(false)}
          onClickOutsideModal={() => setIsCreating(false)}
        >
          <form onSubmit={handleSubmit(addMeetupHandler)}>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                placeholder="title"
                defaultValue={
                  editMeetup && editMeetup.title && editMeetup.title
                }
                ref={register}
              />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                placeholder="Meetup details ..."
                defaultValue={editMeetup && editMeetup.description}
                ref={register}
              />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <DayPickerInput
                onDayChange={(day: Date) => setDateHandler(day)}
                value={editMeetup && convertDate(editMeetup.date)}
              />
            </div>
            <div className="form-control">
              <label htmlFor="location">Location</label>
              <LocationSearchInput
                currentValue={editMeetup && editMeetup.location}
                selectLocationHandler={selectLocationHandler}
              />
            </div>
            <div className="form-control">
              <label htmlFor="title">Speakers</label>
              <Select
                placeholder="Speakers"
                classNamePrefix="multi-select"
                className="multi-select"
                defaultValue={
                  editMeetup &&
                  editMeetup.speakers &&
                  editMeetup.speakers.map(speaker => {
                    return {
                      value: speaker._id,
                      label: speaker.name
                    };
                  })
                }
                options={speakerOptions}
                onChange={option =>
                  option &&
                  speakerSelectionHandler(option as Array<SpeakerOption>)
                }
                isMulti
              />
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
      <div className={styles["nav-wrapper"]}>
        <Sidenav>
          <div className="main-wrapper">
            <div className="flex">
              <h1>MEETUPS</h1>
              <button
                className={styles["cta-button"]}
                onClick={() => {
                  setEditMeetup(undefined);
                  setIsCreating(true);
                }}
              >
                <i className="icofont-ui-add"></i>
                <span>Add meetup</span>
              </button>
            </div>
            <ul className={styles["meetup-list"]}>
              {data.meetups.map((meetup: Meetup) => (
                <ListItem key={meetup._id}>
                  <div className="flex">
                    <h1 className={styles["title"]}>{meetup.title}</h1>
                    <div className={styles["icon-group"]}>
                      <i
                        onClick={() => editMeetupHandler(meetup)}
                        className="icofont-ui-edit"
                      />
                      <i
                        onClick={() => deleteMeetupHandler(meetup._id)}
                        className={`icofont-ui-delete ${styles["icon-group__item--delete"]}`}
                      />
                    </div>
                  </div>
                  <hr className={`hr ${styles.hr}`} />
                  <div className={styles["meetup-details"]}>
                    <div className={styles["meetup-details__field"]}>
                      <p className={styles.label}>description</p>
                      <p>{meetup.description}</p>
                    </div>
                    <div className={styles["meetup-details__field"]}>
                      <p className={styles.label}>date</p>
                      <p>{convertDate(meetup.date)}</p>
                    </div>
                  </div>
                  <div className={styles["meetup-details"]}>
                    <div className={styles["meetup-details__field"]}>
                      <p className={styles.label}>speakers</p>
                      {meetup.speakers &&
                        meetup.speakers.map(speaker => (
                          <p className={styles["tag"]} key={speaker._id}>
                            {speaker.name}
                          </p>
                        ))}
                    </div>
                    <div className={styles["meetup-details__field"]}>
                      <p className={styles.label}>Location</p>
                      <p>
                        <i className="icofont-location-pin"></i>
                        {meetup.location}
                      </p>
                    </div>
                  </div>
                </ListItem>
              ))}
            </ul>
          </div>
        </Sidenav>
      </div>
    </React.Fragment>
  );
};

export default Meetups;
