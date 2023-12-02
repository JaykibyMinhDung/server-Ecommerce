const express = require("express");
const router = express.Router();

const product = require("../../controller/user/products");
const order = require("../../controller/user/orders");
const histories = require("../../controller/admin/history");
const firewall = require("../../middleware/auth");

// product
router.get("/products", product.getProducts);

router.get("/products/pagination", product.getPaginationProducts);

router.get("/products/:id", product.getDetailProducts);

// cart
router.get("/carts", firewall, product.getCartUser);

router.post("/carts/add", firewall, product.addToCart);

router.put("/carts/updated", firewall, product.updatedCart);

router.delete("/carts/delete", firewall, product.deleteCartUser);

// mail
router.post("/email", firewall, product.sendMailCheckout);

// order
// router.get("/histories/all/test", firewall, histories.getAllHistory);

router.get("/histories/:id", firewall, order.detailHistory);

router.get("/histories", firewall, order.historyOrder);

module.exports = router;
