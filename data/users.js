import { users } from '../config/mongoCollections.js';
import * as validation from '../validation.js';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

const SALTROUNDS = 10;

export const createUser = async (firstName, lastName, username, email, role, phoneNumber, age, password) => {
  if (!validation.validName(firstName)) throw new Error("You must provide a valid first name.");
  if (!validation.validName(lastName)) throw new Error("You must provide a valid last name.");
  if (!validation.validUsername(username)) throw new Error("You must provide a valid username.");
  if (!validation.validPassword(password)) throw new Error("You must provide a valid password.");
  if (!validation.validAge(age)) throw new Error("You must provide a valid age.");
  if (!phoneNumber || !/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/.test(phoneNumber)) throw new Error("You must provide a valid phone number.");
  if (!email || !/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) throw new Error("You must provide an email.");
  if (typeof role !== 'string' || role.trim().toLowerCase() !== "attendee" && role.trim().toLowerCase() !== "organizer") throw new Error("Role must be either attendee or organizer.");
 

  firstName = firstName.trim()
  lastName = lastName.trim();
  username = username.trim().toLowerCase();
  password = password.trim();
  email = email.trim();
  role = role.trim().toLowerCase();
  const hashPassword = await bcrypt.hash(password, SALTROUNDS);

  const newUser = {
    firstName,
    lastName,
    username,
    email,
    role,
    phoneNumber,
    age,
    password: hashPassword,
    eventsPosted: [],
    eventsFavorited: [],
  };

  const userCollection = await users();
  const user = await userCollection.findOne({ username: username });

  if(user) {
    throw new Error("User Name Taken");
  }

  const insertInfo = await userCollection.insertOne(newUser);

  if(!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw new Error('Could not add user');
  }

  return {registrationCompleted: true};
};

export const getUser = async (username, password) => {
  if(!validation.validUsername(username)) throw Error('Invalid User Name');
  if(!validation.validPassword(password)) throw Error('Invalid Password');

  username = username.trim().toLowerCase();
  password = password.trim();

  const usersCollection = await users();
  let user = await usersCollection.findOne({username: username});

  if(!user) throw Error('Either the userId or password is invalid');

  const match = await bcrypt.compare(password, user.password);

  if(!match) throw Error('Either the userId or password is invalid');

  delete user.password;

  return user; 
};

export const getUserById = async (userId) => {
  //TODO: Validation
  if (!ObjectId.isValid(userId)){
    throw "Error: UserId must be provided!";
  }

  userId = new ObjectId(userId);

  const userCollection = await users();
  const user = await userCollection.findOne({_id: userId});

  if(!user) throw Error('User Not Found');

  return user;
}