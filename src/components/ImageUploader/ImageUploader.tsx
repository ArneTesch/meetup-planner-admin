import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./ImageUploader.module.scss";

type ImageUploaderProps = {
  onDropFile(file: any): void;
  onClearFile(): void;
};

type File = {
  preview: string;
};

const ImageUploader: React.FC<ImageUploaderProps> = props => {
  const { onDropFile, onClearFile } = props;
  const [files, setFiles] = useState<File[]>([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
      onDropFile(acceptedFiles[0]);
    },
    onDropRejected: () => {
      console.log("rejected");
    },
    accept: "image/x-png, image/gif, image/jpeg, image/webp, image/png",
    multiple: false
  });

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const preview = files.map((file, i) => (
    <div className={styles["avatar-preview"]} key={i}>
      <img src={file.preview} alt="thumbnail preview" />
    </div>
  ));

  const onClearFileHandler = () => {
    setFiles([]);
    onClearFile();
  };

  return (
    <section className={styles["dropzone-container"]}>
      <div
        className={`${styles["image-uploader"]} ${
          isDragActive ? styles.isDragActive : ""
        } `}
        {...getRootProps()}
      >
        {!files.length && <input {...getInputProps()} />}

        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : !files.length ? (
          <p>Drag 'n' drop some files here, or click to select files</p>
        ) : (
          <button
            className={styles["btn-clear-file"]}
            onClick={() => onClearFileHandler()}
          >
            <i className="icofont-close"></i> clear files
          </button>
        )}
      </div>
      {files.length ? preview : <React.Fragment />}
    </section>
  );
};

export default ImageUploader;
