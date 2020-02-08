export type ImageUploadResponse = {
  error: boolean;
  url?: string;
};

export const cloudinaryUpload = async (
  uploadPreset: string,
  uploadUrl: string,
  image: Blob | string
) => {
  return new Promise<ImageUploadResponse>((resolve, reject) => {
    const formData = new FormData();
    let responseUrl = "";
    const xhr = new XMLHttpRequest();

    if (!uploadPreset || !uploadUrl) {
      return reject("No upload preset or url defined!");
    }

    xhr.open("POST", uploadUrl, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    xhr.onerror = e => {
      console.error(e, "Error during upload");
      reject(e);
    };

    xhr.onreadystatechange = e => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        responseUrl = response.secure_url;
        console.log("successfully uploaded!", responseUrl);

        return resolve({
          error: false,
          url: responseUrl
        });
      }
    };

    formData.append("upload_preset", uploadPreset);
    formData.append("tags", "avatar upload");
    formData.append("file", image);
    xhr.send(formData);
  });
};
