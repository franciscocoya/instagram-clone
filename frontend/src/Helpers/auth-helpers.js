import axios from "axios";

const TOKEN_KEY = "INSTAGRAM_TOKEN";

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function deleteToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function initAxiosInterceptors() {
  //axios.defaults.baseURL = "https://localhost:4000/";

  axios.interceptors.request.use(function (config) {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `bearer ${token}`;
    }

    return config;
  });

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response.status === 401) {
        deleteToken();
        window.location = "/accounts/SignIn";
      } else {
        return Promise.reject(error);
      }
    }
  );
}
