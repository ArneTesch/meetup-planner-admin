import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import useForm from "react-hook-form";
import Select from "react-select";
import ListItem from "../../components/listItem/ListItem";
import Loading from "../../components/loading/Loading";
import Modal from "../../components/modal/modal";
import Sidenav from "../../components/sidenav/Sidenav";
import convertDate from "../../helpers/convertDate";
import Meetup from "../../interfaces/Meetup";
import Speaker from "../../interfaces/Speaker";
import styles from "./Meetups.module.scss";

const GET_SPEAKERS = gql`
  {
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
  }
`;

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

const CREATE_MEETUP = gql`
  mutation CreateMeetup(
    $title: String!
    $description: String!
    $date: String!
    $location: String!
    $speakers: [ID!]
  ) {
    createMeetup(
      meetupInput: {
        title: $title
        description: $description
        date: $date
        location: $location
        speakers: $speakers
      }
    ) {
      title
      description
      date
      location
      speakers {
        _id
        name
      }
    }
  }
`;

type MeetupFormData = {
  title: string;
  description: string;
  date?: string;
  location: string;
  speakers: string[];
};

type SpeakerOption = {
  value: string;
  label: string;
};

const Meetups: React.FC = () => {
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [speakerOptions, setspeakerOptions] = useState<SpeakerOption[]>([]);
  const [date, setDate] = useState<Date>();
  const { loading, error } = useQuery(GET_MEETUPS, {
    onCompleted: data => {
      setMeetups(data.meetups);
    }
  });
  const { loading: speakerLoading, error: speakerError } = useQuery(
    GET_SPEAKERS,
    {
      onCompleted: data => {
        setSpeakers(data);
        data.speakers.forEach((speaker: Speaker) => {
          console.log(speaker);
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
        console.log(err);
      }
    }
  );
  const { register, handleSubmit } = useForm<MeetupFormData>();
  const [createMeetup] = useMutation(CREATE_MEETUP, {
    onCompleted: ({ createMeetup }) => {
      console.log(createMeetup);
    }
  });

  if (error) {
    return <p>ERROR ${error.message}</p>;
  }
  if (loading) return <Loading />;
  if (speakerLoading) return <Loading />;

  const addMeetupHandler = (formData: MeetupFormData) => {
    formData.date = date && date.toLocaleDateString();
    createMeetup({
      variables: {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location
        // speakers: FormData.speakers
      }
    });
  };

  // const selectOptions;
  console.log(speakerOptions);

  return (
    <React.Fragment>
      {isCreating && (
        <Modal title="Create Meetup" onCancel={() => setIsCreating(false)}>
          <form onSubmit={handleSubmit(addMeetupHandler)}>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                placeholder="title"
                ref={register}
              />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                placeholder="Meetup details ..."
                ref={register}
              />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <DayPickerInput
                onDayChange={(day: Date) => setDate(day)}
                ref={register}
              />
            </div>
            <div className="form-control">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                placeholder="Location"
                name="location"
                ref={register}
              />
            </div>
            <div className="form-control">
              <label htmlFor="title">Speakers</label>
              {/* TODO: DROPDOWN LIST WITH SPEAKERS */}
              <Select options={speakerOptions} />
              {/* <input
                type="text"
                name="speakers"
                placeholder="Speakers"
                ref={register}
              /> */}
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
                onClick={() => setIsCreating(true)}
              >
                <i className="icofont-ui-add"></i>
                <span>Add meetup</span>
              </button>
            </div>
            <ul className={styles["meetup-list"]}>
              {meetups.map((meetup: Meetup) => (
                <ListItem key={meetup._id}>
                  <div className={`flex`}>
                    <h1 className={styles["title"]}>{meetup.title}</h1>
                    <div className={styles["icon-group"]}>
                      <i className="icofont-ui-edit"></i>
                      <i
                        className={`icofont-ui-delete ${styles["icon-group__item--delete"]}`}
                      ></i>
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
