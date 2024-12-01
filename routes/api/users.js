import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { validUser, validUserFields } from '../../validation.js';
import userData from '../../data/users.js';
import xss from 'xss';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const users = await userData.getAllUsers();
    res.json(users);
  }
  catch(e) {
    res.status(500).json({error: e.message});
  }
});

router.post('/', async (req, res) => {
  let user = req.body;

  if(!user || Object.keys(user).length === 0 || !validUser(user)) {
    return res.status(400).json({error: 'Missing/Incorrect fields in the request body'});
  }
  
  // user = Object.fromEntries(Object.entries(user).map(([key, val]) => [key, xss(val)]));

  try {
    const newUser = await userData.addUser(user);
    res.json(newUser);
  }
  catch(e) {
    res.status(500).json({error: e.message});
  }
});


router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  if(!ObjectId.isValid(userId)) res.status(400).json({error: 'Invalid Id'});

  try {
    const user = await userData.getUserById(userId);
    res.json(user);
  }
  catch(e) {
    res.status(404).json({Error: "User Not Found"});
  }
});

router.patch('/:userId', async (req, res) => {
  const userId = req.params.userId;
  let updateFields = req.body;

  if(!ObjectId.isValid(userId)) res.status(401).json({error: 'Invalid Id'});

  if (!updateFields || Object.keys(updateFields).length === 0 || !validUserFields(updateFields)) {
    return res.status(400).json({error: 'Missing fields in the request body'});
  }

  // updateFields = Object.fromEntries(Object.entries(updateFields).map(([key, val]) => [key, xss(val)]));

  try {
    const user = await userData.updateUser(userId, updateFields);
    res.json(user);
  }
  catch(e) {
    res.status(404).json({error: 'User Not Found'});
  }
});

router.delete('/:userId', async (req, res) => {
  const userId = req.params.userId;

  if(!ObjectId.isValid(userId)) res.status(400).json({error: 'Invalid Id'});

  try {
    const user = await userData.removeUser(userId);
    res.json(user);
  }
  catch(e) {
    res.status(404).json({Error: "User Not Found"});
  }
});

export default router;