import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use(

  (config) => {

    /*
      Skip token for login API
    */
    if (
      config.url === "/auth/login"
    ) {

      return config;
    }

    const token =
      localStorage.getItem("token");

    /*
      Attach token only if exists
    */
    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {

    return Promise.reject(error);
  }
);

export default api;