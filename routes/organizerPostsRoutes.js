import express from 'express';
import path from 'path';
import { createEvent } from '../data/organizerPosts.js';
import { users } from '../config/mongoCollections.js';
import { authenticateUser, authenticateOrganizer } from '../middleware.js';
import xss from 'xss';

const router = express.Router();
const __dirname = path.resolve();

router.get('/', async (req, res) => {
  try {
    const userCollection = await users();
    const organizers = await userCollection.find({ role: 'organizer' }).toArray();
    const allPosts = organizers.reduce((acc, organizer) => {
      return acc.concat(organizer.posts || []);
    }, []);
    res.json(allPosts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to fetch posts.');
  }
});

router.get('/create', authenticateUser, authenticateOrganizer, (req, res) => {
  res.sendFile(path.join(__dirname, 'static/createPost.html'));
});

router.post('/create', authenticateUser, authenticateOrganizer, async (req, res) => {
  try {
    const description = xss(req.body.description);
    const photo = xss(req.body.photo);
    const headCount = req.body.headCount;
    const time = req.body.time;
    const date = req.body.date;
    const location = xss(req.body.location);
    const rsvpForm = req.body.rsvpForm;
    const event = await createEvent(req.session.user.username, photo, description, headCount, time, date, location, rsvpForm);
    res.redirect(`/coordinatorProfile`);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export default router;
