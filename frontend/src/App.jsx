import axios from "axios";
import { useEffect, useState, useCallback } from "react";

function App() {

  const [file, setFile] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMedia = useCallback(async () => {

    try {

      const response = await axios.get(
        "http://localhost:8080/api/media/me"
      );

      setMediaList(response.data);

    } catch (error) {

      console.error("Failed to fetch media", error);

    }

  }, []);

  useEffect(() => {

    let mounted = true;

    const loadMedia = async () => {

      try {

        const response = await axios.get(
          "http://localhost:8080/api/media/me"
        );

        if (mounted) {
          setMediaList(response.data);
        }

      } catch (error) {

        console.error("Failed to fetch media", error);

      }
    };

    loadMedia();

    return () => {
      mounted = false;
    };

  }, []);

  const uploadFile = async () => {

    if (!file) {
      alert("Please select file");
      return;
    }

    try {

      setLoading(true);

      /*
        Step 1:
        request presigned URL
      */

      const presignResponse = await axios.post(
        "http://localhost:8080/api/media/presign",
        {
          fileName: file.name,
          contentType: file.type
        }
      );

      const { uploadUrl, fileKey } =
        presignResponse.data;

      /*
        Step 2:
        upload directly to S3
      */

      await axios.put(
        uploadUrl,
        file,
        {
          headers: {
            "Content-Type": file.type
          }
        }
      );

      /*
        Step 3:
        notify backend
      */

      await axios.post(
        "http://localhost:8080/api/media/complete",
        {
          fileKey,
          mediaType: file.type
        }
      );

      /*
        Step 4:
        refresh media list
      */

      await fetchMedia();

      alert("Upload success");

      setFile(null);

    } catch (error) {

      console.error("Upload failed", error);

      alert("Upload failed");

    } finally {

      setLoading(false);

    }
  };

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