import { events } from '../config/mongoCollections.js';
import * as validation from '../validation.js';

export const createEvent = async (name, address, date, time, description, price, familyFriendly, tags, organizerId) => {

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
    rating: 0
  }

  const eventCollection = await events();
  const insertionInfo = await eventCollection.insertOne(event);

  if(!insertionInfo.acknowledged) throw Error('Insertion Failed');

  const newEvent = await eventCollection.findOne({_id: insertionInfo.insertedId});

  return newEvent;
};

export const updateEventComments = async (eventId, userId, text) => {
  const eventCollection = await events();
  const event = await eventCollection.findOneAndUpdate({_id: eventId}, {$push: {comments: {userId, text}}});

  return event;
};

export const updateEventAttendees = async (eventId, userId) => {
  const eventCollection = await events();

  const event = await eventCollection.findOneAndUpdate({_id: eventId}, {$push: {attendees: userId}});
  return event;
};

export const updateEventRatings = async (eventId) => {
  const eventCollection = await events();
  const events = await eventCollection.findOneAndUpdate({_id: eventId}, {$inc: {eventRatings}});
};

export const getEvents = async () => {
  const eventCollection = await events();
  const eventList = await eventCollection.find({}).limit(5).toArray();

  return eventList;
}

export const getEventsByTag = async (tag) => {
  const eventCollection = await events();

  const events = await eventCollection.findOne({_id: id});
    
  if(!events) throw Error('Events Not Found');

  return events;
};