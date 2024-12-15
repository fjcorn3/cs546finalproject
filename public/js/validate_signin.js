let signinForm = document.getElementById('signinForm');
let error = document.getElementById('error');
let errorMessage = document.getElementById('error-message');

if(signinForm) {
  let username = document.getElementById('username');
  let password = document.getElementById('password');

  signinForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if(!validUsername(username.value)) {
      errorMessage.innerHTML = "Invalid User Name!";
      error.hidden = false;
      return;
    }
  
    if(!validPassword(password.value)) {
      errorMessage.innerHTML = "Invalid Password!";
      error.hidden = false;
      return;
    }

    error.hidden = true;
    signinForm.submit();
  });
}

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