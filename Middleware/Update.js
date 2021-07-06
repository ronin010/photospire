const validator = require("validator");
const isEmpty = require("isEmpty");

module.exports = function(req, res, next) {

    const {Email, FirstName, LastName} = req.body;

    Email = Email.isEmpty ? "" : Email;
    FirstName = FirstName.isEmpty ? "" : FirstName;
    LastName = LastName.isEmpty ? "" : LastName;

    if (validator.isEmpty(Email)) {
        errorMessage = "Email Field Cannot Be Empty";
    } else if (!validator.isEmail(Email)) {
        errorMessage = "Please Enter A Valid Email";
    }

    // FirstName and LastName Field Validation
    if (validator.isEmpty(FirstName)) {
        errorMessage = "FirstName Field Cannot Be Empty";
    } else if (validator.isEmpty(LastName)) {
        errorMessage = "LastName Field Cannot Be Empty";
    }
}