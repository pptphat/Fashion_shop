const jwt = require("jsonwebtoken");

const verifyTorken = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    // Nếu có auth header thì sẽ là phần tử thứ 2, nếu không thì trả về undefined
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token không hợp lệ" });
    }

    try {
        const decoded = await jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );
        // console.log(decoded)
        if (!decoded.id) return res.status(403);
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(403);
    }
};

module.exports = verifyTorken;
