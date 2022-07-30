import { MoralisProvider } from "react-moralis";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      serverUrl="https://vtsbrk2s5mfg.usemoralis.com:2053/server"
      appId="pCV9NiStXTJUmzyW4lxyd8yAB8Rpvl7dfek24TVm"
    >
      {" "}
      <Component {...pageProps} />
    </MoralisProvider>
  );
}

export default MyApp;
