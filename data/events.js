import { ObjectId } from 'mongodb';
import { events, users } from '../config/mongoCollections.js';
import * as validation from '../validation.js';

export const createEvent = async (name, address, date, time, description, price, familyFriendly, tags, organizerId) => {
  //TODO: Validation

  let event = {
    name,
    address,
    date,
    time,
    description,
    price,
    familyFriendly,
    tags,
    organizer: organizerId,
    comments: [],
    attendees: [],
    likes: 0
  }

  const eventCollection = await events();
  const insertionInfo = await eventCollection.insertOne(event);

  if(!insertionInfo.acknowledged) throw Error('Insertion Failed');

  const userCollection = await users();
  const user = await userCollection.updateOne({_id: organizerId}, {$push: {eventsPosted: insertionInfo.insertedId}})

  const newEvent = await eventCollection.findOne({_id: insertionInfo.insertedId});

  return newEvent;
};

export const updateEventComments = async (eventId, userId, text) => {
  //TODO: Validation

  if (!eventId || !userId || !text){
    throw "Error: Values cannot be empty!"
  }
  if (typeof eventId !== 'string' || typeof userId !== 'string' || typeof text !== 'string'){
    throw "Error: All types must be string!"
  }
  userId = userId.trim();
  eventId = eventId.trim();
  text = text.trim();

  if (length(userId) == 0 || length(eventId) == 0 || length(text) == 0){
    throw "Error: Values must not be empty or spaces!"
  }
  eventId = new ObjectId(eventId);
  userId = new ObjectId(userId);

  const eventCollection = await events();

  const event = await eventCollection.findOneAndUpdate({_id: eventId}, {$push: {comments: {userId, text}}});

  return event;
};

export const updateEventAttendees = async (eventId, userId) => {
  //TODO: Validation

  if (!eventId || !userId){
    throw "Error: Values cannot be empty!"
  }
  if (typeof eventId !== 'string' || typeof userId !== 'string'){
    throw "Error: All types must be string!"
  }
  userId = userId.trim();
  eventId = eventId.trim();

  if (length(userId) == 0 || length(eventId) == 0){
    throw "Error: Values must not be empty or spaces!"
  }

  const eventCollection = await events();

  eventId = new ObjectId(eventId);
  userId = new ObjectId(userId);

  const event = await eventCollection.findOneAndUpdate({_id: eventId}, {$push: {attendees: userId}});
  return event;
};

export const updateEventLikes = async (eventId) => {
  //TODO: Validation
  if (!eventId){
    throw "Error: EventId must be provided!";
  }

  if (typeof eventId !== 'string'){
    throw "Error: EventId must be a string!";
  }

  eventId = eventId.trim();
  if (length(eventId) == 0){
    throw "Error: EventId cannot just be spaces!";
  }

  const eventCollection = await events();
  const events = await eventCollection.findOneAndUpdate({_id: eventId}, {$inc: {likes}});
};

export const getEvents = async () => {
  const eventCollection = await events();
  const eventList = await eventCollection.find({}).limit(5).toArray();

  return eventList;
}

export const getEventById = async (eventId) => {
  //TODO: Validation
  if (!eventId){
    throw "Error: EventId must be provided!";
  }

  if (typeof eventId !== 'string'){
    throw "Error: EventId must be a string!";
  }

  eventId = eventId.trim();
  if (length(eventId) == 0){
    throw "Error: EventId cannot just be spaces!";
  }
  
  eventId = new ObjectId(eventId);

  const eventCollection = await events();
  const event = await eventCollection.findOne({_id: eventId});

  if(!event) throw Error('Event Not Found');

  return event;
}

export const getEventsByTag = async (tag) => {
  const eventCollection = await events();

  const eventsFound = await eventCollection.find({tags: tag}).toArray();
    
  if(eventsFound.length === 0) throw Error('No Events Found');

  return eventsFound;
};