import React, { useState } from "react";
import { HttpService } from "../utils/httpService";

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
      })
      .catch((error) => {
        setResult("Error");
      });
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
