import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshAccessToken(tokenObject) {
  try {
    // Get a new set of tokens with a refreshToken
    // console.log(`----- tokenObject`, tokenObject);
    const tokenResponse = await axios.post(
      `https://lawone.vaslapp.com/oauth/token?refresh_token=${tokenObject.refreshToken}&grant_type=refresh_token`,
      {
        token: tokenObject.refreshToken,
      }
    );

    return {
      ...tokenObject,
      accessToken: tokenResponse.data.accessToken,
      accessTokenExpiry: tokenResponse.data.accessTokenExpiry,
      refreshToken: tokenResponse.data.refreshToken,
    };
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
    authorize: async (credentials) => {
      try {
        // Authenticate user with credentials
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

        const tokenOutput = {
          accessToken: user.data.access_token,
          refreshToken: user.data.refresh_token,
          accessTokenExpiry: user.data.expires_in * 1000 + Date.now(),
        };

        // console.dir(tokenOutput, { depth: null });

        return tokenOutput;
      } catch (e) {
        throw new Error(e);
      }
    },
  }),
];

const callbacks = {
  jwt: async ({ token, user, account }) => {
    console.log(
      "------ auth callback jwt: token, user, account ",
      token,
      user,
      account
    );
    if (account && user) {
      console.log("------ auth callback jwt: initial signin");

      return {
        accessToken: account.access_token,
        accessTokenExpires: Date.now() + account.expires_at * 1000,
        refreshToken: account.refresh_token,
        user,
      };
    }

    // Return previous token if the access token has not expired yet
    if (Date.now() < token.accessTokenExpires) {
      console.log(
        "------ auth callback jwt: Date.now() < token.accessTokenExpires"
      );

      return token;
    }

    // If the call arrives after 23 hours have passed, we allow to refresh the token.
    // console.log("------ auth callback jwt:refreshAccessToken(token)");
    // console.log("---- token", token);
    return refreshAccessToken(token);
  },
  async session({ session, token }) {
    session.user = token.user;
    session.accessToken = token.accessToken;
    session.error = token.error;

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
