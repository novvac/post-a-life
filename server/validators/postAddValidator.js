// validator for sign up data (register page)
const Validator = require("validator");

function validatePostData(data) {
    let errors = {};

    const mind = data.mind ? data.mind : "";

    if(Validator.isEmpty(mind))
        errors.mind = "Uzupełnij to pole!";
    else if(!Validator.isLength(mind, {min: 2, max: 2048}))  // TODO: min: 16
        errors.mind = "To pole musi zawierać od 12 do 2048 znaków!";

    return {
        errors,
        isCorrect: Object.keys(errors).length === 0 ? true : false
    }
}

module.exports = validatePostData;