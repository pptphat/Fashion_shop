const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/auth");
const userController = require("../controllers/user");
const sanitizeMiddleware = require("../middleware/sanitizeMiddleware");

router.get("/login", authController.getLogin);
router.post("/login", sanitizeMiddleware, authController.postLogin);

router.get("/logout", authController.getLogout);

router.get("/create-account", authController.getSignUp);
router.post("/create-account", sanitizeMiddleware, authController.postSignUp);

router.get("/account", userController.getAccount);

router.get("/account-change-info", userController.getAccountChange);
router.post(
    "/account-change-info",
    sanitizeMiddleware,
    userController.postAccountChange
);

router.get("/verify-email", sanitizeMiddleware, authController.getVerifyEmail);
router.post(
    "/verify-email",
    sanitizeMiddleware,
    authController.postVerifyEmail
);

router.get("/forgot-password", authController.getForgotPass);
router.post(
    "/forgot-password",
    sanitizeMiddleware,
    authController.postForgotPass
);

router.get("/reset-password", sanitizeMiddleware, authController.getResetPass);
router.post(
    "/reset-password",
    sanitizeMiddleware,
    authController.postResetPass
);

router.get("/change-password", authController.getChangePassword);
router.post(
    "/change-password",
    sanitizeMiddleware,
    authController.postChangePassword
);

router.post(
    "/change-email",
    sanitizeMiddleware,
    authController.postChangeEmail
);

module.exports = router;
