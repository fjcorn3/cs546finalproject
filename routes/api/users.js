import { Router } from 'express';
import userData from '../../data/users.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const users = await userData.getAllUsers();
    res.json(users);
  }
  catch(e) {
    res.status(500).json({error: e});
  }
});

router.post('/', (req, res) => {
  const user = req.body;


  if (!user || Object.keys(user).length === 0) {
      res.status(400).json({error: 'There are no fields in the request body'});
  }

  if(!validUser(user)) res.status(400).json({error: 'Invalid User'});

  try {
    const id = await userData.addUser(user);
    res.json({id: id});
  }
  catch(e) {
    res.status(500).json({error: e});
  }
});


router.get('/:userId', (req, res) => {
  //TODO
  const userId = req.params.userId;

  try {
    const user = await userData.getUserById(userId);
    res.json(user);
  }
  catch(e) {
    res.status(404).json({Error: "Not Found"});
  }
});

export default router;