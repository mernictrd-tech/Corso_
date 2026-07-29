import axios from "axios";

const API = "http://localhost:5000/api/auth";

const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

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
  const { data } = await api.get("/me");
  return data;
};

// ================= LOGOUT =================

export const logoutUser = async () => {
  const { data } = await api.post("/logout");
  return data;
};