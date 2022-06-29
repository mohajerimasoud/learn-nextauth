import { atom } from "recoil";

export const bananaAtom = atom({
  key: "banana",
  default: {
    color: "yellow",
    teast: "sweet",
  },
});
