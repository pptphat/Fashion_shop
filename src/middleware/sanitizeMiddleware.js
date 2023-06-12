const sanitizeMiddleware = (req, res, next) => {
    const lengthQuery = Object.keys(req.query).length;
    const lengthBody = Object.keys(req.body).length;
    
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
        for (let key in data) {
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
