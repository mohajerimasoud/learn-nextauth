import Link from "next/link";
import React, { useRef } from "react";
import { useRecoilState } from "recoil";
import { bananaAtom } from "../atoms/banana.atom";

const Fruits = () => {
  const teastRef = useRef(null);
  const colorRef = useRef(null);

  const [banana, setbanana] = useRecoilState(bananaAtom);

  const setValue = () => {
    setbanana({
      color: colorRef.current.value || banana.color,
      teast: teastRef.current.value || banana.teast,
    });
  };

  return (
    <div>
      <h2>Fruits Page</h2>
      <h2>banana</h2>
      <pre>value : {JSON.stringify(banana, null, 2)}</pre>
      <input type="text" placeholder="color" ref={colorRef} />
      <input type="text" placeholder="teast" ref={teastRef} />
      <button onClick={setValue}>set banana</button>
      <div>
        <Link href={"/banana"}>go to banana</Link>
      </div>
    </div>
  );
};

export default Fruits;
