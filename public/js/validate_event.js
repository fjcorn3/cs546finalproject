let eventForm = document.getElementById('eventForm');
let error = document.getElementById('error');
let errorMessage = document.getElementById('error-message');

const allowedTags = [
  "music",
  "pop",
  "outdoors",
  "family",
  "picnic",
  "art",
  "culture",
  "walking tour",
  "food",
  "festival",
  "movies",
  "reading",
  "fair",
  "jazz",
  "luxury",
  "animals",
  "zoo",
  "gallery",
  "beach",
  "history",
  "nature",
  "plants",
  "fitness",
  "yoga",
  "relaxation",
  "science",
  "education",
  "street food",
  "market",
  "shopping",
  "local"
];


if(eventForm) {
  let name = document.getElementById('name');
  let date = document.getElementById('date');
  let address = document.getElementById('address');
  let time = document.getElementById('time');
  let description = document.getElementById('description');
  let familyFriendly = document.getElementById('familyFriendly');
  let price = document.getElementById('price');
  let tags = document.getElementById('tags');

  eventForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if(!validEventName(name.value)) {
      errorMessage.innerHTML = "Invalid Name";
      error.hidden = false;
      return;
    }

    if(!validDate(date.value)) {
      errorMessage.innerHTML = "Invalid Date";
      error.hidden = false;
      return;
    }

    if(!validTime(time.value)) {
      errorMessage.innerHTML = "Invalid Time!";
      error.hidden = false;
      return;
    }


    if (familyFriendly.value !== 'true' && familyFriendly.value !== 'false'){
      errorMessage.innerHTML = "Invalid Family Friendly Value!";
      error.hidden = false;
      return;
    }


    if (isNaN(parseInt(price.value)) || parseInt(price.value) < 0){
      errorMessage.innerHTML = "Invalid Price!";
      error.hidden = false;
      return;
    }

    if(description.value.trim().length === 0 || description.value.trim().length > 255) {
      errorMessage.innerHTML = "Invalid Description!";
      error.hidden = false;
      return;
    }

    if(address.value.trim().length === 0 || address.value.trim().length > 255) {
      errorMessage.innerHTML = "Invalid Address!";
      error.hidden = false;
      return;
    }

    const selected = Array.from(tags.selectedOptions).map(option => option.value);
    if(selected.some( option => !allowedTags.find(tag => tag === option))) {
      errorMessage.innerHTML = "Invalid Tag!";
      error.hidden = false;
      return;
    }
   
    error.hidden = true;
    eventForm.submit();
  });
}

const validEventName = (name) => {
  if(typeof name !== 'string') return false;
  name = name.trim();

  if(name.length < 2 || name.length > 50 || /\d/.test(name)) return false;
  
  return true;
};

const validDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/; //yyyy-mm-dd

  if (!regex.test(dateString)) {
      return false;
  }

  const [year, month, day] = dateString.split('-').map(Number);

  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return false;
  }
  return true;
}

const validTime = (timeString) => {
  const regex = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;

  if (!regex.test(timeString)) {
      return false;
  }
  return true;
}