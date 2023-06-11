var express = require('express');
var router = express.Router();

const userController = require("../controllers/user");
const authController = require("../controllers/auth");
const secureMiddleware = require("../middleware/secure");

router.get("/", userController.getAccount);

router.get("/change-info", secureMiddleware.csrfProtection, userController.getAccountChange);
router.post("/change-info", secureMiddleware.urlencodedParser, secureMiddleware.csrfProtection, userController.postAccountChange);

router.get("/change-password", authController.getChangePassword);
router.post("/change-password", authController.postChangePassword);

router.post("/change-email", authController.postChangeEmail);

module.exports = router;