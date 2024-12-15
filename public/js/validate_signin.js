const signinForm = document.getElementById('signinForm');
let errorMsg = document.getElementById('error-message');

const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
    return regex.test(password);
};

if(signinForm) {
  signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if(!username || username.length < 5 || username.length > 10) {
      errorMsg.innerHTML = 'User ID must be between 5 and 10 characters.\n';
    }

    if(!validatePassword(password)) {
      errorMsg.innerHTML = 'Password must have at least one uppercase letter, one number, and one special character.\n';
    }

    signinForm.submit();
  });
}