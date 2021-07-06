const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function(req, res, next) {
    let {FullName, UserName, Email, Password} = req.body;
    let errorMessage;

    // convert any empty fields into empty strings for validation
    FullName = FullName.isEmpty ? "" : FullName;
    UserName = UserName.isEmpty ? "" : UserName;
    Email = Email.isEmpty ? "" : Email;
    Password = Password.isEmpty ? "" : Password;

    // Email Field Validation
    if (validator.isEmpty(Email)) {
        errorMessage = "Email Field Cannot Be Empty";
    } else if (!validator.isEmail(Email)) {
        errorMessage = "Please Enter A Valid Email";
    }

    if (validator.isEmpty(FullName)) {
        errorMessage = "Please Enter Your Name";
    }

    if (validator.isEmpty(UserName)) {
        errorMessage = "Please Enter a UserName";
    } else if (/\s/.test(UserName)) {
        errorMessage = "UserName Cannot Contain Spaces";
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