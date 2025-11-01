import axios from "axios";

const api = axios.create({
  baseURL: "https://vutungtungrental-backend.onrender.com/",
  withCredentials: true,
});

export default api;
