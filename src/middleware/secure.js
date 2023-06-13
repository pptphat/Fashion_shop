var bodyParser = require("body-parser");
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');

// create application/x-www-form-urlencoded parser
exports.urlencodedParser = bodyParser.urlencoded({ extended: false });

// Prevent CSRF
exports.csrfProtection = csrf({ cookie: false });

// Prevent DDOS
exports.apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    max: 5,
    message: 'Too many connection',
});