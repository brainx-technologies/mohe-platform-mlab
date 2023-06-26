// Accessing the third form-group element and its select element
const selectElementTeam = document.querySelector('form .form-group:nth-of-type(3) select');
if (selectElementTeam) {
    // Accessing the first option element and modifying its value
    const firstOption = selectElementTeam.querySelector('option');
    if (firstOption) {
        firstOption.textContent = 'Team (Limits Alerts to this Team)';
    }

    //remove the helping block of this div
    const helpBlockElement = selectElementTeam.nextElementSibling;
    if (helpBlockElement && helpBlockElement.classList.contains('help-block')) {
        helpBlockElement.remove();
    }
}

// Accessing the fourth form-group element and its select element
const selectElementParam = document.querySelector('form .form-group:nth-of-type(4) select');
if (selectElementParam) {
    // Accessing the first option element and modifying its value
    const firstOption = selectElementParam.querySelector('option');
    if (firstOption) {
        firstOption.textContent = 'Parameter';
    }
}


// Accessing the fifth form-group element and its select element
const selectElementInterval = document.querySelector('form .form-group:nth-of-type(5) select');
if (selectElementInterval) {
    // Accessing the first option element and modifying its value
    const firstOption = selectElementInterval.querySelector('option');
    if (firstOption) {
        firstOption.textContent = 'Interval (Time interval to calculate trigger rate)';
    }

    //remove the helping block of this div
    const helpBlockElement = selectElementInterval.nextElementSibling;
    if (helpBlockElement && helpBlockElement.classList.contains('help-block')) {
        helpBlockElement.remove();
    }
}

// Accessing the sixth form-group element and its input element
const selectElementTrigger = document.querySelector('form .form-group:nth-of-type(6) input');
if (selectElementTrigger) {
    //remove the helping block of this div
    const helpBlockElement = selectElementTrigger.nextElementSibling;
    if (helpBlockElement && helpBlockElement.classList.contains('help-block')) {
        helpBlockElement.remove();
    }
}

// Accessing the seventh form-group element and its input element
const selectElementCheckBox = document.querySelector('form .form-group:nth-of-type(7)');

if (selectElementCheckBox) {
    const checkboxElement = selectElementCheckBox.querySelector('.checkbox');
    //remove the helping block of this div
    const helpBlockElement = checkboxElement.nextElementSibling;
    if (helpBlockElement && helpBlockElement.classList.contains('help-block')) {
        helpBlockElement.remove();
    }
}