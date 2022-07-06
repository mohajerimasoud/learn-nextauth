import React, { useState } from "react";
import { HttpService } from "../utils/httpService";
import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const ApiCall = () => {
  const [result, setResult] = useState("");
  const [data, setData] = useState();

  const callapi = async () => {
    HttpService.get(
      "/api/v2/inbox?pageNumber=0&pageSize=10&sortKey=createdDate&sort=DESC"
    )
      .then((respone) => {
        setResult("success");
        setData(respone);

        console.log("Api call respone :", respone);
      })
      .catch((error) => {
        console.log("Api call Error :", error);
        setResult("Error");
      });

    // try {
    //   const session = await getSession();
    //   const accessToken = session.user.access_token;

    //   const call = await axios.get(
    //     `https://lawone.vaslapp.com/api/v2/inbox?pageNumber=0&pageSize=10&sortKey=createdDate&sort=DESC`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //     }
    //   );
    //   setResult("success");
    //   setData(call);
    //   console.log(call);
    // } catch (error) {
    //   console.log("Api call Error :", error);

    //   setResult("Error");
    // }
  };

  return (
    <div>
      <h2>ApiCall</h2>
      <div>
        <button onClick={callapi}>Call it !</button>
      </div>
      <div>Result :{result}</div>
      <pre>Data : {JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ApiCall;
