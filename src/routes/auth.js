const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const accountRouter = require("./account");

// router.get('*', authController.jwtAuthen, authController.result);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.get("/logout", authController.getLogout);

router.get("/create-account", authController.getSignUp);
router.post("/create-account", authController.postSignUp);

router.get("/verify-email", authController.jwtSign, authController.getVerifyEmail);
router.post("/verify-email", authController.postVerifyEmail);

router.get("/forgot-password", authController.getForgotPass);
router.post("/forgot-password", authController.postForgotPass);

router.get("/reset-password", authController.getResetPass);
router.post("/reset-password", authController.postResetPass);

router.use("/account", authController.jwtAuthen, accountRouter)


module.exports = router;
