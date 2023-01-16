const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {
  Keypair,
  clusterApiUrl,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/api/generate", async (req, res) => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const keypair = Keypair.generate();
  const { _keypair } = keypair;
  const { publicKey } = _keypair;
  const fromAirdropSignature = await connection.requestAirdrop(
    new PublicKey(publicKey),
    2 * LAMPORTS_PER_SOL
  );

  const latestBlockHash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockHash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: fromAirdropSignature,
  });
  const balance = await connection.getBalance(new PublicKey(publicKey));
  res.json({ _keypair, balance });
});

app.get("/api/connect", async (req, res) => {
  return Keypair.fromSecretKey();
});

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
