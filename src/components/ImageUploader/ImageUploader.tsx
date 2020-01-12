import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./ImageUploader.module.scss";

type ImageUploaderProps = {
  uploadUrl: string;
  uploadPreset: string;
};

const ImageUploader: React.FC<ImageUploaderProps> = props => {
  const { uploadUrl, uploadPreset } = props;
  const onDrop = useCallback(
    acceptedFiles => {
      const formData = new FormData();

      const xhr = new XMLHttpRequest();
      if (!uploadPreset || !uploadUrl) {
        return console.error("No upload preset or url defined!");
      }

      xhr.open("POST", uploadUrl, true);
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

      xhr.onerror = e => {
        console.error(e, "Error during upload");
      };

      xhr.onreadystatechange = e => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const responseUrl = response.secure_url;
          console.log("successfully uploaded!", responseUrl);
        }
      };

      formData.append("upload_preset", uploadPreset);
      formData.append("tags", "avatar upload");
      formData.append("file", acceptedFiles[0]);
      xhr.send(formData);
    },
    [uploadPreset, uploadUrl]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/x-png, image/gif, image/jpeg, image/webp"
  });

  return (
    <div className={styles["image-uploader"]} {...getRootProps()}>
      <input multiple={false} name="avatar" {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default ImageUploader;
