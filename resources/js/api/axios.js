import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track active requests for global loader
let requests = 0;

function toggleLoader(show) {
  const loader = document.getElementById("global-loader");
  if (loader) {
    loader.style.display = show ? "flex" : "none";
  }
}

// Request Interceptor
instance.interceptors.request.use(
  (config) => {
    // Add Bearer token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Show loader
    requests++;
    toggleLoader(true);

    return config;
  },
  (error) => {
    requests--;
    if (requests === 0) toggleLoader(false);
    return Promise.reject(error);
  }
);

// Response Interceptor
instance.interceptors.response.use(
  (response) => {
    requests--;
    if (requests === 0) toggleLoader(false);
    return response;
  },
  (error) => {
    requests--;
    if (requests === 0) toggleLoader(false);
    return Promise.reject(error);
  }
);

export default instance;
