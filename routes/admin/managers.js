const express = require("express");

const router = express.Router();
const auth = require("../../middleware/auth-admin");
const productsController = require("../../controller/admin/managerProduces");
const usersController = require("../../controller/admin/managerUsers");

router.post("/products/new-product", auth, productsController.addNewProducts);

router.put(
  "/products/updated-product/all",
  auth,
  productsController.updatedAllProducts
);

router.put(
  "/products/updated-product/:id",
  auth,
  productsController.updatedProducts
);

router.delete(
  "/products/deleted-product/:id",
  auth,
  productsController.deletedProducts
);

module.exports = router;
