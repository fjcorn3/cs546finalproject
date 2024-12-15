const signupForm = document.getElementById('signupForm');
let errorMsg = document.getElementById('error-message');

const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
    return regex.test(password);
};

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const email = document.getElementById('email').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const age = document.getElementById('age').value.trim();

    if (!firstName || firstName.length < 2 || firstName.length > 25) {
        errorMsg.innerHTML = 'First name must be between 2 and 25 characters.\n';
    }

    if (!lastName || lastName.length < 2 || lastName.length > 25) {
        errorMsg.innerHTML = 'Last name must be between 2 and 25 characters.\n';
    }

    if (!username || username.length < 5 || username.length > 10) {
        errorMsg.innerHTML = 'Username must be between 5 and 10 characters.\n';
    }

    if (!validatePassword(password)) {
        errorMsg.innerHTML = 'Password must have at least one uppercase letter, one number, and one special character.\n';
    }

    if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
        errorMsg.innerHTML = 'Email must be a valid email address.\n';
    }

    if (!/^[0-9]{10}$/.test(phoneNumber)) {
        errorMsg.innerHTML = 'Phone number must be a valid 10-digit number.\n';
    }

    if (typeof Number(age) !== 'number' || Number(age) < 18) {
        errorMsg.innerHTML = 'Age must be a number and at least 18 years old.\n';
    }

    signupForm.submit();
  });
}