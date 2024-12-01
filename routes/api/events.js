import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { validEvent, validEventFields } from '../../validation.js';
import eventData from '../../data/events.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const events = await eventData.getAllEvents();
    res.json(events);
  }
  catch(e) {
    res.status(500).json({error: e.message});
  }
});

router.post('/', async (req, res) => {
  const event = req.body;

  if (!event || Object.keys(event).length === 0 || !validEvent(event)) {
    res.status(400).json({error: 'Missing fields in request body'});
  }

  try {
    const newEvent = await eventData.addEvent(event);
    res.json(newEvent);
  }
  catch(e) {
    res.status(500).json({error: e.message});
  }
});


router.get('/:eventId', async (req, res) => {
  const eventId = req.params.eventId;

  if(!ObjectId.isValid(eventId)) res.status(400).json({error: 'Invalid Id'});

  try {
    const event = await eventData.getEventById(eventId);
    res.json(event);
  }
  catch(e) {
    res.status(404).json({Error: "Event Not Found"});
  }
});

router.patch('/:eventId', async (req, res) => {
  const eventId = req.params.eventId;
  const updateFields = req.body;

  if(!ObjectId.isValid(eventId)) res.status(400).json({error: 'Invalid Id'});

  if (!updateFields || Object.keys(updateFields).length === 0 || !validEventFields(updateFields)) {
    res.status(400).json({error: 'Missing fields in the request body'});
  }

  try {
    const event = await eventData.updateEvent(eventId, updateFields);
    res.json(event);
  }
  catch(e) {
    res.status(404).json({error: 'Event Not Found'});
  }
});

export default router;