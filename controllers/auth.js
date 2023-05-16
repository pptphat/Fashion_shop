/**
 * Setting gmail for passport: https://www.youtube.com/watch?v=xvX4gWRWIVY
 */

const passport = require("passport");
const Cart = require("../models/cart");
const nodemailer = require("nodemailer");
const Users = require("../models/user");
var bcrypt = require("bcryptjs");
var randomstring = require("randomstring");
const express = require("express");
const jwt = require("jsonwebtoken");
const verifyTorken = require("../middleware/auth");
const tokenHandler = require("../config/auth");
const sendMail = require("../util/email");

const app = express();
var bodyParser = require("body-parser");

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

exports.getLogin = async (req, res, next) => {
    //await Users.deleteOne({ username: "nhutquang10062002@gmail.com" });
    var cartProduct;

    if (!req.session.cart) {
        cartProduct = null;
    } else {
        var cart = new Cart(req.session.cart);
        cartProduct = cart.generateArray();
    }
    const message = req.flash("error")[0];
    if (!req.isAuthenticated()) {
        res.render("login", {
            title: "Đăng nhập",
            message: `${message}`,
            user: req.user,
            cartProduct: cartProduct,
        });
    } else {
        res.redirect("/");
    }
};

exports.postLogin = async (req, res, next) => {
    // // Create <JWT></JWT>
    // const tokens = generateTokens(user)
    // updateRefreshToken(username, tokens.refreshToken)

    // console.log(users)

    // console.log(tokens)

    // // res.json(tokens)
    
    passport.authenticate("local-signin", {
        successReturnToOrRedirect: "/merge-cart",
        failureRedirect: "/login",
        failureFlash: true,
    })(req, res, next);
};

exports.getLogout = (req, res, next) => {
    console.log(req.session)
    if (req.session.cart) {
        req.session.cart = null;
    }
    req.logout();
    res.redirect("/");
};

exports.getSignUp = (req, res, next) => {
    const message = req.flash("error")[0];
    var cartProduct;
    if (!req.session.cart) {
        cartProduct = null;
    } else {
        var cart = new Cart(req.session.cart);
        cartProduct = cart.generateArray();
    }
    if (!req.isAuthenticated()) {
        res.render("create-account", {
            title: "Đăng ký",
            message: `${message}`,
            user: req.user,
            cartProduct: cartProduct,
        });
    } else {
        res.redirect("/");
    }
};

exports.postSignUp = (req, res, next) => {
    passport.authenticate("local-signup", {
        successReturnToOrRedirect: "/verify-email",
        failureRedirect: "/create-account",
        failureFlash: true,
    })(req, res, next);
};

exports.getVerifyEmail = async (req, res, next) => {
    const user = await Users.findOne({ username: req.user.username });

    if (!user.verify_token) {
        user.createEmailToken();

        await sendMail({
            email: req.user.email,
            subject: "Verify Your Email Address",
            text: "text",
            html: `<div
            style="
                font-family: Helvetica, Arial, sans-serif;
                min-width: 1000px;
                overflow: auto;
                line-height: 2;
                font-size: 20px;
            "
        >
            <div style="margin: 50px auto; width: 70%; padding: 20px 0">
                <div style="border-bottom: 1px solid #eee">
                    <a
                        href=""
                        style="
                            font-size: 1.4em;
                            color: #00466a;
                            text-decoration: none;
                            font-weight: 600;
                        "
                        >Bros</a
                    >
                </div>
                <p style="font-size: 1.1em">Hi,</p>
                <p>
                    Thank you for choosing Bros. Use the following OTP to complete your
                    Sign Up procedures. OTP is valid for 5 minutes
                </p>
                <h2
                    style="
                        background: #00466a;
                        margin: 0 auto;
                        width: max-content;
                        padding: 0 10px;
                        color: #fff;
                        border-radius: 4px;
                    "
                >
                    ${user.verify_token}
                </h2>
                <p style="font-size: 0.9em">Regards,<br />Bros</p>
                <hr style="border: none; border-top: 1px solid #eee" />
            </div>
        </div>
        `,
        });
        await user.save();
    }
    const message = req.flash("error")[0];
    var cartProduct;
    if (!req.session.cart) {
        cartProduct = null;
    } else {
        var cart = new Cart(req.session.cart);
        cartProduct = cart.generateArray();
    }
    res.render("verify-email", {
        title: "Xác thực email",
        message: `${message}`,
        user: req.user,
        cartProduct: cartProduct,
    });
};

exports.postVerifyEmail = async (req, res, next) => {
    const token = req.body.token;
    const user = await Users.findOne({
        username: req.user.username,
        verify_token: token,
    });

    if (!user) {
        req.flash("error", "Mã xác thực không hợp lệ");
        return res.redirect("/verify-email");
    }

    if (user.tokenExpires < Date.now()) {
        await Users.updateOne(
            { username: req.user.username },
            { verify_token: undefined, tokenExpires: undefined },
            {
                new: true,
            }
        );
        req.flash("error", "Mã xác thực đã hết hạn");
        return res.redirect("/verify-email");
    }

    user.verify_token = undefined;
    user.tokenExpires = undefined;
    user.isAuthenticated = true;
    await user.save();

    return res.redirect("/login");
};

exports.getForgotPass = (req, res, next) => {
    const message = req.flash("error")[0];
    var cartProduct;
    if (!req.session.cart) {
        cartProduct = null;
    } else {
        var cart = new Cart(req.session.cart);
        cartProduct = cart.generateArray();
    }
    res.render("forgot-password", {
        title: "Quên mật khẩu",
        message: `${message}`,
        user: req.user,
        cartProduct: cartProduct,
    });
};

exports.postForgotPass = (req, res, next) => {
    const email = req.body.email;
    Users.findOne({ email: email }, (err, user) => {
        if (!user) {
            req.flash("error", "Email không hợp lệ");
            return res.redirect("/forgot-password");
        } else {
            console.log(user);
            var transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.ENV_USERNAME,
                    pass: process.env.ENV_PASSWORD,
                },
            });
            var tpass = randomstring.generate({
                length: 6,
            });
            var mainOptions = {
                from: "Crepp so gud",
                to: email,
                subject: "Test",
                text: "text ne",
                html: "<p>Mật khẩu mới của bạn là:</p>" + tpass,
            };
            transporter.sendMail(mainOptions, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Sent:" + info.response);
                }
            });
            bcrypt.hash(tpass, 12).then((hashPassword) => {
                user.password = hashPassword;
                user.save();
            });

            res.redirect("/login");
        }
    });
};

exports.getChangePassword = (req, res, next) => {
    const message = req.flash("error")[0];
    var cartProduct;

    if (!req.session.cart) {
        cartProduct = null;
    } else {
        var cart = new Cart(req.session.cart);
        cartProduct = cart.generateArray();
    }
    res.render("change-password", {
        title: "Đổi mật khẩu",
        message: `${message}`,
        user: req.user,
        cartProduct: cartProduct,
    });
};

exports.postChangePassword = (req, res, next) => {
    bcrypt.compare(req.body.oldpass, req.user.password, function (err, result) {
        console.log("alo?");
        if (!result) {
            req.flash("error", "Mật khẩu cũ không đúng!");
            return res.redirect("back");
        } else if (req.body.newpass != req.body.newpass2) {
            console.log(req.body.newpass);
            console.log(req.body.newpass2);
            req.flash("error", "Nhập lại mật khẩu không khớp!");
            return res.redirect("back");
        } else {
            bcrypt.hash(req.body.newpass, 12).then((hashPassword) => {
                req.user.password = hashPassword;
                req.user.save();
            });
            req.flash("success", "Đổi mật khẩu thành công!");
            res.redirect("/account");
        }
    });
};
