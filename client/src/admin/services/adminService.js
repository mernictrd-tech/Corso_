import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const adminLogin = async (loginData) => {
  const { data } = await axios.post(
    `${API}/login`,
    loginData,
    {
      withCredentials: true,
    }
  );

  return data;
};