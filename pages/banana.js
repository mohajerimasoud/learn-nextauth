import Link from "next/link";
import React from "react";
import { useRecoilValue } from "recoil";
import { bananaAtom } from "../atoms/banana.atom";
import ApiClient from "../utils/apiService";

const Banana = () => {
  const banana = useRecoilValue(bananaAtom);

  const sendRequest = () => {
    ApiClient.get(
      "https://lawone.vaslapp.com/api/v2/inbox/user?pageNumber=0&pageSize=999&sort=DESC&sortKey=id"
    )
      .then((res) => {
        console.log("sendRequest res", res);
      })
      .catch((error) => {
        console.log("sendRequest error", error);
      });
  };
  return (
    <div>
      <pre>Banana :{JSON.stringify(banana, null, 2)}</pre>
      <button onClick={sendRequest}>sendRequest</button>
      <div>
        <Link href={"/fruits"}>go to fruits</Link>
      </div>
    </div>
  );
};

export default Banana;
