import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { validUser, validUserFields } from '../validation.js';

import bcrypt from 'bcryptjs';

const saltRounds = 16;

let exportedMethods = {
  async getAllUsers() {
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    return userList;
  },

  async getUserById(id) {
    if(!id || !ObjectId.isValid(id)) throw Error('Invalid Object Id');
    id = ObjectId(id);

    const userCollection = await users();
    const user = await userCollection.findOne({_id: id});
    
    if(!user) throw Error('User Not Found');
    return user;
  },

  async addUser(user) {
    if(!validUser(user)) throw Error('Invalid User');

    user.password = await bcrypt.hash(user.password, 10);
    user.eventsAttended = [];
    user.eventsFavorited = [];
    user.comments = [];

    const userCollection = await users();
    const insertionInfo = await userCollection.insertOne(user);

    if(!insertionInfo.acknowledged) throw Error('Insertion Failed');
  
    const newUser = await userCollection.findOne({_id: insertionInfo.insertedId});
    
    return newUser;
  },
  
  async removeUser(id) {
    if(!id || !ObjectId.isValid(id)) throw Error('Invalid Object Id');
    id = ObjectId(id);

    const userCollection = await users();
    const user = await userCollection.findOneAndDelete({_id: id});

    if(!user) throw Error('Deletion Failed');
    
    //TODO: remove comments from comment and event collections
    //TODO: remove user from attendees in event collection

    return user;
  },

  async updateUser(id, fields) {
    if(!id || !ObjectId.isValid(id)) throw Error('Invalid Object Id');
    id = ObjectId(id);

    if(!validUserFields(fields)) throw Error('Invalid fields for User');

    const userCollection = await users();
    const user = await userCollection.findOneAndReplace(
      {_id: id},
      fields,
      {returnDocument: 'after'}
    );

    if(!user) throw Error('Update Failed');

    return user;
  },

  async signInUser(username, password) {
    if(!username || !password) throw "invalid params";

  if(typeof username !== 'string') throw "improper paramater type";
  username = username.trim().toLowerCase();
  if(username.length < 5) throw "short string";
  if(username.length > 15) throw "long string";

  if(typeof password !== 'string') throw "improper paramater type";
  password = password.trim();
  if(password.includes(" ")) throw "space in password";
  if(password.length < 8) throw "short password";
  if(!(/\d/.test(password))) throw "include number in password";
  if(!(/[A-Z]/.test(password))) throw "include uppercase in password";
  if(!(/[^a-zA-Z0-9]/.test(password))) throw "include special character in password";

  const usersCollection = await users();

  const found = await usersCollection.findOne({username: username});

  if(!found) throw "Either the userId or password is invalid";

  const match = await bcrypt.compare(password, found.password);

  if(!match) throw "Either the userId or password is invalid";
  

  let userInfo = {
    username: found.username,
    firstName: found.firstName,
    lastName: found.lastName,
    email: found.email,
    role: found.role,
    phoneNumber: found.phoneNumber,
    age: found.age,
    posts: found.posts,
    favorites: found.favorites
  };

  return userInfo;
},

//NEED TO VALIDATE ALL INPUTS FOR THISS
async signUpUser(
  firstName,
  lastName,
  username,
  password,
  email,
  phoneNumber,
  age,
  role
){
  if(!firstName || !lastName || !username || !password || !email || !phoneNumber || !role || !age) throw "missing an input param";
  if(typeof firstName !== 'string') throw "improper paramater type";
  if(typeof lastName !== 'string') throw "improper paramater type";

  if((/\d/.test(firstName))) throw "number in first name";
  if((/\d/.test(lastName))) throw "number in last name";

  firstName = firstName.trim();
  lastName = lastName.trim();

  if(firstName.length < 2) throw "short string";
  if(lastName.length < 2) throw "short string";

  if(firstName.length > 25) throw "long string";
  if(lastName.length > 25) throw "long string";

  if(typeof username !== 'string') throw "improper paramater type";
  if((/\d/.test(username))) throw "number in username";
  username = username.trim().toLowerCase();
  if(username.length < 5) throw "short string";
  if(username.length > 10) throw "long string";

  if(typeof password !== 'string') throw "improper paramater type";
  password = password.trim();
  if(password.includes(" ")) throw "space in password";
  if(password.length < 8) throw "short password";
  if(!(/\d/.test(password))) throw "include number in password";
  if(!(/[A-Z]/.test(password))) throw "include uppercase in password";
  if(!(/[^a-zA-Z0-9]/.test(password))) throw "include special character in password";

  if(typeof role !== 'string') throw "invalid parameter";
  role = role.trim().toLowerCase();
  if(role !== "organizer" && role !== "attendee") throw "role must be admin or user";


  const hash = await bcrypt.hash(password, saltRounds);

  const usersCollection = await users();

  const found = await usersCollection.findOne({username: username});

  if(found) throw "username already exists";


  const user = {
    username: username,
    firstName: firstName,
    lastName: lastName,
    password: hash,
    email: email,
    role: role,
    phoneNumber: phoneNumber,
    age: age,
    posts: [],
    favorites: []
  }

  const inserting = await usersCollection.insertOne(user);

  if(!inserting.acknowledged || !inserting.insertedId) throw "could not add user";

  const ans = True;

  return ans;

}
};

export default exportedMethods;