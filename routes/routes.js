import Router from 'express';
import * as validation from '../validation.js';
import * as userData from '../data/users.js';
import * as eventData from '../data/events.js';
import xss from 'xss';

const router = Router();
let routess = true;

// ROUTE: /home
// METHODS: GET
router.route('/home').get(async (req, res) => {

  const events = await eventData.getEvents();

  let signedIn = false;
  let organizer = false;

  if(req.session.user) {
    signedIn = true;
    organizer = req.session.user.role === 'organizer';
  }

  res.render('home', {title: "Home", signedIn, organizer, events});
});


// ROUTE: /signout
// METHODS: GET
router.route('/signout').get(async (req, res) => {
  req.session.destroy();
  res.render('signout', {title: "Signed Out"});
});


// ROUTE: /signin
// METHODS: GET, POST
router.route('/signin')
  .get(async (req, res) => {
    res.render('signin', {title: "Sign In"});
  })
  .post(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).render('signin', {title: "Sign In", error: "Must Fill Out Form"});
    }

    let errors = [];

    if(!validation.validUsername(username)) errors.push("Invalid User Name"); 
    if(!validation.validPassword(password)) errors.push("Invalid Password"); 

    if(errors.length !== 0) {
      return res.status(400).render('signin', {title: "Sign In", error: errors.join(', ')});
    }

    try{
      const user = await userData.getUser(username, password);
      req.session.user = user;
      res.redirect('/home');
    }
    catch(e) {
      res.status(400).render('signin', {title: "Sign In", error: e.message})
    }
  });

// ROUTE: /signout
// METHODS: GET, POST
router.route('/signup')
  .get(async (req, res) => {
    res.render('signup', {title: "Sign Up"});
  })
  .post(async (req, res) => {
    let { firstName, lastName, username, email, role, phoneNumber, age, password, confirmPassword} = req.body;

    if (!firstName || !lastName || !username || !email || !role || !phoneNumber || !age || !password || !confirmPassword) {
      return res.status(400).render('signup', {title: "Sign Up", error: "Must Fill Out Form"});
    }

    let errors = [];

    if(!validation.validName(firstName)) errors.push("Invalid First Name");
    if(!validation.validName(lastName)) errors.push("Invalid Last Name");
    if(!validation.validUsername(username)) errors.push("Invalid User Name");
    if(!validation.validPassword(password)) errors.push("Invalid Password");
    if(!validation.validAge(age)) errors.push('Age must be a number and at least 18 years old.');
    if(password !== confirmPassword) errors.push("Passwords Do Not Match");
    if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) errors.push('Email must be a valid email address.');
    if (!/^[0-9]{10}$/.test(phoneNumber)) errors.push('Phone number must be a valid 10-digit number.');
    if(typeof role !== 'string' || role.trim() !== 'attendee' && role.trim() !== 'organizer') errors.push("Invalid Role");

    if(errors.length !== 0) {
      return res.status(400).render('signup', {title: "Sign Up", error: errors.join(', ')});
    }

    firstName = xss(firstName);
    lastName = xss(lastName);
    username = xss(username);

    try{
      const user = await userData.createUser(firstName, lastName, username, email, role, phoneNumber, age, password);

      if(!user.registrationCompleted) {
        return res.status(500).render('signup', {title: "Sign Up", error: "Internal Server Error"});
      }

      res.redirect('/signin')
    }
    catch(e) {
      res.status(400).render('signup', {title: "Sign Up", error: e.message});
    }   
  });

  router.post('/favorite/:eventId', async (req, res) => {
    try {
      const userId = req.session.user._id;
      const { eventId } = req.params;
  
      await userData.addFavoriteEvent(userId, eventId);
      res.json({ success: true, message: 'Event added to favorites' });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  
  router.post('/unfavorite/:eventId', async (req, res) => {
    try {
      const userId = req.session.user._id;
      const { eventId } = req.params;
  
      await userData.removeFavoriteEvent(userId, eventId);
      res.json({ success: true, message: 'Event removed from favorites' });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  
  router.get('/profile', async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await userData.getUserById(userId);
      const favoritedEvents = await eventData.getEventsByIds(user.eventsFavorited || []);
      const eventsPosted = user.role === 'organizer' ? await eventData.getEventsByIds(user.eventsPosted || []) : [];
  
      res.render('profile.handlebars', {
        user,
        favoritedEvents,
        eventsPosted,
        organizer: user.role === 'organizer',
      });
    } catch (e) {
      res.status(500).render('error.handlebars', { error: e.message });
    }
  });

  
export default router;