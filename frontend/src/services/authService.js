import api from "../api/axios";

/*
  Auto login
*/
export const login = async () => {

  const response = await api.post(
    "/auth/login",
    {
      email: "test@mail.com",
      password: "String123!"
    }
  );

  const token = response.data.data;

  localStorage.setItem(
    "token",
    token
  );

  return token;
};