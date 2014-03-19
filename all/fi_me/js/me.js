


// document ready event
$(document).ready(function () {

    // show more instructions
    $("div#intro a.more").click(function () {
        // hide link and show content
        $(this).hide().closest("div#intro").find("div.more").slideDown("normal");
    });

    // show less instructions
    $("div#intro a.less").click(function () {
        // show link and hide content
        $(this).closest("div.more").slideUp("normal");
        $(this).closest("div#intro").find("a.more").show();
    });

    // set focus on first input box
    $("input[type='text']").first().focus();

    // change event added to inputs on the form 
    $("input[type='text']").change(function () {

        // get element
        element = $(this);

        // check if valid
        inputValid = validateInput(element);

        // calculate and validate expenses if user changes amounts
        if (element.hasClass("amount")) {

            // total amount 
            validateTotalAmount();

            // final amount
            validateFinalAmount();

        }
    });


    // submit event on the form
    $("#form3903").submit(function () {

        // show validation message
        if (validateForm()) {
            displayFormMessage(true);
        } else {
            displayFormMessage(false);
        }

        // don´t post the form
        return false;
    });
});


// validate input
function validateInput(element) {

    // get elements
    errorElement = element.closest("p").find(".error");
    stepElement = element.closest(".step").find("h2");

    // set defaults
    errorElement.text("");
    stepElement.removeClass("green");

    // check if required
    if (element.hasClass("required") && isEmpty(element.val())) {
        errorElement.text("Required");
        return false;
    }

    // check for legal number
    if (element.hasClass("number") && !isEmpty(element.val()) && !isValidNumber(element.val())) {
        errorElement.text("Number not legal");
        return false;
    }

    // if is valid, make step green
    stepElement.addClass("green");

    return true;
}


// validate the form
function validateForm() {

    formValid = true;

    // validate all input fields
    $("input[type='text']").each(function () {
        element = $(this);

        if (!validateInput(element)) {
            formValid = false;
        }
    });

    // validate total amount
    if (!validateTotalAmount()) {
        formValid = false;
    }

    // validate final amount
    if (!validateFinalAmount()) {
        formValid = false;
    }

    return formValid;
}

// members for calculations
var _totalAmount = 0;
var _finalAmount = 0;

// calculate and validate total amount
function validateTotalAmount() {

    valid = false;

    // get elements 
    element = $("#step3 .totalAmount");
    stepElement = $("#step3 h2");

    //calculate total amount
    transExpensesAmount = $("input[name='transportationExpenses']").val() * 1;
    travelExpensesAmount = $("input[name='travelExpenses']").val() * 1;
    _totalAmount = transExpensesAmount + travelExpensesAmount;

    // is bigger than zero 
    if (_totalAmount > 0) {
        valid = true;

        element.text(_totalAmount);
        stepElement.addClass("green");

    } else {
        element.text(0);
        stepElement.removeClass("green");
    }

    return valid;
}

// calculate and validate final amount
function validateFinalAmount() {

    valid = false;

    // get elements 
    element = $("#step5 .finalAmount");
    finalStepsInputs = $("#step5 input");

    //calculate final amount
    employerExpensesAmount = $("input[name='employerExpenses']").val() * 1;
    _finalAmount = _totalAmount - employerExpensesAmount;

    // is bigger than zero 
    if (_finalAmount > 0) {
        valid = true;

        element.text(_finalAmount);

        finalStepsInputs.attr("disabled", false);

        $("#step5 h3.success").show();
        $("#step5 h3.error").hide();

    } else {
        element.text(0);

        finalStepsInputs.attr("disabled", true);

        $("#step5 h3.success").hide();
        $("#step5 h3.error").show();

    }

    return valid;
}

// shows form messages
function displayFormMessage(success) {

    // get element and set to default
    formMessageElement = $("#formMessage");
    formMessageElement.slideDown("slow").empty();

    // display message
    if (success) {
        formMessageElement.html("<h3 class='success'>Done!  Enjoy your day.</h3>");
        $("fieldset input").attr("disabled", true);
    } else {
        formMessageElement.html("<h3 class='error'>Please fix any problems on the form.</h3>");
    }
}

/*
* Helper functions
*/

// is value empty or null
function isEmpty(value) {
    if (value == "" || value == null) {
        return true;
    }
    return false;
}

// is number legal
function isValidNumber(value) {
    // is number and bigger then zero
    if (!isNaN(value) && (element.val() * 1) >= 0) {
        return true;
    }
    return false;
}
                