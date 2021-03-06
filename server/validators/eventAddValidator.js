// validator for event adding
const Validator = require("validator");

function validateEventData(data) {
    let errors = {};

    const title = data.title ? data.title : "";
    const description = data.description ? data.description : "";
    const date = data.date ? data.date : "";

    if(Validator.isEmpty(title, {ignore_whitespace: true}))
        errors.title = "Uzupełnij to pole!";
    else if(!Validator.isLength(title, {min: 6, max: 64}))
        errors.title = "Tutuł musi mieć od 6 do 64 znaków!";
    
    if(Validator.isEmpty(description, {ignore_whitespace: true}))
        errors.description = "Uzupełnij to pole!";
    else if(!Validator.isLength(description, {min: 1, max: 1024}))
        errors.description = "Opis może mieć maksymalnie 1024 znaków!";

    if(Validator.isEmpty(date, {ignore_whitespace: true}))
        errors.date = "Uzupełnij to pole!";
    else if(!Validator.isISO8601(date))
        errors.date = "Data jest niepoprawna!";

    return {
        errors,
        isCorrect: Object.keys(errors).length === 0 ? true : false
    }
}

module.exports = validateEventData;