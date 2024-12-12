const signupForm = document.getElementById('signupForm');
const signinForm = document.getElementById('signinForm');
let errorMsg = document.getElementById('error-message');
let postForm = document.getElementById('createEventForm');
let postFormAttendee = document.getElementById('createAttendeePostForm');
  
const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
    return regex.test(password);
};
  
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
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
  
    });
}
  
if (signinForm) {
    signinForm.addEventListener('submit', (e) => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
  
    if (!username || username.length < 5 || username.length > 10) {
        errorMsg.innerHTML = 'User ID must be between 5 and 10 characters.\n';
    }
  
    if (!validatePassword(password)) {
        errorMsg.innerHTML = 'Password must have at least one uppercase letter, one number, and one special character.\n';
    }
    });
}

    const eventsList = document.getElementById('eventsList');
    if (eventsList) {
      fetch('/events')
        .then((response) => {
          if (!response.ok) throw new Error('Failed to fetch events.');
          return response.json();
        })
        .then((events) => {
          events.forEach((event) => {
            const eventDiv = document.createElement('div');
            eventDiv.classList.add('event');
  
            eventDiv.innerHTML = `
              <h3>${event.description}</h3>
              <p>Location: ${event.location || 'N/A'}</p>
              <p>Date: ${event.date || 'N/A'} Time: ${event.time || 'N/A'}</p>
              <p>Head Count: ${event.headCount || 'N/A'}</p>
              <button onclick="handleRSVP('${event._id}')">RSVP</button>
            `;
  
            eventsList.appendChild(eventDiv);
          });
        })
        .catch((error) => {
          console.error(error.message);
          eventsList.innerHTML = '<p>Failed to load events. Please try again later.</p>';
        });
    }

    if(createEventForm){
        createEventForm.addEventListener('submit', (e) => {
            const description = document.getElementById('description').value.trim();
            const photo = document.getElementById('photo').value.trim();
            const headCount = document.getElementById('headCount').value.trim();
            const time = document.getElementById('time').value.trim();
            const date = document.getElementById('date').value.trim();
            const location = document.getElementById('location').value.trim();
            const rsvpForm = document.getElementById('rsvpForm').value.trim();

            try{
                if (!description && !photo) throw new Error('Post must include a description or photo');

                
                if(photo){
                  if(typeof photo !== 'string') throw "improper photo";
                  photo = photo.trim();
                  if(!(/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(photo))) throw "improper image";
                }
                
                if(description){
                  if(typeof description !== 'string') throw "improper description";
                  description = description.trim();
                  if(description.length < 1) throw "empty string for description";  
                }
              
                if(headCount){
                  if(typeof headCount !== "string") throw "improper head count";
                  headCount = headCount.trim();
                  if(!(/^\d+$/.test(headCount))) throw "improper head count";
                }
              
                if(time){
                  if(typeof time !== 'string') throw "imporper time";
                  time = time.trim();
                  if(!(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(time))) throw "improper time";
                }
              
                if(date){
                  if(typeof date !== "string") throw "improper date";
                  date = date.trim();
                  if(!(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(date))) throw "improper date";
                  
                  //makes sure that the date is not in the past
                  let dateParts = date.split("/");
                  let dateNow = new Date(dateParts[2], (dateParts[0] - 1), dateParts[1]);
                  let dateComp = new Date();
                  if (dateNow < dateComp) {
                      throw "improper date";
                  }
                }
              
                if(location){
                  if(typeof location !== 'string') throw "improper location";
                  location = location.trim();
                  if(location.length < 1) throw "empty string for location";

                }
              
                if(rsvpForm){
                  if(typeof rsvpForm !== 'string') throw "improper rsvp selection";
              
                  rsvpForm = rsvpForm.trim();
                  if(rsvpForm !== "Yes" && rsvpForm !== "No") throw "improper rsvp form selection";
                }
                
                
  

            }catch(e){
                //do somthing
            }
        });

    }

    if(createAttendeePostForm){
        createAttendeePostForm.addEventListener('submit', (e) => {
            const description = document.getElementById('description').value.trim();
            const photo = document.getElementById('photo').value.trim();
            try{
                if (!description && !photo) throw new Error('Post must include a description or photo');

  
                if(photo){
                    if(typeof photo !== 'string') throw "improper photo";
                    photo = photo.trim();
                    if(!(/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(photo))) throw "improper image";
                }
  
                if(description){
                    if(typeof description !== 'string') throw "improper description";
                    description = description.trim();
                    if(description.length < 1) throw "empty string for description";
                }
  

            }catch(e){
                //do somthing
            }
        });
    }
  