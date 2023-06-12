const Users = require("../models/user");
const Cart = require("../models/cart");
const Order = require("../models/order");

exports.getAccount = async (req, res, next) => {
  // console.log(req.session);
  // console.log(req.user);
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  const messageSucc = req.flash("success")[0];
  const messageError = req.flash("error")[0];
  Order.find({ user: req.user }).then(order => {
    res.render("account", {
      title: "Thông tin tài khoản",
      user: req.user,
      cartProduct: cartProduct,
      order: order,
      messageSucc: messageSucc,
      messageError:messageError
    });
  });
};

exports.getAccountChange = (req, res, next) => {
  var cartProduct;
  // console.log("req.session.cart: ", req.session.cart)
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  // console.log("cartProduct: ", cartProduct)
  res.render("account-change-info", {
    title: "Thay đổi thông tin tài khoản",
    user: req.user,
    cartProduct: cartProduct,
    csrfToken: req.csrfToken()
  });
};

exports.postAccountChange = (req, res, next) => {
  console.log(req.user);
  req.user.firstName = req.body.firstName;
  req.user.lastName = req.body.lastName;
  // req.user.email = req.body.email;
  req.user.address = req.body.address;
  req.user.phoneNumber = req.body.phoneNumber;
  req.user.save();
  res.redirect("/account");
};
