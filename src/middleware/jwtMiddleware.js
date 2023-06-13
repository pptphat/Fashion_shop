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
            console.log("weblade");
            next();
        }
    })(req, res, next);
}

exports.jwtSign = (req, res, next) => {
    // console.log("jwt sign: ", req.route);
    // console.log("jwt sign: ", req.user);
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