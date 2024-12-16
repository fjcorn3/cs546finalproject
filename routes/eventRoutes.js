import Router from 'express';
import { ObjectId } from 'mongodb';
import * as eventData from '../data/events.js';
import * as userData from '../data/users.js';
import xss from 'xss';

const router = Router();

// ROUTE: /events/
// METHODS: GET 
router.route('/')
  .get(async (req, res) => {
    let organizer = false;
    const id = req.session.user._id;

    const user = await userData.getUserById(id);
    let eventsRole = [];

    // Getting Events posted by user if they are an organizer
    if(req.session.user.role === 'organizer') {
      organizer = true;
      for(let i = 0; i < user.eventsPosted.length; i++) {
        eventsRole.push(await eventData.getEventById(user.eventsPosted[i]));
      }
    }
    // Getting Events attended by user if they are an attendee 
    else {
      for(let i = 0; i < user.eventsFavorited.length; i++) {
        eventsRole.push(await eventData.getEventById(user.eventsFavorited[i]));
      }
    }

    const events = await eventData.getEvents();
    res.render('events', {title: "Events", signedIn: req.session.user ? true : false, organizer: organizer, events, eventsRole});
  });


// ROUTE: /events/event/:id
// METHODS: GET, POST, PATCH
router.route('/event/:id')
  .get(async (req, res) => {
    if(!ObjectId.isValid(req.params.id)) {
      return res.status(400).render('error', {title: "Error", signedIn: req.session.user ? true : false, message: "Invalid Event"});
    }

    const event = await eventData.getEventById(req.params.id);

    event.organizer = await userData.getUserById(event.organizer);

    // Get Usernames of commenters
    for(let i = 0; i < event.comments.length; i++) {
      event.comments[i].username = (await userData.getUserById(event.comments[i].userId)).username;
    }

    res.render('event', {title: "Event", signedIn: req.session.user ? true : false, event});
  })
  .post(async (req, res) => {
    if(!ObjectId.isValid(req.params.id)) {
      return res.status(400).render('error', {title: "Error", signedIn: req.session.user ? true : false, message: "Invalid Event"});
    }
    let { comment } = req.body;

    comment = xss(comment);

    const event = await eventData.updateEventComments(req.params.id, req.session.user._id, comment);

    // Get Usernames of commenters
    for(let i = 0; i < event.comments.length; i++) {
      event.comments[i].username = (await userData.getUserById(event.comments[i].userId)).username;
    }

    res.render('event', {title: "Event", signedIn: req.session.user ? true : false, event});
  });

// ROUTE: /events/create
// METHODS: GET, POST
router.route('/create')
  .get(async (req, res) => {
    res.render('createEvent', {title: "Create Event", signedIn: req.session.user ? true : false});
  })
  .post(async (req, res) => {
    let { name, address, date, time, description, price, familyFriendly, tags} = req.body;

    if (!name || !address || !date || !time || !description || !price || !familyFriendly || !tags) {
      return res.status(400).render('createEvent', {title: "Create Event", error: "Must Fill Out Form"});
    }

    let errors = [];

    //TODO: Validation
    // if(!validation.validName(name)) errors.push("Invalid Name");
    // if(!validation.validName(lastName)) errors.push("Invalid Last Name");
    // if(!validation.validUsername(username)) errors.push("Invalid User Name");
    // if(!validation.validPassword(password)) errors.push("Invalid Password");
    // if(!validation.validAge(age)) errors.push('Age must be a number and at least 18 years old.');
    // if(password !== confirmPassword) errors.push("Passwords Do Not Match");
    // if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) errors.push('Email must be a valid email address.');
    // if (!/^[0-9]{10}$/.test(phoneNumber)) errors.push('Phone number must be a valid 10-digit number.');
    // if(typeof role !== 'string' || role.trim() !== 'attendee' && role.trim() !== 'organizer') errors.push("Invalid Role");

    if(errors.length !== 0) {
      return res.status(400).render('createEvent', {title: "Create Event", error: errors.join(', ')});
    }

    try{
      const event = await eventData.createEvent(firstName, lastName, username, email, role, phoneNumber, age, password, req.session.user._id);

      if(!event) {
        return res.status(500).render('createEvent', {title: "Create Event", error: "Internal Server Error"});
      }

      res.redirect(`/events/event/${event._id}`);
    }
    catch(e) {
      res.status(400).render('createEvent', {title: "Create Event", error: e.message});
    }   
  });

export default router;