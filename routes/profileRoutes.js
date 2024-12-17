import Router from 'express';
import { ObjectId } from 'mongodb';
import * as userData from '../data/users.js';
import * as eventData from '../data/events.js';

const router = Router();

// ROUTE: /profile/
// METHODS: GET
router.route('/')
  .get(async (req, res) => {
    let organizer = false;

    const id = req.session.user._id;

    const user = await userData.getUserById(id);
    let eventsPosted = [];
    let eventsFavorited = [];

    // Getting Events posted by user if they are an organizer
    if(req.session.user.role === 'organizer') {
      organizer = true;
      for(let i = 0; i < user.eventsPosted.length; i++) {
        eventsPosted.push(await eventData.getEventById(user.eventsPosted[i]));
      }
    }
    // Getting Events attended by user if they are an attendee 
    for(let i = 0; i < user.eventsFavorited.length; i++) {
      eventsFavorited.push(await eventData.getEventById(user.eventsFavorited[i]));
    }

    res.render('profile', {title: "Profile", signedIn: req.session.user ? true : false, organizer: organizer, user, eventsFavorited, eventsPosted});
});


// ROUTE: /profile/:id
// METHODS: GET 
router.route('/:id')
  .get(async (req, res) => {

    if(!ObjectId.isValid(req.params.id)) {
      return res.status(400).render('error', {title: "Error", signedIn: req.session.user ? true : false, message: "Invalid Id"});
    }

    let organizer = false;

    const user = await userData.getUserById(req.params.id);
    let eventsPosted = [];
    let eventsFavorited = [];

    if(user.role === 'organizer') {
      organizer = true;
      for(let i = 0; i < user.eventsPosted.length; i++) {
        eventsPosted.push(await eventData.getEventById(user.eventsPosted[i]));
      }
    }
    // Getting Events attended by user if they are an attendee 
    for(let i = 0; i < user.eventsFavorited.length; i++) {
      eventsFavorited.push(await eventData.getEventById(user.eventsFavorited[i]));
    }

    res.render('profile', {title: "Profile", signedIn: req.session.user ? true : false, organizer: organizer, user, eventsFavorited, eventsPosted});
});
export default router;