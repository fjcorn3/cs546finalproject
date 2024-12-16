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

  organizerId = new ObjectId(organizerId);

  const userCollection = await users();
  const user = await userCollection.updateOne({_id: organizerId}, {$push: {eventsPosted: insertionInfo.insertedId}})

  const newEvent = await eventCollection.findOne({_id: insertionInfo.insertedId});

  return newEvent;
};

export const updateEventComments = async (eventId, userId, text) => {
  if (!ObjectId.isValid(eventId)){
    throw "Error: Valid EventId must be provided!";
  }

  if (!ObjectId.isValid(userId)){
    throw "Error: Valid EventId must be provided!";
  }

  eventId = new ObjectId(eventId);
  userId = new ObjectId(userId);

  if (!text){
    throw "Error: Values cannot be empty!"
  }

  if (typeof text !== 'string'){
    throw "Error: All types must be string!"
  }

  text = text.trim();

  if (text.length == 0){
    throw "Error: Values must not be empty or spaces!"
  }

  const eventCollection = await events();

  const event = await eventCollection.findOneAndUpdate({_id: eventId}, {$push: {comments: {userId, text}}});

  return event;
};

export const updateEventAttendees = async (eventId, userId) => {
  if (!ObjectId.isValid(eventId)){
    throw "Error: Valid EventId must be provided!";
  }

  if (!ObjectId.isValid(userId)){
    throw "Error: Valid EventId must be provided!";
  }

  eventId = new ObjectId(eventId);
  userId = new ObjectId(userId);

  const event = await eventCollection.findOneAndUpdate({_id: eventId}, {$push: {attendees: userId}});
  return event;
};

export const updateEventLikes = async (eventId) => {
  if (!ObjectId.isValid(eventId)){
    throw "Error: Valid EventId must be provided!";
  }

  eventId = new ObjectId(eventId);

  const eventCollection = await events();
  const events = await eventCollection.findOneAndUpdate({_id: eventId}, {$inc: {likes}});
};

export const getEvents = async () => {
  const eventCollection = await events();
  const eventList = await eventCollection.find({}).limit(5).toArray();

  return eventList;
}

export const getEventById = async (eventId) => {
  if (!ObjectId.isValid(eventId)){
    throw "Error: Valid EventId must be provided!";
  }
  eventId = new ObjectId(eventId);

  const eventCollection = await events();
  const event = await eventCollection.findOne({_id: eventId});

  if(!event) throw Error('Event Not Found');

  return event;
}

export const getEventsByTag = async (tag) => {
  if (!tag){
    throw "Error: Tag must be provided!";
  }
  if (typeof tag !== 'string'){
    throw "Error: Tag must be a string!";
  }

  tag = tag.trim();
  if (tag.length == 0){
    throw "Error: Tag must not be just spaces!";
  }

  const eventCollection = await events();

  const eventsFound = await eventCollection.find({tags: tag}).toArray();
    
  if(eventsFound.length === 0) throw Error('No Events Found');

  return eventsFound;
};