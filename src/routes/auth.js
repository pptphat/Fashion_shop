const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const sanitizeMiddleware = require("../middleware/sanitizeMiddleware");
const accountRouter = require("./account");


// router.get('*', authController.jwtAuthen, authController.result);
router.get("/login", authController.getLogin);
router.post("/login", sanitizeMiddleware, authController.postLogin);

router.get("/logout", authController.getLogout);

router.get("/create-account", authController.getSignUp);
router.post("/create-account", sanitizeMiddleware, authController.postSignUp);

router.get("/verify-email", sanitizeMiddleware, authController.jwtSign, authController.getVerifyEmail);
router.post("/verify-email", sanitizeMiddleware, authController.postVerifyEmail);

router.get("/forgot-password", authController.getForgotPass);
router.post("/forgot-password", sanitizeMiddleware, authController.postForgotPass);

router.get("/reset-password", sanitizeMiddleware, authController.getResetPass);
router.post("/reset-password", sanitizeMiddleware, authController.postResetPass);

router.use("/account", authController.jwtAuthen, accountRouter)


module.exports = router;
