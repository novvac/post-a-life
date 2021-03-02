// validator for sign up data (register page)
const Validator = require("validator");

function validateSignUpData(data) {
    let errors = {};

    const firstName = data.firstName? data.firstName : "";
    const lastName = data.lastName ? data.lastName : "";
    const email = data.email ? data.email : "";
    const password = data.password ? data.password : "";
    const rePassword = data.rePassword ? data.rePassword : "";

    if(Validator.isEmpty(firstName, {ignore_whitespace: true}))
        errors.firstName = "Uzupełnij to pole!";
    
    if(Validator.isEmpty(lastName, {ignore_whitespace: true}))
        errors.lastName = "Uzupełnij to pole!";

    if(Validator.isEmpty(email, {ignore_whitespace: true}))
        errors.email = "Uzupełnij to pole!";
    else if(!Validator.isEmail(email))
        errors.email = "Wpisz poprawny email!";

    if(Validator.isEmpty(password, {ignore_whitespace: true}))
        errors.password = "Uzupełnij to pole!";
    else if(!Validator.isLength(password, {min: 6, max: 32}))
        errors.password = "Hasło musi mieć 6-32 znaków!";
    
    if(Validator.isEmpty(rePassword, {ignore_whitespace: true}))
        errors.rePassword = "Uzupełnij to pole!";
    else if(!Validator.equals(password, rePassword))
        errors.rePassword = "Hasła się nie zgadzają!";

    return {
        errors,
        isCorrect: Object.keys(errors).length === 0 ? true : false
    }
}

module.exports = validateSignUpData;