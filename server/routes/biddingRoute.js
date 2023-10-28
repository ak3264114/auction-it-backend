const express = require("express");
const { checkUserAuth } = require("../middlewares/auth-middleware");
const { placeBid, acceptBid } = require("../controller/bidController");

const route = express.Router();

route.post("/place-bid", checkUserAuth, placeBid);
route.post("/accept-bid", checkUserAuth, acceptBid);
module.exports = route;
