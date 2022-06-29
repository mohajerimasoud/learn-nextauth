import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { RecoilRoot } from "recoil";

function MyApp({ Component, pageProps }) {
  const [interval, setInterval] = useState(1000000);

  return (
    <SessionProvider session={pageProps.session} refetchInterval={interval}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  );
}

export default MyApp;
