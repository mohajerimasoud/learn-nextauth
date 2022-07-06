import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signOut } from "next-auth/react";

async function refreshAccessToken(tokenObject) {
  try {
    const tokenResponse = await axios.post(
      `https://lawone.vaslapp.com/oauth/token?grant_type=refresh_token&refresh_token=${tokenObject}`,
      {},
      {
        headers: {
          Authorization: "Basic c2FtcGxlQ2xpZW50OnNhbXBsZVNlY3JldA==",
        },
      }
    );

    const outputData = {
      ...tokenResponse.data,
      expires_at: tokenResponse.data.expires_in * 1000 + Date.now(),
    };

    return outputData;
  } catch (error) {
    return {
      ...tokenObject,
      error: "RefreshAccessTokenError",
    };
  }
}

const providers = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      username: { label: "Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      try {
        const formData = new URLSearchParams();

        formData.append("grant_type", "password");
        formData.append("username", credentials.username);
        formData.append("password", credentials.password);

        const user = await axios.post(
          "https://lawone.vaslapp.com/" + "oauth/token",
          formData.toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Basic c2FtcGxlQ2xpZW50OnNhbXBsZVNlY3JldA==",
            },
          }
        );

        if (!user.data) {
          return null;
        }

        const outputData = {
          ...user.data,
          expires_at: user.data.expires_in * 1000 + Date.now(),
        };

        return outputData;
      } catch (e) {
        throw new Error(e);
      }
    },
  }),
];

const callbacks = {
  jwt: async ({ token, user }) => {
    if (token?.user?.expires_at < Date.now() && token?.user?.refresh_token) {
      const item = await refreshAccessToken(token?.user?.refresh_token);
      return item;
    } else {
      signOut();
    }

    user && (token.user = user);
    return token;
  },
  session: async ({ session, token }) => {
    if (
      token?.user?.expires_at / 10000 < Date.now() &&
      token?.user?.refresh_token
    ) {
      const item = await refreshAccessToken(token?.user?.refresh_token);
      return item;
    } else {
      signOut();
    }
    session.user = token.user;
    return session;
  },
};

export const options = {
  providers,
  callbacks,
  pages: {},
  secret: "your_secret",
};

const Auth = (req, res) => NextAuth(req, res, options);
export default Auth;
