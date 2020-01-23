let newPasswordValue;
let confirmationValue;
const profileEditForm = document.getElementById('update-profile');
const newPassword = document.getElementById('new-password');
const confirmPassword = document.getElementById('password-confirmation');
const validationMessage = document.getElementById('validation-message');

function validatePasswords(message, add, remove) {
    validationMessage.classList.remove('d-none');
    validationMessage.textContent = message;
    validationMessage.classList.add(add);
    validationMessage.classList.remove(remove);
}

// input listener to two new password fields
confirmPassword.addEventListener('input', e => {
    newPasswordValue = newPassword.value;
    confirmationValue = confirmPassword.value;
    if(!newPasswordValue && !confirmationValue) {
        validationMessage.classList.add('d-none');
    }
    else if(newPasswordValue !== confirmationValue) {
        validatePasswords('New passwords must match!','alert-danger','alert-success');
    }
    else {
        validatePasswords('New passwords match!','alert-success','alert-danger');
    }
});

profileEditForm.addEventListener('submit', e => {
    if(newPasswordValue !== confirmationValue) {
        e.preventDefault();
        const error = document.getElementById('error');
        if(!error) {
            const flashError = document.createElement('div');
            flashError.classList.add('alert');
            flashError.classList.add('alert-danger');
            flashError.setAttribute('id','error');
            flashError.textContent='New passwords must match!';
            const fullProfile = document.getElementById('full-profile');
            fullProfile.parentNode.insertBefore(flashError,fullProfile.nextSibling);
        }
    }
})

