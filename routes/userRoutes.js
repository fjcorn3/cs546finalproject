import express from 'express';
import path from 'path';
import { createUser, getUserById } from '../data/users.js';
import { signinRedirect, signupRedirect, authenticateUser, authenticateOrganizer, allowSignOut } from '../middleware.js';
import {ObjectId} from 'mongodb';

const router = express.Router();
const __dirname = path.resolve();

router.route('/signup').get(signupRedirect, (req, res) => {
  res.sendFile(path.join(__dirname, 'static/signup.html'));
});

router.route('/signup').post(async (req, res, next) => {
    let { firstName, lastName, username, email, role, phoneNumber, age, password } = req.body;
    if (!firstName || !lastName || !username || !email || !role || !phoneNumber || !age || !password) {
        req.session.error = 'All fields must be filled out.';
        return res.redirect('/signup');
    }
  
    if (typeof firstName !== 'string' || firstName.trim().length < 2 || firstName.trim().length > 25) {
        req.session.error = 'First name must be between 2 and 25 characters.';
        return res.redirect('/signup');
    }
  
    if (typeof lastName !== 'string' || lastName.trim().length < 2 || lastName.trim().length > 25) {
        req.session.error = 'Last name must be between 2 and 25 characters.';
        return res.redirect('/signup');
    }
  
    if (typeof username !== 'string' || username.trim().length < 5 || username.trim().length > 10) {
        req.session.error = 'Username must be between 5 and 10 characters.';
        return res.redirect('/signup');
    }
  
    if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
        req.session.error = 'Email must be a valid email address.';
        return res.redirect('/signup');
    }
  
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
        req.session.error = 'Phone number must be a valid 10-digit number.';
        return res.redirect('/signup');
    }
  
    if (typeof Number(age) !== 'number' || Number(age) < 18) {
        req.session.error = 'Age must be a number and at least 18 years old.';
        return res.redirect('/signup');
    }
  
    if (typeof password !== 'string' || password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        req.session.error = 'Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.';
        return res.redirect('/signup');
    }
    try {
        const user = await createUser(firstName, lastName, username, email, role, phoneNumber, age, password);
        if (user.registrationCompleted === true){
            res.redirect('/signin');
        }
    } catch (e) {
        if (e.message === "Either the username or password is invalid."){
            res.redirect('/signup');
        }
        //console.log(e);
        //res.redirect('/signin');
        return next(e);
  }
});

router.route('/signin').get(signinRedirect, (req, res) => {
    res.sendFile(path.join(__dirname, 'static/signin.html'));
  });

router.route('/signin').post(async(req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        req.session.error = 'All fields must be filled out.';
        return res.redirect('/signin');
    }
    if (typeof username !== 'string' || username.trim().length < 5 || username.trim().length > 10) {
        req.session.error = 'Username must be between 5 and 10 characters.';
        return res.redirect('/signin');
    }
    if (typeof password !== 'string' || password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        req.session.error = 'Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.';
        return res.redirect('/signin');
    }
    try {
        const user = await getUserById(
          username,
          password
        );
        req.session.user = {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            age: user.age,
            phoneNumber: user.phoneNumber,
            email: user.email,
            role: user.role,
        };
  
        if (user.role === 'attendee') {
          return res.redirect('/eventPage');
        } else {
          return res.redirect(`/coordinatorProfile/${user.username}`);
        }
      } catch (e) {
        if (e.message === "Either the username or password is invalid."){
            res.redirect('/signin');
        }
        return next(e);
      }
});

router.route('/eventPage').get(authenticateUser, async (req, res) => {
    res.sendFile(path.join(__dirname, 'static/eventPage.html'));
});

router.route('/reviewPage').get(authenticateUser, async (req, res) => {
    res.sendFile(path.join(__dirname, 'static/reviewPage.html'));
});
router.route('/coordinatorProfile/:username').get(authenticateUser, async (req, res) => {
    res.sendFile(path.join(__dirname, 'static/coordinatorProfile.html'));
});

router.route('/signoutuser').get(allowSignOut, async (req, res, next) => {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('AuthCookie');
      res.redirect('/signin');
    });
  });

export default router;
