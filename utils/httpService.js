import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const base_url = `https://lawone.vaslapp.com`;

export const HttpService = axios.create({
  baseURL: base_url,
  headers: {
    "Cache-Control": "no-cache",
    crossDomain: true,
    Accept: "application/json",
    "Content-Type": "application/json",
    lang: "fa",
  },
});

const logoutMechanism = () => {
  console.log("logoutMechanism !!");
  signOut();
};

HttpService.interceptors.request.use(
  async (config) => {
    const { headers } = config;
    const session = await getSession();
    const accessToken = session.user.access_token;

    if (headers && accessToken) {
      headers.Authorization = `Bearerr ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

HttpService.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!error || !error.response) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (error.response.status === 401) {
      const session = await getSession();
      const ref_token = session.user.refresh_token;

      if (!ref_token) {
        logoutMechanism();
        return Promise.reject(error);
      }

      if (!ref_token) {
        logoutMechanism();
      }

      const refreshRetry = await new Promise((resolve, reject) => {
        axios
          .post(
            `${base_url}/oauth/token?refresh_token=${ref_token}&grant_type=refresh_token`,
            {},
            {
              headers: {
                Accept: "application/json;utf-8",
                "Content-Type": "application/x-www-form-urlencoded;utf-8",
                Authorization: "Basic c2FtcGxlQ2xpZW50OnNhbXBsZVNlY3JldA==",
              },
            }
          )
          .then((response) => {
            const { access_token, refresh_token } = response.data;

            if (!access_token && !refresh_token) {
              logoutMechanism();
            }

            axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            resolve(axios(originalRequest));
          })
          .catch((err) => {
            logoutMechanism();
            reject(Promise.reject(err));
          });
      });

      return refreshRetry;
    }

    return Promise.reject(error);
  }
);

export default HttpService;
