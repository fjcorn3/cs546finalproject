import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { validComment, validCommentFields } from '../../validation.js';
import commentData from '../../data/comments.js';
import xss from 'xss';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const comments = await commentData.getAllComments();
    res.json(comments);
  }
  catch(e) {
    res.status(500).json({error: e.message});
  }
});

router.post('/', async (req, res) => {
  let comment = req.body;

  if(!comment || Object.keys(comment).length === 0 || !validComment(comment)) {
    return res.status(400).json({error: 'Missing/Incorrect fields in request body'});
  }

  // comment = Object.fromEntries(Object.entries(comment).map(([key, val]) => [key, xss(val)]));

  try {
    const newComment = await commentData.addComment(comment);
    res.json(newComment);
  }
  catch(e) {
    res.status(500).json({error: e.message});
  }
});


router.get('/:commentId', async (req, res) => {
  const commentId = req.params.commentId;

  if(!ObjectId.isValid(commentId)) res.status(400).json({error: 'Invalid Id'});

  try {
    const comment = await commentData.getCommentById(commentId);
    res.json(comment);
  }
  catch(e) {
    res.status(404).json({Error: "Event Not Found"});
  }
});

router.patch('/:commentId', async (req, res) => {
  const commentId = req.params.commentId;
  let updateFields = req.body;

  if(!ObjectId.isValid(commentId)) res.status(400).json({error: 'Invalid Id'});

  if (!updateFields || Object.keys(updateFields).length === 0 || !validCommentFields(updateFields)) {
    return res.status(400).json({error: 'Missing fields in the request body'});
  }

  // updateFields = Object.fromEntries(Object.entries(updateFields).map(([key, val]) => [key, xss(val)]));

  try {
    const comment = await commentData.updateComment(commentId, updateFields);
    res.json(comment);
  }
  catch(e) {
    res.status(404).json({error: 'Event Not Found'});
  }
});

router.delete('/:commentId', async (req, res) => {
  const commentId = req.params.commentId;

  if(!ObjectId.isValid(commentId)) res.status(400).json({error: 'Invalid Id'});

  try {
    const comment = await commentData.removeComment(commentId);
    res.json(comment);
  }
  catch(e) {
    res.status(404).json({Error: "Event Not Found"});
  }
});

export default router;