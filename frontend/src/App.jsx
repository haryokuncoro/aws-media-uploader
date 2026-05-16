import {
  useEffect,
  useState
} from "react";

import {
  login
} from "./services/authService";

import {
  getMyMedia,
  getPresignedUrl,
  completeUpload,
  uploadToS3
} from "./services/mediaService";

function App() {

  const [file, setFile] =
    useState(null);

  const [mediaList, setMediaList] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [initialized, setInitialized] =
    useState(false);

  /*
    Fetch media
  */
  const fetchMedia = async () => {

    try {

      const data =
        await getMyMedia();

      setMediaList(data);

    } catch (error) {

      console.error(
        "Failed to fetch media",
        error
      );
    }
  };

  /*
    Auto login on startup
  */
  useEffect(() => {

    const initialize = async () => {

      try {

        /*
          Login first
        */
        await login();

        /*
          Then fetch media
        */
        await fetchMedia();

        setInitialized(true);

      } catch (error) {

        console.error(
          "Initialization failed",
          error
        );
      }
    };

    initialize();

  }, []);

  /*
    Upload flow
  */
  const uploadFile = async () => {

    if (!file) {

      alert("Select file");

      return;
    }

    try {

      setLoading(true);

      /*
        Step 1:
        get presigned URL
      */
      const {
        uploadUrl,
        fileKey
      } = await getPresignedUrl(file);

      /*
        Step 2:
        upload directly to S3
      */
      await uploadToS3(
        uploadUrl,
        file
      );

      /*
        Step 3:
        notify backend
      */
      await completeUpload(
        fileKey,
        file.type
      );

      /*
        Step 4:
        refresh media
      */
      await fetchMedia();

      alert("Upload success");

      setFile(null);

    } catch (error) {

      console.error(
        "Upload failed",
        error
      );

      alert("Upload failed");

    } finally {

      setLoading(false);
    }
  };

  if (!initialized) {

    return <h1>Initializing...</h1>;
  }

  return (
    <div style={{ padding: 40 }}>

      <h1>Upload Media</h1>

      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      <button
        onClick={uploadFile}
        disabled={loading}
      >
        {
          loading
            ? "Uploading..."
            : "Upload"
        }
      </button>

      <hr />

      <h2>My Media</h2>

      {
        mediaList.map((media) => (

          <div key={media.id}>

            <p>{media.fileKey}</p>

            <p>{media.status}</p>

          </div>
        ))
      }

    </div>
  );
}

export default App;