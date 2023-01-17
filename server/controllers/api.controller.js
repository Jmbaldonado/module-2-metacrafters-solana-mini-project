const {
  Keypair,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");
const base58 = require("bs58");

async function airdropSol(publicKey) {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const signature = await connection.requestAirdrop(
    new PublicKey(publicKey),
    2 * LAMPORTS_PER_SOL
  );

  const latestBlockHash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockHash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: signature,
  });
}

async function getBalance(publicKey) {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const balance = await connection.getBalance(publicKey);
  return balance / LAMPORTS_PER_SOL;
}
module.exports = {
  generateKeyPair: async function (_req, res) {
    const keypair = Keypair.generate();
    await airdropSol(keypair.publicKey);
    const balance = await getBalance(keypair.publicKey);

    res.json({ keypair, balance });
  },

  getWalletBalance: async function (req, res) {
    const { publicKey } = req.body;
    const balance = await getBalance(new PublicKey(publicKey));
    res.json({ balance });
  },

  transferSol: async function (req, res) {
    const { from, to, amount } = req.body;

    const connection = await new Connection(
      clusterApiUrl("devnet"),
      "confirmed"
    );

    const fromPublicKey = new PublicKey(Object.values(from._keypair.publicKey));
    await airdropSol(new Uint8Array(Object.values(from._keypair.publicKey)));
    const fromSigner = {
      publicKey: fromPublicKey,
      secretKey: new Uint8Array(Object.values(from._keypair.secretKey)),
    };

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromPublicKey,
        toPubkey: new PublicKey(to.publicKey),
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      fromSigner,
    ]);
    res.json({ signature });
  },
};
