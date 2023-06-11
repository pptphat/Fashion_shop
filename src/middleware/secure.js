var bodyParser = require("body-parser");
const csrf = require('csurf');

// create application/x-www-form-urlencoded parser
exports.urlencodedParser = bodyParser.urlencoded({ extended: false });

exports.csrfProtection = csrf({ cookie: false });