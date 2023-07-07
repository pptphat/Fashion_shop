const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.jwtRequireAuth = async (req, res, next) => {
    passport.authenticate("jwt", { session: false }, function (err, user, info) {
        console.log("err.message: ",err?.message);
        console.log("info.message: ",info?.message);
        console.log("jwtRequireAuth user: ",user);
        if (err) {
            throw err;
        }
        else if (info) {
            console.log(info.message);
            res.redirect('/logout');
        } else {
            next();
        }
    })(req, res, next);
};