let signupForm = document.getElementById('signupForm');
let error = document.getElementById('error');
let errorMessage = document.getElementById('error-message');

if(signupForm) {
  let firstName = document.getElementById('firstName');
  let lastName = document.getElementById('lastName');
  let username = document.getElementById('username');
  let email = document.getElementById('email');
  let phoneNumber = document.getElementById('phoneNumber');
  let age = document.getElementById('age');
  let password = document.getElementById('password');
  let confirm = document.getElementById('confirmPassword');
  let role = document.getElementById('role');

  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if(!validName(firstName.value)) {
      errorMessage.innerHTML = "Invalid First Name";
      error.hidden = false;
      return;
    }

    if(!validName(lastName.value)) {
      errorMessage.innerHTML = "Invalid Last Name";
      error.hidden = false;
      return;
    }

    if(!validUsername(username.value)) {
      errorMessage.innerHTML = "Invalid User Name!";
      error.hidden = false;
      return;
    }

    if(!validAge(age.value)) {
      errorMessage.innerHTML = "Invalid Age!";
      error.hidden = false;
      return;
    }

    if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email.value)) {
      errorMessage.innerHTML = 'Email must be a valid email address!';
      error.hidden = false;
      return;
    }
  
    if (!/^[0-9]{10}$/.test(phoneNumber.value)) {
      errorMessage.innerHTML = 'Phone number must be a valid 10-digit number!';
      error.hidden = false;
      return;
    }

    if(!validPassword(password.value)) {
      errorMessage.innerHTML = "Invalid Password!";
      error.hidden = false;
      return;
    }

    if(password.value !== confirm.value) {
      errorMessage.innerHTML = "Passwords Do Not Match!";
      error.hidden = false;
      return;
    }

    if(role.value.trim() !== 'attendee' && role.value.trim() !== 'organizer') {
      errorMessage.innerHTML = "Invalid Role";
      error.hidden = false;
      return;
    }
   
    error.hidden = true;
    signupForm.submit();
  });
}

const validName = (name) => {
  if(typeof name !== 'string') return false;
 
  name = name.trim();

  if(name.length < 2 || name.length > 25 || /\d/.test(name)) return false;
  
  return true;
};

const validUsername = (userId) => {
  if(typeof userId!== 'string') return false;
 
  userId = userId.trim();

  if(userId.length < 5 || userId.length > 10 || /\d/.test(userId)) return false;
  
  return true;
}

const validPassword = (password) => {
  if(typeof password !== 'string') return false;

  password = password.trim();
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]+$/g;

  if(password.length < 8 || !passwordRegex.test(password)) return false;

  return true;
}

const validAge = (age) => {
  age = parseInt(age);

  if(isNaN(age)) return false;

  if(age < 12 || age > 100) return false;

  return true;
}