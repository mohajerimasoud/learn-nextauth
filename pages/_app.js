import { SessionProvider } from "next-auth/react";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const [interval, setInterval] = useState(1000000);

  return (
    <SessionProvider session={pageProps.session} refetchInterval={interval}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
