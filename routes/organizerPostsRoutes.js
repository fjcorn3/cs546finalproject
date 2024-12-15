import express from 'express';
import path from 'path';
import { createEvent, deletePost, updatePost, addComment, addRate } from '../data/organizerPosts.js';
import { users } from '../config/mongoCollections.js';
import { authenticateUser, authenticateOrganizer } from '../middleware.js';
import xss from 'xss';
import {ObjectId} from 'mongodb';

const router = express.Router();
const __dirname = path.resolve();

// router.get('/', async (req, res) => {
//   try {
//     const userCollection = await users();
//     const organizers = await userCollection.find({ role: 'organizer' }).toArray();
//     const allPosts = organizers.reduce((acc, organizer) => {
//       return acc.concat(organizer.posts || []);
//     }, []);
//     res.json(allPosts);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Failed to fetch posts.');
//   }
// });

router.get('/create', authenticateUser, authenticateOrganizer, (req, res) => {
  res.sendFile(path.join(__dirname, 'static/createPost.html'));
});

router.post('/create', authenticateUser, authenticateOrganizer, async (req, res) => {
  try {
    let description = xss(req.body.description);
    let photo = xss(req.body.photo);
    let headCount = req.body.headCount;
    let time = req.body.time;
    let date = req.body.date;
    let location = xss(req.body.location);
    let rsvpForm = req.body.rsvpForm;
    let event = await createEvent(req.session.user.username, photo, description, headCount, time, date, location, rsvpForm);
    res.redirect('/eventPage');
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

router.get('/updatePost/:id', authenticateUser, authenticateOrganizer, async (req, res) =>{
  res.sendFile(path.join(__dirname, 'static/createPost.html'));
});

router.post('/updatePost/:id', authenticateUser, authenticateOrganizer, async (req, res) =>{
  
  req.params.id = req.params.id.trim();
  console.log(req.params.id);
  //validate that it is a valid object id and is non empty


  let description = xss(req.body.description);
    let photo = xss(req.body.photo);
    let headCount = req.body.headCount;
    let time = req.body.time;
    let date = req.body.date;
    let location = xss(req.body.location);
    let rsvpForm = req.body.rsvpForm;
  try{
    let event = await updatePost(req.params.id, req.session.user.username, photo, description, headCount, time, date, location, rsvpForm);

    if(!event) throw "could not update post";

    res.redirect(`/coordinatorProfile/${req.session.user.username}`);

  }catch(e){
    console.log(e);
    //do smth
  }
});

router.get('/deletePost/:id', authenticateUser, authenticateOrganizer, async (req, res) =>{
  req.params.id = req.params.id.trim();
  //validate that it is a valid object id and is non empty
  try{
    let event = await deletePost(req.params.id);

    if(!event) throw "could not delete post";

    res.redirect(`/coordinatorProfile/${req.session.user.username}`);

  }catch(e){
    //do smth
  }
});

router.get('/addComment/:id', authenticateUser, async (req, res) =>{
  req.params.id = req.params.id.trim();
  //validate that it is a valid object id and is non empty

  res.sendFile(path.join(__dirname, 'static/addComment.html'));
  
});

router.post('/addComment/:id', authenticateUser, async (req, res) =>{
  req.params.id = req.params.id.trim();
  //validate that it is a valid object id and is non empty

  let description = req.body.comment.trim();
  try{
    let comment = await addComment(req.params.id, req.session.user.username, description);

    if(!comment) throw "could not add comment";

    res.redirect('/eventPage');

  }catch(e){
    //do smth
  }
});

router.get('/addRate/:id', authenticateUser, async (req, res) =>{
  req.params.id = req.params.id.trim();
  //validate that it is a valid object id and is non empty

  res.sendFile(path.join(__dirname, 'static/addRate.html'));
  
});

router.post('/addRate/:id', authenticateUser, async (req, res) =>{
  req.params.id = req.params.id.trim();
  //validate that it is a valid object id and is non empty

  let rate = req.body.rate.trim();
  try{
    let rating = await addRate(req.params.id, req.session.user.username, rate);

    if(!rating) throw "could not make rating";

    res.redirect('/eventPage');

  }catch(e){
    //do smth
  }
});

export default router;
