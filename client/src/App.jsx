import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

const getProvider = () => {
  if ("solana" in window) {
    const provider = window.solana;
    const phantom = provider.hasOwnProperty("isPhantom");
    if (phantom) {
      return provider;
    }
  }
};

function App() {
  const [provider, setProvider] = useState(undefined);
  const [walletKey, setWalletKey] = useState(undefined);
  const [fromWallet, setFromWallet] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const provider = getProvider();

    if (provider) setProvider(provider);
    else setProvider(undefined);
  }, []);

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      try {
        const response = await solana.connect();
        setWalletKey(response.publicKey.toString());
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const disconnectWallet = async () => {
    const { solana } = window;

    if (walletKey && solana) {
      try {
        await solana.disconnect();
        setWalletKey(undefined);
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const createWallet = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post("http://localhost:4000/api/generate");
      const {
        _keypair: { publicKey },
      } = data;
      setFromWallet(publicKey);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={"App"}>
      <img src={"src/assets/phantom.svg"} alt="Phantom Icon" />
      <h1 className={"title text-primary"}>Solana mini project</h1>

      <div className={"container"}>
        {!provider && (
          <p>
            No provider found. Install{" "}
            <a
              href="https://phantom.app/"
              target={"_blank"}
              className={"text-primary"}
            >
              Phantom Browser extension
            </a>
          </p>
        )}
        {isLoading ? (
          <>Loading...</>
        ) : !fromWallet ? (
          <button onClick={createWallet} className={"button button--primary"}>
            Create a New Solana Account
          </button>
        ) : provider && walletKey ? (
          <>
            <>
              <span className={"text-primary uppercase bold subtitle"}>
                Wallet Address:
              </span>
              {walletKey}
            </>
            <div className={"button__container"}>
              <button
                className={"button button--primary"}
                onClick={disconnectWallet}
                type={"button"}
              >
                Disconnect Wallet
              </button>

              <button className={"button button--primary"} type={"button"}>
                Transfer Sol
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              className={"button button--primary"}
              onClick={connectWallet}
              type={"button"}
            >
              Connect Wallet
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
