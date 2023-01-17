const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const apiRoutes = require("./routes/apiRoutes");

app.use(bodyParser.json());
app.use(cors());

// app.post("/api/generate", async (req, res) => {
//   const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
//   const keypair = Keypair.generate();
//   const { _keypair } = keypair;
//   const { publicKey } = _keypair;
//   const fromAirdropSignature = await connection.requestAirdrop(
//     new PublicKey(publicKey),
//     2 * LAMPORTS_PER_SOL
//   );
//
//   const latestBlockHash = await connection.getLatestBlockhash();
//
//   await connection.confirmTransaction({
//     blockhash: latestBlockHash,
//     lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
//     signature: fromAirdropSignature,
//   });
//   const balance = await connection.getBalance(new PublicKey(publicKey));
//   res.json({ keypair, balance });
// });
//
// app.post("/api/balance", async (req, res) => {
//   const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
//   const balance = await connection.getBalance(
//     new PublicKey(req.body.publicKey)
//   );
//
//   const balanceInSol = balance / LAMPORTS_PER_SOL;
//   res.json({ balance: balanceInSol });
// });
//
// app.post("/api/transfer", async (req, res) => {
//   const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
//   const { walletBalance, fromWallet, toPublicKey } = req.body;
//   console.log(fromWallet.publicKey);
//   // console.log(PublicKey(toPublicKey));
//   // const transaction = new Transaction().add(
//   //   SystemProgram.transfer({
//   //     fromPubkey: fromWallet.publicKey,
//   //     toPubkey: toPublicKey,
//   //     lamports: walletBalance,
//   //   })
//   // );
//   //
//   // const signature = await sendAndConfirmTransaction(connection, transaction, [
//   //   fromWallet,
//   // ]);
//   // res.json(signature);
// });

app.use("/api", apiRoutes);

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
