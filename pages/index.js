import styles from "../styles/Home.module.css";
import { signIn, signOut } from "next-auth/react";

export default function Home() {
  return (
    <div className={styles.container}>
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
    </div>
  );
}
