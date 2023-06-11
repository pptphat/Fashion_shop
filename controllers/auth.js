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
const crypto = require("crypto");

const app = express();
var bodyParser = require("body-parser");

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

exports.getLogin = async (req, res, next) => {
    const user = await Users.find();
    // console.log(user);
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
        return res.redirect("/");
    }
};

exports.postLogin = async (req, res, next) => {
    passport.authenticate("local-signin", {
        successReturnToOrRedirect: "/merge-cart",
        failureRedirect: "/login",
        failureFlash: true,
    })(req, res, next);
};

exports.getLogout = (req, res, next) => {
    // console.log(req.session);
    if (req.session.cart) {
        req.session.cart = null;
    }
    res.cookie('accessToken', '', { maxAge: 1 });
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
            html: `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <style>
                        @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
                    </style>
                </head>
                <body>
                    <div
                        style="
                            font-family: Helvetica, Arial, sans-serif;
                            min-width: 1000px;
                            overflow: auto;
                            line-height: 2;
                            font-size: 20px;
                        "
                    >
                        <div style="margin: 50px auto; width: 70%; padding: 20px 0">
                            <div style="border-bottom: 1px solid #eee; text-align: center">
                                <a
                                    href=""
                                    style="
                                        font-size: 1.4em;
                                        color: #2879fe;
                                        text-decoration: none;
                                        font-weight: 600;
                                    "
                                    >EzFashion</a
                                >
                            </div>
                            <h3>Hi,</h3>
                            <p>
                                Thank you for choosing EzFashion. Use the following OTP to
                                complete your Sign Up procedures. OTP is valid for 5 minutes
                            </p>
            
                            <h2
                                style="
                                    display: block;
                                    background: #22bc66;
                                    margin: 0 auto;
                                    width: max-content;
                                    padding: 0 10px;
                                    color: #fff;
                                    border-radius: 4px;
                                    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                                "
                            >
                                ${user.verify_token}
                            </h2>
            
                            <p style="font-size: 0.9em">Regards,<br />EzFashion</p>
                            <hr style="border: none; border-top: 1px solid #eee" />
                        </div>
                    </div>
                </body>
            </html>
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

exports.postForgotPass = async (req, res, next) => {
    const { email } = req.body;
    const user = await Users.findOne({ email });

    if (!user) {
        req.flash("error", "Email không hợp lệ");
        return res.redirect("/forgot-password");
    } else if (user.passwordResetExpires) {
        req.flash("error", "Vui lòng kiểm tra Email");
        return res.redirect("/forgot-password");
    }

    const resetToken = user.createPasswordResetToken();
    await user.save();

    const resetURL = `${req.protocol}://${req.get(
        "host"
    )}/reset-password?email=${email}&token=${resetToken}`;

    try {
        await sendMail({
            email: email,
            subject: "Reset Your Password",
            text: "text",
            html: `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <style>
                        @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
                    </style>
                </head>
                <body>
                    <div
                        style="
                            font-family: Helvetica, Arial, sans-serif;
                            min-width: 1000px;
                            overflow: auto;
                            line-height: 2;
                            font-size: 20px;
                        "
                    >
                        <div style="margin: 50px auto; width: 70%; padding: 20px 0">
                            <div style="border-bottom: 1px solid #eee; text-align: center">
                                <a
                                    href=""
                                    style="
                                        font-size: 1.4em;
                                        color: #2879fe;
                                        text-decoration: none;
                                        font-weight: 600;
                                    "
                                    >EzFashion</a
                                >
                            </div>
                            <h3>Hi,</h3>
                            <p>
                                You recently requested to reset your password for your
                                account. Use the button below to reset it.
                                <strong
                                    >This password reset is only valid for the next 10
                                    minutes.</strong
                                >
                            </p>
                            <a
                                href="${resetURL}"
                                style="
                                    background: #22bc66;
                                    margin: 0 auto;
                                    width: max-content;
                                    padding: 0 10px;
                                    color: #fff;
                                    border-radius: 4px;
                                    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                                    display: block;
                                    text-decoration: none;
                                "
                                target="_blank"
                            >
                                Reset your password
                            </a>
                            <p style="font-size: 0.9em">Regards,<br />EzFashion</p>
                            <hr style="border: none; border-top: 1px solid #eee" />
                            <table class="body-sub" role="presentation">
                                <tr>
                                    <td>
                                        <p style="font-size: 13px; color: #6b6e76">
                                            If you’re having trouble with the button above,
                                            copy and paste the URL below into your web
                                            browser.
                                        </p>
                                        <p style="font-size: 13px; color: #6b6e76">
                                            ${resetURL}
                                        </p
                                        >
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </body>
            </html>
            `,
        });

        return res.redirect("/forgot-password");
    } catch (error) {
        return res.redirect("/error");
    }
};
exports.getResetPass = async (req, res, next) => {
    try {
        let cartProduct;
        const { email, token } = req.query;

        if (!email || !token) return res.redirect("/forgot-password");

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await Users.findOne({
            email: email,
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            req.flash("error", "Token không hợp lệ hoặc đã hết hạn");
            return res.redirect("/forgot-password");
        }

        if (!req.session.cart) {
            cartProduct = null;
        } else {
            var cart = new Cart(req.session.cart);
            cartProduct = cart.generateArray();
        }

        const message = req.flash("error")[0];
        return res.render("reset-password", {
            title: "Đổi mật khẩu",
            message: `${message}`,
            email: email,
            token: token,
            user: req.user,
            cartProduct: cartProduct,
        });
    } catch (error) {
        return res.redirect("/error");
    }
};
exports.postResetPass = async (req, res, next) => {
    try {
        const { email, token, newpass, newpass2 } = req.body;

        if (!newpass || !newpass2) {
            req.flash("error", "Vui lòng điền đầy đủ thông tin!");
            return res.redirect(
                `/reset-password?email=${email}&token=${token}`
            );
        } else if (newpass !== newpass2 || newpass.length < 6) {
            req.flash("error", "Mật khẩu không khớp!");
            return res.redirect(
                `/reset-password?email=${email}&token=${token}`
            );
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await Users.findOne({
            email: email,
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            req.flash("error", "Token không hợp lệ hoặc đã hết hạn");
            return res.redirect("/forgot-password");
        }
        const hashedPass = await bcrypt.hash(newpass, 12);

        user.password = hashedPass;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.isAuthenticated = true;
        await user.save();
        console.log(user);
        if (!req.session.cart) {
            cartProduct = null;
        } else {
            var cart = new Cart(req.session.cart);
            cartProduct = cart.generateArray();
        }

        return res.redirect("/login");
    } catch (error) {
        return res.redirect("/error");
    }
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
        } else if (req.body.newpass !== req.body.newpass2) {
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

exports.postChangeEmail = async (req, res, next) => {
    try {
        // Verify the existence of email.
        const findUser = await Users.findOne({ email: req.body.email });
        if (findUser) {
            req.flash("error", "Email đã tồn tại!");
            return res.redirect("back");
        }
        req.user.isAuthenticated = false;
        req.user.email = req.body.email;
        req.user.save();
        return res.redirect("/verify-email");
    } catch (error) {
        res.redirect("/error");
    }
};

exports.jwtAuthen = async (req, res, next) => {
    passport.authenticate("jwt", { session: false })(req, res, next);
}

exports.jwtSign = (req, res, next) => {
    const body = { _id: req.user._id, username: req.user.username };
    const token = jwt.sign({ user: body }, process.env.JWT_SECRET_KEY);
    
    res.cookie("accessToken", token, {
        maxAge: 60 * 60 * 1000, // 1 hour
        httpOnly: true,
        secure: true, // lý do không set được cookie trên burp suite
        sameSite: "strict",
    });
    return next();
};