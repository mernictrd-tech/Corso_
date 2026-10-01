import axios from "axios";

const API = `${import.meta.env.VITE_API_BASE_URL}/auth`;

const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");

      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);

// ================= REGISTER =================

export const registerUser = async (userData) => {
  const { data } = await api.post("/register", userData);
  return data;
};

// ================= LOGIN =================

export const loginUser = async (userData) => {
  const { data } = await api.post("/login", userData);
  return data;
};

// ================= GOOGLE LOGIN =================

export const googleLogin = async (accessToken) => {
  const { data } = await api.post("/google", {
    accessToken,
  });

  return data;
};

// ================= CURRENT USER =================

export const getCurrentUser = async () => {
  console.log("test123");
  const { data } = await api.get("/me");
  return data;
};

// ================= LOGOUT =================

export const logoutUser = async () => {
  const { data } = await api.post("/logout");
  return data;
};
