const express = require("express");
const router = express.Router();

const chatroom = require("../../controller/chat/chat");

const firewall = require("../../middleware/auth");

router.get("/chatrooms/getById", firewall, chatroom.getRoomChat);

router.get("/chatrooms/getAllRoom", firewall, chatroom.getAllRoomChat);

router.post("/chatrooms/createNewRoom", firewall, chatroom.createRoomChat);

router.put("/chatrooms/addMessage", firewall, chatroom.addNewMessage);

module.exports = router;
