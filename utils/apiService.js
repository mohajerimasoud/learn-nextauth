import axios from "axios";
import { getSession } from "next-auth/react";

const ApiClient = () => {
  const instance = axios.create();
  instance.interceptors.request.use(async (request) => {
    const session = await getSession();
    console.log("session", session.token.token.token.user.accessToken);
    if (session) {
      request.headers.common = {
        Authorization: `${session.token.accessToken}`,
      };
    }
    return request;
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(`error`, error);
    }
  );

  return instance;
};

export default ApiClient();