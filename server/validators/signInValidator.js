// validator for sign up data (register page)
const Validator = require("validator");

function validateSignInData(data) {
    let errors = {};

    const email = data.email ? data.email : "";
    const password = data.password ? data.password : "";

    if(Validator.isEmpty(email))
        errors.email = "Uzupełnij to pole!";
    else if(!Validator.isEmail(email))
        errors.email = "Wpisz poprawny email!";

    if(Validator.isEmpty(password))
        errors.password = "Uzupełnij to pole!";

    return {
        errors,
        isCorrect: Object.keys(errors).length === 0 ? true : false
    }
}

module.exports = validateSignInData;