var express = require('express');
var router = express.Router();

const userController = require("../controllers/user");
const authController = require("../controllers/auth");
const secureMiddleware = require("../middleware/secure");
const sanitizeMiddleware = require("../middleware/sanitizeMiddleware");

router.get("/", secureMiddleware.csrfProtection, userController.getAccount);

router.get("/change-info", secureMiddleware.csrfProtection, userController.getAccountChange);
router.post("/change-info",sanitizeMiddleware, secureMiddleware.urlencodedParser, secureMiddleware.csrfProtection, userController.postAccountChange);

router.get("/change-password", authController.getChangePassword);
router.post("/change-password", sanitizeMiddleware, authController.postChangePassword);

router.post("/change-email", sanitizeMiddleware, secureMiddleware.urlencodedParser, secureMiddleware.csrfProtection, authController.postChangeEmail);

module.exports = router;