import { ObjectId, ReturnDocument } from 'mongodb';
import { events, users } from '../config/mongoCollections.js';
import * as validation from '../validation.js';

export const createEvent = async (name, address, date, time, description, price, familyFriendly, tags, organizerId) => {
  if(!validation.validEventName(name)) throw "Invalid Name"; //name

  name = name.trim();

  if (typeof address !== 'string'){ //address
    throw "Error: Address must be of type String!";
  }
  if (typeof description !== 'string'){ //description
    throw "Error: Description must be of type String!";
  }
  if (!Array.isArray(tags)){ //tags
    throw "Error: Tags must be an array!";
  }
    
  address = address.trim();
  description = description.trim();

  if (address.length === 0){
    throw "Error: Address is empty!";
  }
  if (description.length === 0){
    throw "Error: Description is empty!";
  }

  if (tags.length === 0){
    throw "Error: Tags cannot be empty!";
  }

  tags.forEach(tag => {
    if (typeof tag !== 'string'){
      throw "Each tag in Tags must be of type string!";
    }
    tag = tag.trim();
    if (tag.length === 0){
      throw "Error: Atleast one tag is empty!";
    }
  });

  if (typeof price !== 'number'){ //price
    throw "Error: Price must be a number!";
  }

  if (typeof familyFriendly !== 'boolean'){ //familyFriendly
    throw "Error: familyFriendly must be true or false!";
  }

  if (!validation.validDate(date)) throw "Invalid date! Proper Format: YYYY-MM-DD";
  if (!validation.validTime(time)) throw "Invalid time! Proper format: HH:MM";

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
    likes: 0,
    likedBy: []
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

  const event = await eventCollection.findOneAndUpdate({_id: eventId}, {$push: {comments: {userId, text, date:new Date()}}}, {returnDocument: 'after'});

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

  const eventCollection = await events();
  const event = await eventCollection.findOneAndUpdate({_id: eventId}, {$push: {attendees: userId}});
  return event;
};

export const updateEventLikes = async (eventId) => {
  if (!ObjectId.isValid(eventId)){
    throw "Error: Valid EventId must be provided!";
  }

  eventId = new ObjectId(eventId);

  const eventCollection = await events();
  const event = await eventCollection.findOneAndUpdate({_id: eventId}, {$inc: {likes: 1}}, {ReturnDocument: 'after'});

  if (!event.value){
    throw Error('Event Not Found');
  }
  return event.value;
};

export const getEvents = async () => {
  const eventCollection = await events();
  const eventList = await eventCollection.find({}).toArray();

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

export const getEventsByIds = async (eventIds) => {
  if (!Array.isArray(eventIds)) {
    throw "Error: Event IDs must be provided as an array.";
  }

  const objectIds = eventIds.map((id) => {
    if (!ObjectId.isValid(id)) {
      throw `Error: Invalid ObjectId provided - ${id}`;
    }
    return new ObjectId(id);
  });

  const eventCollection = await events();
  const eventsFound = await eventCollection.find({ _id: { $in: objectIds } }).toArray();

  return eventsFound;
};

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