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

export const validColor = (color) => {
  if(typeof color !== 'string') return false;

  color = color.trim();
  const colorRegex = /^#[a-fA-F0-9]{6}$/g;

  if(!colorRegex.test(color)) return false;

  return true;
}

export const validAge = (age) => {
  age = parseInt(age);

  if(isNaN(age)) return false;

  if(age < 12 || age > 100) return false;

  return true;
}