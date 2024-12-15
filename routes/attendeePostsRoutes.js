import express from 'express';
import path from 'path';
import { createPost } from '../data/attendeePosts.js';
import { authenticateUser } from '../middleware.js';
import xss from 'xss';
import {ObjectId} from 'mongodb';

const router = express.Router();
const __dirname = path.resolve();

router.get('/createAttendee', authenticateUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'static/createPostAttendee.html'));
});

router.post('/createAttendee', authenticateUser, async (req, res) => {
  try {
    const description = xss(req.body.description);
    const photo = xss(req.body.photo);
    const post = await createPost(req.session.user.username, photo, description);
    res.redirect(`/eventPage`);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export default router;
