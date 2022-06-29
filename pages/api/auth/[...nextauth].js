import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshAccessToken(tokenObject) {
  console.log("==== Auth report : refreshAccessToken called", tokenObject);

  try {
    // Get a new set of tokens with a refreshToken
    // console.log(`----- tokenObject`, tokenObject);
    const tokenResponse = await axios.post(
      `https://lawone.vaslapp.com/oauth/token?grant_type=refresh_token&refresh_token=${tokenObject}`,
      {},
      {
        headers: {
          Authorization: "Basic c2FtcGxlQ2xpZW50OnNhbXBsZVNlY3JldA==",
        },
      }
    );
    console.log(
      "----- get new token report ",
      tokenResponse.data.accessTokenExpiry
    );

    return {
      ...tokenObject,
      accessToken: tokenResponse.data.access_token,
      accessTokenExpiry: tokenResponse.data.refreshToken,
      refreshToken: tokenResponse.data.accessTokenExpiry,
    };
  } catch (error) {
    console.log("==== Auth report : refresh token error ", error?.message);
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
      console.log("==== Auth report : providers=>authorize called");

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

        const tokenOutput = {
          accessToken: user.data.access_token,
          refreshToken: user.data.refresh_token,
          accessTokenExpiry: user.data.expires_in * 1000 + Date.now(), // absolute time that token expires
        };

        return tokenOutput;
      } catch (e) {
        throw new Error(e);
      }
    },
  }),
];

const callbacks = {
  async jwt(props) {
    console.log("----- auth callback jwt: props ", props);
    if (
      props?.user?.accessTokenExpiry < Date.now() &&
      props?.user?.refreshToken
    ) {
      console.log("==== Auth report : jwt need refresh the token");
      refreshAccessToken(props?.user?.refreshToken);
    }
    return props;
  },
  async session(props) {
    return props;
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
