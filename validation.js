export const validName = (name) => {
  if(typeof name !== 'string') return false;
 
  name = name.trim();

  if(name.length < 2 || name.length > 25 || /\d/.test(name)) return false;
  
  return true;
};

export const validUsername = (userId) => {
  if(typeof userId!== 'string') return false;
 
  userId = userId.trim();

  if(userId.length < 5 || userId.length > 10 || /\d/.test(userId)) return false;
  
  return true;
}

export const validPassword = (password) => {
  if(typeof password !== 'string') return false;

  password = password.trim();

  //For regex, referenced: https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]+$/g;

  if(password.length < 8 || !passwordRegex.test(password)) return false;

  return true;
}

export const validAge = (age) => {
  age = parseInt(age);

  if(isNaN(age)) return false;

  if(age < 12 || age > 100) return false;

  return true;
}

export const ValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{4}$/; //yyyy-mm-dd

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

export const ValidTime = (timeString) => {
  const regex = /^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i; //HH:MM 24 hr time

  if (!regex.test(timeString)) {
      return false;
  }
  return true;
}

