const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');
let errorMsgUp = document.getElementById('errorUp');
let errorMsgIn = document.getElementById('errorIn');

const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
    return regex.test(password);
};
  
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
    const fullName = document.getElementById('fullName').value.trim();
    const age = document.getElementById('age').value.trim();
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
  
    if (!fullName || fullName.split(/\s+/).length < 2) {
        errorMsgUp.innerHTML = 'Please enter your full name (at least two words).';
    }

    if (!/^[a-zA-Z\s]+$/.test(fullName)) {
        errorMsgUp.innerHTML = 'Full name should only contain letters and spaces.';
    }
  
    if (!lastName || lastName.length < 2 || lastName.length > 25) {
        errorMsgUp.innerHTML = 'Last name must be between 2 and 25 characters.';
    }

    if (!age || isNaN(Number(age)) || Number(age) < 0) {
        errorMsgUp.innerHTML = 'Age must be a number greater than 0.';
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        errorMsgUp.innerHTML = 'Please enter a valid email address.';
    }

    if (!/^(?:\(\d{3}\)\s?|\d{3}[-.\s]?)\d{3}[-.\s]?\d{4}$/.test(phone)) {
        errorMsgUp.innerHTML = 'Please enter a valid phone number.';
    }
  
    if (!username || username.length < 5 || username.length > 10) {
        errorMsgUp.innerHTML = 'User ID must be between 5 and 10 characters.';
    }
  
    if (!validatePassword(password)) {
        errorMsgUp.innerHTML = 'Password must have at least one uppercase letter, one number, and one special character.\n';
    }
    });
}
  
if (signinForm) {
    signinForm.addEventListener('submit', (e) => {
    const userId = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
  
    if (!userId || userId.length < 5 || userId.length > 10) {
        errorMsgIn.innerHTML = 'User ID must be between 5 and 10 characters.\n';
    }
  
    if (!validatePassword(password)) {
        errorMsgIn.innerHTML = 'Password must have at least one uppercase letter, one number, and one special character.\n';
    }
    });
}
  
const rsvpForm = document.getElementById('rsvpForm');
const errorRsvp = document.getElementById('errorRsvp');
if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
  
    if (!fullName || fullName.split(/\s+/).length < 2) {
        errorMsgUp.innerHTML = 'Please enter your full name (at least two words).';
    }

    if (!/^[a-zA-Z\s]+$/.test(fullName)) {
        errorMsgUp.innerHTML = 'Full name should only contain letters and spaces.';
    }
  
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        errorMsgUp.innerHTML = 'Please enter a valid email address.';
    }
    });
}

const createPostForm = document.getElementById('createPostForm');
const errorPost = document.getElementById('errorPost');
if (createPostForm) {
    createPostForm.addEventListener('submit', (e) => {

    })
}

const createPostAttendeeForm = document.getElementById('createPostAttendeeForm');
const errorPostAttendee = document.getElementById('errorPostAttendee');
if (createPostAttendeeForm) {
    createPostAttendeeForm.addEventListener('submit', (e) => {
        
    })
}
