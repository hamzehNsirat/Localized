import axios from "axios";

// Base Axios instance
const apiClient = axios.create({
  baseURL:  "http://localhost:5055/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (optional)
apiClient.interceptors.request.use(
  (config) => {
    // Add token to headers if logged in
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (optional)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    console.error(error);
    return Promise.reject(error);
  }
);

export default apiClient;

 

  