import axios from "axios";

const apiClient = axios.create({
  baseURL: `https://api.openweathermap.org`,
  // baseURL: `https://covidtracking.com`,
  // baseURL: `https://api.covidtracking.com`,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    // "Access-Control-Allow-Methods": "GET",
    // "Access-Control-Allow-Methods": "*",
    // "Acccess-Control-Allow-Origin": "*",
    // CORS_SUPPORTS_CREDENTIALS: true,
    // "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
  },
});

export default apiClient;
