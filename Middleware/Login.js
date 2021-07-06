const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function(req, res, next) {
    let {Email, Password} = req.body;
    let errorMessage;

    // convert any empty fields into empty strings for validation
    Email = Email.isEmpty ? "" : Email;
    Password = Password.isEmpty ? "" : Password;

    // Email Field Validation
    if (validator.isEmpty(Email)) {
        errorMessage = "Email Field Cannot Be Empty";
    } else if (!validator.isEmail(Email)) {
        errorMessage = "Please Enter A Valid Email";
    }

    // Password Field Validation
    if (validator.isEmpty(Password)) {
        errorMessage = "Please Enter A Password";
    }

    if (errorMessage) {
        res.status(400).json({"error": errorMessage});
    } else {
        next();
    }
}