import axios from "axios";

const API = `${import.meta.env.VITE_API_BASE_URL}/admin`;

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