import React from "react";
import { signIn, signOut } from "next-auth/react";
import { useSession, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";

const NextAuthHoohks = () => {
  const { data: session, status } = useSession();
  const [Providers, setproviders] = useState();
  const getAllData = async () => {
    try {
      const providers = await getProviders();
      setproviders(providers);
    } catch (error) {
      console.log("error");
    }
  };

  useEffect(() => {
    getAllData();
  }, [session]);
  return (
    <div>
      {" "}
      <button
        onClick={() =>
          signIn("credentials", {
            username: "lawone",
            password: "lawone123456",
          })
        }
      >
        Sign in
      </button>
      <button onClick={() => signOut()}>Sign out</button>
      <h2>useSession</h2>
      <pre>session : {JSON.stringify(session, null, 2)} </pre>
      <div>status : {JSON.stringify(status, null, 2)} </div>
      <h2>getProviders</h2>
      <pre>Providers : {JSON.stringify(Providers, null, 2)}</pre>
    </div>
  );
};

export default NextAuthHoohks;
