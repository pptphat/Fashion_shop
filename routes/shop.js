const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const productController = require("../controllers/product");
const sanitizeMiddleware = require("../middleware/sanitizeMiddleware");
/* GET home page. */

router.get("/", sanitizeMiddleware, productController.getIndexProducts);

router.get(
    "/product/:productId",
    sanitizeMiddleware,
    productController.getProduct
);

router.get(
    "/products/:productType?",
    sanitizeMiddleware,
    productController.getProducts
);

router.post("/products/:productType*?", productController.postNumItems);

router.post(
    "/product/:productId",
    sanitizeMiddleware,
    productController.postComment
);

router.get("/search", sanitizeMiddleware, productController.getSearch);

router.get("/shopping_cart", productController.getCart);

router.get(
    "/add-to-cart/:productId",
    sanitizeMiddleware,
    productController.addToCart
);

router.get("/modify-cart", sanitizeMiddleware, productController.modifyCart);

router.get("/add-order", productController.addOrder);

router.post("/add-order", sanitizeMiddleware, productController.postAddOrder);

router.get("/delete-cart", productController.getDeleteCart);

router.get(
    "/delete-item/:productId",
    sanitizeMiddleware,
    productController.getDeleteItem
);

router.get("/merge-cart", productController.mergeCart);

module.exports = router;
