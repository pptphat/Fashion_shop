const mongoose = require("mongoose");
const randomstring = require("randomstring");
const crypto = require("crypto");

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    role: {
        type: Number,
        required: false,
        default: 0,
    },
    isAuthenticated: {
        type: Boolean,
        required: false,
        default: false,
    },
    isLock: {
        type: Boolean,
        required: false,
        default: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    verify_token: String,
    tokenExpires: Date,
    refresh_token: {
        type: String,
        required: false,
    },
    cart: {
        type: Object,
        required: false,
    },
    loginAttempts: { 
        type: Number, 
        required: true, 
        default: 0 
    },
    lockUntil: { 
        type: Number, 
        default: null
    }
});
userSchema.methods.createEmailToken = function () {
    this.verify_token = randomstring.generate({
        length: 10,
    });
    this.tokenExpires = Date.now() + 5 * 60 * 1000;
    return;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
