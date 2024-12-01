import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { validUser, validUserFields } from '../../validation.js';
import userData from '../../data/users.js';

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
  const user = req.body;

  if (!user || Object.keys(user).length === 0) {
    res.status(400).json({error: 'There are no fields in the request body'});
  }

  if(!validUser(user)) res.status(400).json({error: 'Invalid User'});

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
  const updateFields = req.body;

  if(!ObjectId.isValid(userId)) res.status(401).json({error: 'Invalid Id'});

  if (!updateFields || Object.keys(updateFields).length === 0 || !validUserFields(updateFields)) {
    res.status(400).json({error: 'Missing fields in the request body'});
  }

  try {
    const user = await userData.updateUser(userId, updateFields);
    res.json(user);
  }
  catch(e) {
    res.status(404).json({error: 'User Not Found'});
  }
});
export default router;