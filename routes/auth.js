const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/auth");
const userController = require("../controllers/user");

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.get("/logout", authController.getLogout);

router.get("/create-account", authController.getSignUp);
router.post("/create-account", authController.postSignUp);

router.get("/account", userController.getAccount);

router.get("/account-change-info", userController.getAccountChange);
router.post("/account-change-info", userController.postAccountChange);

router.get("/verify-email", authController.getVerifyEmail);
router.post("/verify-email", authController.postVerifyEmail);

router.get("/forgot-password", authController.getForgotPass);
router.post("/forgot-password", authController.postForgotPass);

router.get("/reset-password", authController.getResetPass);
router.post("/reset-password", authController.postResetPass);

router.get("/change-password", authController.getChangePassword);
router.post("/change-password", authController.postChangePassword);

router.post("/change-email", authController.postChangeEmail);

module.exports = router;
