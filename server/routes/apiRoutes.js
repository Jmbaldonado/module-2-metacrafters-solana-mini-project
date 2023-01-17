const express = require("express");
const router = express.Router();

const {
  generateKeyPair,
  getWalletBalance,
  transferSol,
} = require("../controllers/api.controller");

router.post("/generate", generateKeyPair);
router.post("/balance", getWalletBalance);
router.post("/transfer", transferSol);
module.exports = router;
