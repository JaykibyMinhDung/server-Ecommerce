const express = require("express");

const router = express.Router();

const auth = require("../../middleware/auth-admin");
const histories = require("../../controller/admin/history");

router.get("/histories/all", auth, histories.getAllHistory);

router.get("/histories/month", auth, histories.getMonthHistory);

module.exports = router;
