const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./server/database/connection");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
dotenv.config();
const PORT = process.env.PORT || 8000;

connectDB();

// load routes
app.use("/api/user", require("./server/routes/userRoute"));
app.use("/api/item", require("./server/routes/itemRoute"));
app.use("/api/bid", require("./server/routes/biddingRoute"));
app.listen(PORT, () => {
	console.log(`listing on port  localhost:${PORT}`);
});
