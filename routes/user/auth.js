const express = require("express");
const router = express.Router();

const authentication_route = require("../../controller/user/auth");

const firewall = require("../../middleware/auth");

router.post("/login", authentication_route.login);

router.post("/users/signup", authentication_route.signup);

router.get("/users/:id", authentication_route.getUser);

router.get("/logout", authentication_route.logout);

module.exports = router;
