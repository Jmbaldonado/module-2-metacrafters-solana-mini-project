const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const apiRoutes = require("./routes/apiRoutes");

app.use(bodyParser.json());
app.use(cors());
app.use("/api", apiRoutes);

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
