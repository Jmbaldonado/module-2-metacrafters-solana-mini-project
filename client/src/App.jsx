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
  const [fromWalletBalance, setFromWalletBalance] = useState(0);
  const [toWalletBalance, setToWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const provider = getProvider();

    if (provider) setProvider(provider);
    else setProvider(undefined);
  }, []);

  const createWallet = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post("http://localhost:4000/api/generate");
      setFromWallet(data.keypair);
      setFromWalletBalance(data.balance);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      try {
        setIsLoading(true);
        const response = await solana.connect();
        setWalletKey(response);

        const { data } = await axios.post("http://localhost:4000/api/balance", {
          publicKey: response.publicKey,
        });

        setToWalletBalance(data.balance);
      } catch (err) {
        console.warn(err);
      } finally {
        setIsLoading(false);
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

  const transferSol = async () => {
    try {
      setIsLoading(true);

      const { data } = await axios.post("http://localhost:4000/api/transfer", {
        from: fromWallet,
        to: walletKey,
        amount: fromWalletBalance,
      });

      if (data.signature) {
        const { data } = await axios.post("http://localhost:4000/api/balance", {
          publicKey: walletKey.publicKey,
        });
        setToWalletBalance(data.balance);
      }
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
              {walletKey.publicKey.toString()}

              <span className={"text-primary uppercase bold subtitle"}>
                Wallet Balance:
              </span>
              {toWalletBalance}
            </>
            <div className={"button__container"}>
              <button
                className={"button button--primary"}
                onClick={disconnectWallet}
                type={"button"}
              >
                Disconnect Wallet
              </button>

              <button
                className={"button button--primary"}
                onClick={transferSol}
                type={"button"}
              >
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
