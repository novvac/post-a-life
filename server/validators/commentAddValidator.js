// validator for sign up data (register page)
const Validator = require("validator");

function validateCommentData(data) {
    let errors = {};

    const comment = data.comment ? data.comment : "";

    if(Validator.isEmpty(comment))
        errors.comment = "Uzupełnij to pole!";
    else if(!Validator.isLength(comment, {min: 1, max: 256})) 
        errors.comment = "Komentarz może mieć maksymalnie 256 znaków!";

    return {
        errors,
        isCorrect: Object.keys(errors).length === 0 ? true : false
    }
}

module.exports = validateCommentData;