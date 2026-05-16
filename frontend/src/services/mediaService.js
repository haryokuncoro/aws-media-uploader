import api from "../api/axios";

/*
  Fetch user media
*/
export const getMyMedia = async () => {

  const response =
    await api.get("/api/media/me");

  return response.data;
};

/*
  Request presigned URL
*/
export const getPresignedUrl = async (
  file
) => {

  const response =
    await api.post(
      "/api/media/presign",
      {
        fileName: file.name,
        contentType: file.type
      }
    );

  return response.data;
};

/*
  Notify backend upload completed
*/
export const completeUpload = async (
  fileKey,
  mediaType
) => {

  await api.post(
    "/api/media/complete",
    {
      fileKey,
      mediaType
    }
  );
};

/*
  Upload directly to S3
*/
export const uploadToS3 = async (
  uploadUrl,
  file
) => {

  await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type
    },
    body: file
  });
};