import { useMutation, useQuery } from "@apollo/react-hooks";
import React, { useContext, useState } from "react";
import useForm from "react-hook-form";
import { Redirect } from "react-router-dom";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import ListItem from "../../components/listItem/ListItem";
import Loading from "../../components/loading/Loading";
import Modal from "../../components/modal/modal";
import Sidenav from "../../components/sidenav/Sidenav";
import AuthContext from "../../context/auth-context";
import calculateAge from "../../helpers/calculateAge";
import { cloudinaryUpload } from "../../helpers/cloudinary";
import Speaker from "../../interfaces/Speaker";
import { CREATE_SPEAKER, GET_SPEAKERS } from "../meetups/queries";
import styles from "./Speakers.module.scss";

export type CloudinaryFile = {
  name: string;
  lastModified: number;
  lastModifiedDate: Date;
  webkitRelativePath: string;
  size: number;
  type: string;
  path: string;
  preview: string;
};

type FormData = {
  name: string;
  nationality: string;
  age: Date;
  avatar: any;
  expertise_domain: string;
  expertise_title: string;
};

const Speakers: React.FC = () => {
  const auth = useContext(AuthContext);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [editSpeaker, setEditSpeaker] = useState<Speaker>();
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<Blob | string | null>();
  const [age, setAge] = useState<Date>();
  const { register, handleSubmit } = useForm<FormData>();
  const { data, loading: speakerLoading, refetch } = useQuery(GET_SPEAKERS, {
    onCompleted: () => {
      // TODO: check refetch --> onCompleted
      setSpeakers(data.speakers);
    }
  });

  const [createSpeaker, { loading: speakerAddLoading }] = useMutation(
    CREATE_SPEAKER,
    {
      onCompleted: () => {
        refetch();
        setIsCreating(false);
      }
    }
  );

  const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`;
  const upload_preset = process.env.REACT_APP_CLOUDINARY_PRESET;

  const addSpeakerHandler = (formData: FormData) => {
    if (!upload_preset || !avatar) {
      return;
    }
    cloudinaryUpload(upload_preset, url, avatar).then(result => {
      if (!result.error && result.url) {
        formData.avatar = result.url;
      }
      createSpeaker({
        variables: {
          input: {
            name: formData.name,
            age: formData.age,
            nationality: formData.nationality,
            avatar: formData.avatar,
            expertise: {
              title: formData.expertise_title,
              domain: formData.expertise_domain
            }
          }
        }
      });
    });
  };

  const setFileHandler = (file: Blob | string) => {
    setAvatar(file);
  };

  const clearFileHandler = () => {
    setAvatar(null);
  };

  if (speakerLoading || speakerAddLoading) return <Loading />;

  if (!auth.token) {
    return <Redirect to="/login" />;
  }

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
              <input type="date" name="age" ref={register} />
            </div>
            <div className="form-control">
              <label htmlFor="nationality">Nationality:</label>
              <input type="text" name="nationality" ref={register} />
            </div>
            <div className="form-control">
              <label htmlFor="avatar">Avatar:</label>
              {upload_preset && (
                <ImageUploader
                  onClearFile={() => clearFileHandler()}
                  onDropFile={files => setFileHandler(files)}
                />
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
            {data.speakers.map((speaker: Speaker) => (
              <ListItem key={speaker._id}>
                <div className={styles["speaker-info"]}>
                  <div className={styles["speaker-info__left"]}>
                    <p className={styles["speaker-info__left__name"]}>
                      {speaker.name} ({calculateAge(speaker.age)}
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
