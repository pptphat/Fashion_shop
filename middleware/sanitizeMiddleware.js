const sanitizeMiddleware = (req, res, next) => {
    const lengthQuery = req.query.length;
    const lengthBody = req.body.length;
    console.log()
    if (lengthQuery) {
        const keys = Object.keys(req.query);
        keys.forEach((key) => sanitize(req.query[key]));
    }
    if (lengthBody) {
        const keys = Object.keys(req.body);
        keys.forEach((key) => sanitize(req.body[key]));
    }

    next();
};

function sanitize(data) {
    if (data instanceof Object) {
        for (var key in data) {
            if (/^\$/.test(key)) {
                delete data[key];
            } else {
                sanitize(data[key]);
            }
        }
    }
    return data;
}
module.exports = sanitizeMiddleware;
