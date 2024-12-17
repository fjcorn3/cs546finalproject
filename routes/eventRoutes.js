import Router from 'express';
import { ObjectId } from 'mongodb';
import * as eventData from '../data/events.js';
import * as userData from '../data/users.js';
import * as validation from '../validation.js';
import xss from 'xss';
import { events, users } from '../config/mongoCollections.js';

const router = Router();

// ROUTE: /events/
// METHODS: GET 
router.route('/')
  .get(async (req, res) => {
    let organizer = false;
    const id = req.session.user._id;

    try{
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

    try {
      const event = await eventData.getEventById(req.params.id);
      event.organizer = await userData.getUserById(event.organizer);

      // Get Usernames of commenters
      for(let i = 0; i < event.comments.length; i++) {
        event.comments[i].username = (await userData.getUserById(event.comments[i].userId)).username;
      }

      res.render('event', {title: "Event", signedIn: req.session.user ? true : false, event});
    }
    catch(e) {
      res.status(500).render('error', {title: "Error", signedIn: req.session.user ? true : false, message: e.message});
    }
  })
  .post(async (req, res) => {
    if(!ObjectId.isValid(req.params.id)) {
      return res.status(400).render('error', {title: "Error", signedIn: req.session.user ? true : false, message: "Invalid ID"});
    }
    let { comment } = req.body;
    const userId = req.session.user._id;

    if(!comment || typeof comment !== 'string' || comment.trim().length === 0 || comment.trim().length > 255) {
      return res.status(400).render('error', {title: "Error", signedIn: req.session.user ? true : false, message: "Invalid Comment"});
    }

    comment = xss(comment);

    try {
      const event = await eventData.updateEventComments(req.params.id, req.session.user._id, comment);

      // Get Usernames of commenters
      for(let i = 0; i < event.comments.length; i++) {
        event.comments[i].username = (await userData.getUserById(event.comments[i].userId)).username;
      }

      return res.status(200).json({ comments: event.comments });
    } catch (e) {
        console.error("Error adding comment:", e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
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
    if (typeof address !== 'string' || address.trim().length === 0 || address.trim().length > 255) errors.push("Address must be of type String!");
    if (typeof description !== 'string' || description.trim().length === 0 || description.trim().length > 255) errors.push("Description must be of type String!");
    if (isNaN(parseInt(price)) || parseInt(price) < 0) errors.push("Price must be a number!");
    if (familyFriendly !== 'true' && familyFriendly !== 'false') errors.push("familyFriendly must be true or false!");
    if(!validation.validDate(date)) errors.push("Invalid date! Proper Format: YYYY-MM-DD"); //date
    if(!validation.validTime(time)) errors.push("Invalid time! Proper format: HH:MM");
    if (!Array.isArray(tags) || tags.length === 0) errors.push("Tags must be an array!");
    
    tags.forEach(tag => {
      if (typeof tag !== 'string' || tag.trim().length === 0 || tag.trim().length > 15){
        errors.push("Each tag in Tags must be of type string!");
      }
    });


    if(errors.length !== 0) {
      return res.status(400).render('createEvent', {title: "Create Event", signedIn: req.session.user ? true : false, error: errors.join(', ')});
    }

    address = address.trim();
    description = description.trim();
    price = parseInt(price);
    familyFriendly = Boolean(familyFriendly);

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

router.post('/like', async (req, res) => {
  try {
      let { eventId } = req.body;
      let userId = req.session.user._id;
      // Validate eventId
      if (!eventId) {
          console.error("Error: Event ID is missing");
          return res.status(400).json({ error: "Event ID is required" });
      }
      if (!ObjectId.isValid(eventId)) {
          console.error("Error: Invalid Event ID");
          return res.status(400).json({ error: "Invalid Event ID" });
      }
      // Fetch the events collection
      const eventCollection = await events();
      eventId = new ObjectId(eventId)
      
      let event = await eventCollection.findOne({_id: eventId});
      if (!event){
        return res.status(404).json({ error: "Event Not Found" });
      }
      if (event.likedBy.includes(userId)){
        return res.status(400).json({ error: "You have already liked this event" });
      }
      // Increment likes for the event
      const updatedEvent = await eventCollection.findOneAndUpdate(
          { _id: eventId },
          { $inc: { likes: 1 },
          $addToSet: {likedBy: userId} },
          { returnDocument: "after" }
      );
     
      if (!updatedEvent) {
          console.error("Error: Event not found for ID:", eventId);
          return res.status(404).json({ error: "Event Not Found" });
      }
      console.log("Event updated successfully. New likes:", updatedEvent.likes);

      return res.status(200).json({ likes: updatedEvent.likes });
  } catch (error) {
      console.error("Error updating likes:", error); // Log any unexpected error
      return res.status(500).json({ error: "Internal Server Error" });
  }
});  

export default router;