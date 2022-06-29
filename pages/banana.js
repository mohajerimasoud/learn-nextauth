import Link from "next/link";
import React from "react";
import { useRecoilValue } from "recoil";
import { bananaAtom } from "../atoms/banana.atom";
const Banana = () => {
  const banana = useRecoilValue(bananaAtom);
  return (
    <div>
      <pre>Banana :{JSON.stringify(banana, null, 2)}</pre>
      <div>
        <Link href={"/fruits"}>go to fruits</Link>
      </div>
    </div>
  );
};

export default Banana;
