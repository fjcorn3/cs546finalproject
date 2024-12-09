import path from 'path';
import {Router} from 'express';
const router = Router();
import exportedMethods from '../data/users.js';

const staticDir = path.resolve('static');

const saltRounds = 16;

router.get('/', (req, res) => {
    res.sendFile(path.join(staticDir, 'homepage.html'));
});

router
.route('/signin')
.get(async (req, res) => {
    res.sendFile(path.join(staticDir, 'signin.html'));
})
.post(async (req, res) => {
    let{
        username,
        password
    } = req.body;

    let user = {};

    try{
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

    user = await signInUser(username, password);
    
    res.sendFile(path.join(staticDir, 'eventPage.html'));
    }catch(e){
        //CREATE SIMPLE ERROR PAGE
        res.status(400).sendFile(path.join(staticDir, 'error.html'));
    }

});

router
.route('/signup')
.get(async (req, res)=> {
    res.sendFile(path.join(staticDir, 'signup.html'));
})
.post( async(req, res) => {
    let{
        firstName,
  lastName,
  username,
  password,
  email,
  phoneNumber,
  age,
  role
    } = req.body;
    try{
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
  let newUser = await signUpUser(
    firstName,
  lastName,
  username,
  password,
  email,
  phoneNumber,
  age,
  role
  );
  if(!newUser) throw 'could not sign up user';
    res.sendFile(path.join(staticDir, 'signin.html'));
}catch(e){
    res.status(400).sendFile(path.join(staticDir, 'error.html'));
}
});

export default router;