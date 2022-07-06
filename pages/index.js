import styles from "../styles/Home.module.css";

import NextAuthHoohks from "../components/NextAuthHoohks";
import ApiCall from "../components/ApiCall";

export default function Home() {
  return (
    <div className={styles.container}>
      <NextAuthHoohks />
      <div>========================</div>
      <ApiCall />
    </div>
  );
}
