import Router from 'express';
import * as eventData from '../data/events.js';
import * as userData from '../data/users.js';

const router = Router();

// ROUTE: /events/
// METHODS: GET, POST 
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
  // .post(async (req, res) => {
  //   let {} = req.body;
    
  //   try {
  //     const event = await eventData.createEvent();
  //     res.redirect(`/events/events/${event._id}`)
  //   }
  // })


// ROUTE: /events/event/:id
// METHODS: GET, POST, PATCH
router.route('/event/:id')
  .get(async (req, res) => {

    const event = await eventData.getEventById(req.params.id);

    // Get Usernames of commenters
    for(let i = 0; i < event.comments.length; i++) {
      event.comments[i].username = (await userData.getUserById(event.comments[i].userId)).username;
    }

    res.render('event', {title: "Event", signedIn: req.session.user ? true : false, event});
  });

export default router;