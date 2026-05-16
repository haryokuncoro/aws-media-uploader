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
    Initialize app
  */
  useEffect(() => {

    const initialize = async () => {

      try {

        await login();

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
    Upload file
  */
  const uploadFile = async () => {

    if (!file) {

      alert("Select file");

      return;
    }

    try {

      setLoading(true);

      const {
        uploadUrl,
        fileKey
      } = await getPresignedUrl(file);

      await uploadToS3(
        uploadUrl,
        file
      );

      await completeUpload(
        fileKey,
        file.type
      );

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

  /*
    Loading screen
  */
  if (!initialized) {

    return (

      <div className="min-h-screen bg-zinc-100 flex items-center justify-center">

        <div className="bg-white px-10 py-8 rounded-2xl border border-zinc-200 shadow-sm">

          <h1 className="text-xl font-semibold text-zinc-800">
            Initializing...
          </h1>

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-zinc-100">

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}

        <div className="mb-10">

          <h1 className="text-4xl font-bold text-zinc-900">
            Media Upload
          </h1>

          <p className="text-zinc-500 mt-2">
            Upload and manage your media
          </p>

        </div>

        {/* Upload Card */}

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm mb-10">

          <div className="flex flex-col md:flex-row gap-4 md:items-center">

            <input
              type="file"
              onChange={(e) =>
                setFile(e.target.files[0])
              }
              className="
                block
                w-full
                text-sm
                text-zinc-600
                file:mr-4
                file:py-2
                file:px-4
                file:rounded-xl
                file:border-0
                file:bg-zinc-900
                file:text-white
                hover:file:bg-zinc-700
              "
            />

            <button
              onClick={uploadFile}
              disabled={loading}
              className="
                bg-zinc-900
                hover:bg-zinc-700
                transition
                text-white
                px-5
                py-3
                rounded-xl
                font-medium
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {
                loading
                  ? "Uploading..."
                  : "Upload"
              }
            </button>

          </div>

          {
            file && (

              <p className="mt-4 text-sm text-zinc-500">

                Selected:
                {" "}
                {file.name}

              </p>
            )
          }

        </div>

        {/* Media Section */}

        <div>

          <h2 className="text-2xl font-semibold text-zinc-900 mb-6">

            My Media

          </h2>

          {
            mediaList.length === 0 && (

              <div className="bg-white border border-zinc-200 rounded-2xl p-10 text-center text-zinc-500">

                No media uploaded yet

              </div>
            )
          }

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {
              mediaList.map((media) => (

                <div
                  key={media.id}
                  className="
                    bg-white
                    border
                    border-zinc-200
                    rounded-2xl
                    overflow-hidden
                    shadow-sm
                  "
                >

                  {/* Preview */}

                  <div className="bg-zinc-100">

                    {
                      media.mediaType.startsWith(
                        "image"
                      )
                        ? (

                            <img
                              src={media.fileUrl}
                              alt="media"
                              className="
                                w-full
                                h-72
                                object-cover
                              "
                            />
                          )
                        : (

                            <video
                              controls
                              className="w-full h-72 object-cover"
                            >

                              <source
                                src={media.fileUrl}
                              />

                            </video>
                          )
                    }

                  </div>

                  {/* Footer */}

                  <div className="p-4">

                    <div className="flex items-center justify-between mb-3">

                      <span className="
                        text-xs
                        font-semibold
                        bg-zinc-900
                        text-white
                        px-3
                        py-1
                        rounded-full
                      ">
                        {media.status}
                      </span>

                    </div>

                    <p className="text-sm text-zinc-500 break-all">

                      {media.mediaType}

                    </p>

                  </div>

                </div>
              ))
            }

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;