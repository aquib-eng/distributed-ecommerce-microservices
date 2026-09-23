import axios from "axios";

const api = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// REQUEST INTERCEPTOR
// ======================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      console.log(
        `Authorization header added for: ${config.url}`
      );
    } else {
      console.warn(
        `No authentication token found for: ${config.url}`
      );
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn(
        "401 Unauthorized received."
      );

      const requestUrl = error.config?.url || "";

      // Do not immediately remove the token for login/register
      if (
        !requestUrl.includes("/api/auth/login") &&
        !requestUrl.includes("/api/auth/register")
      ) {
        localStorage.removeItem("token");
      }
    }

    return Promise.reject(error);
  }
);

export default api;