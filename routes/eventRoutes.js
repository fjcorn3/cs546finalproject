import Router from 'express';
import * as eventData from '../data/events.js';

const router = Router();

// ROUTE: /events/
// METHODS: GET, POST 
router.route('/')
  .get(async (req, res) => {
    let organizer = false;

    if(req.session.user) {
      organizer = req.session.user.role === 'organizer';
    }

    const events = await eventData.getEvents();
    res.render('events', {title: "Events", signedIn: req.session.user ? true : false, organizer: organizer, events});
  });
  // .post(async (req, res) => {
  //   let {} = req.body;
    
  //   try {
  //     const event = await eventData.createEvent();
  //     res.redirect(`/events/events/${event._id}`)
  //   }
  // })


// ROUTE: /events/event/:id
// METHODS: GET, POST 
router.route('/event/:id')
  .get(async (req, res) => {

    const event = await eventData.getEventById(req.params.id);
    res.render('event', {title: "event", signedIn: req.session.user ? true : false}, event);
  });

export default router;