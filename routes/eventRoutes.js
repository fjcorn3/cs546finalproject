import Router from 'express';
import { ObjectId } from 'mongodb';
import * as eventData from '../data/events.js';
import * as userData from '../data/users.js';
import * as validation from '../validation.js';
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

    try{
      const events = await eventData.getEvents();
      res.render('events', {title: "Events", signedIn: req.session.user ? true : false, organizer: organizer, events, eventsRole});
    }
    catch(e) {
      res.status(500).render('error', {title: "Error", signedIn: req.session.user ? true : false, message: e.message});
    }
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

    if (!name || !address || !date || !time || !description || !price || familyFriendly == null || !tags) {
      return res.status(400).render('createEvent', {title: "Create Event", signedIn: req.session.user ? true : false, error: "Must Fill Out Form"});
    }

    let errors = [];

    //TODO: Validation
    if(!validation.validName(name)) errors.push("Invalid Name"); //name

    if (typeof address !== 'string'){ //address
      throw "Error: Address must be of type String!";
    }
    if (typeof description !== 'string'){ //description
      throw "Error: Description must be of type String!";
    }
    if (!Array.isArray(tags)){ //tags
      throw "Error: Tags must be an array!";
    }
    
    address = address.trim();
    description = description.trim();

    if (address.length === 0){
      throw "Error: Address is empty!";
    }
    if (description.length === 0){
      throw "Error: Description is empty!";
    }

    if (tags.length === 0){
      throw "Error: Tags cannot be empty!";
    }

    tags.forEach(tag => {
      if (typeof tag !== 'string'){
        throw "Each tag in Tags must be of type string!";
      }
      tag = tag.trim();
      if (tag.length === 0){
        throw "Error: Atleast one tag is empty!";
      }
    });

    if (isNaN(parseInt(price)) || parseInt(price) < 0){
      throw "Error: Price must be a number!";
    }

    price = parseInt(price);

    if (familyFriendly !== 'true' && familyFriendly !== 'false'){
      throw "Error: familyFriendly must be true or false!";
    }

    familyFriendly = Boolean(familyFriendly);
    if(!validation.validDate(date)) errors.push("Invalid date! Proper Format: YYYY-MM-DD"); //date
    if(!validation.validTime(time)) errors.push("Invalid time! Proper format: HH:MM");

    // if(!validation.validName(lastName)) errors.push("Invalid Last Name");
    // if(!validation.validUsername(username)) errors.push("Invalid User Name");
    // if(!validation.validPassword(password)) errors.push("Invalid Password");
    // if(!validation.validAge(age)) errors.push('Age must be a number and at least 18 years old.');
    // if(password !== confirmPassword) errors.push("Passwords Do Not Match");
    // if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) errors.push('Email must be a valid email address.');
    // if (!/^[0-9]{10}$/.test(phoneNumber)) errors.push('Phone number must be a valid 10-digit number.');
    // if(typeof role !== 'string' || role.trim() !== 'attendee' && role.trim() !== 'organizer') errors.push("Invalid Role");

    if(errors.length !== 0) {
      return res.status(400).render('createEvent', {title: "Create Event", signedIn: req.session.user ? true : false, error: errors.join(', ')});
    }

    name = xss(name);
    description = xss(description);
    date = xss(date);
    address = xss(address);
    time = xss(time);

    try{
      const event = await eventData.createEvent(name, address, date, time, description, price, familyFriendly, tags, req.session.user._id);

      if(!event) {
        return res.status(500).render('createEvent', {title: "Create Event", signedIn: req.session.user ? true : false, error: "Internal Server Error"});
      }

      res.redirect(`/events/event/${event._id}`);
    }
    catch(e) {
      res.status(400).render('createEvent', {title: "Create Event", signedIn: req.session.user ? true : false, error: e.message});
    }   
  });

// ROUTE: /events/search
// METHODS: POST
router.route('/search')
  .post(async (req, res) => {
    let { tag } = req.body;

    tag = xss(tag);

    try{
      const events = await eventData.getEventsByTag(tag);

      if(!events) {
        return res.status(500).render('searchEvent', {title: "Search", signedIn: req.session.user ? true : false, error: "Internal Server Error"});
      }

      res.render('searchEvent', {title: "Search", signedIn: req.session.user ? true : false, events, tag})
    }
    catch(e) {
      res.status(400).render('searchEvent', {title: "Search", signedIn: req.session.user ? true : false, error: e.message, tag});
    }   

  });

export default router;