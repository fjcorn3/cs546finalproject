import { events } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { validEvent, validEventFields } from '../validation.js';

const exportedMethods = {

  async getAllEvents() {
    const eventCollection = await events();
    const eventList = await eventCollection.find({}).toArray();
    return eventList;
  },

  async getEventById(id) {
    if(!id || !ObjectId.isValid(id)) throw Error('Invalid Object Id');
    id = ObjectId(id);

    const eventCollection = await events();
    const event = await eventCollection.findOne({_id: id});
    
    if(!event) throw Error('Event Not Found');
    return event;
  },

  async addEvent(event) {
    if(!validEvent(event)) throw Error('Invalid Event');

    event.comments = [];
    event.attendees = [];
    event.likes = [];

    const eventCollection = await events();
    const insertionInfo = await eventCollection.insertOne(event);

    if(!insertionInfo.acknowledged) throw Error('Insertion Failed');
    
    const newEvent = await eventCollection.findOne({_id: insertionInfo.insertedId});

    return newEvent; 
  },

  async removeEvent(id) {
    if(!id || !ObjectId.isValid(id)) throw Error('Invalid Object Id');
    id = ObjectId(id);

    const eventCollection = await events();
    const event = await eventCollection.findOneAndDelete({_id: id});

    if(!event) throw Error('Deletion Failed');
    
    //TODO: need to remove comments on post from comment and user collections
    //TODO: need to remove event from attended events in user collections

    return event;
  },

  async updateEvent(id, fields) {
    if(!id || !ObjectId.isValid(id)) throw Error('Invalid Object Id');
    id = ObjectId(id);

    if(!validEventFields(fields)) throw Error('Invalid Fields for Event');

    const eventCollection = await events();
    const event = await eventCollection.findOneAndReplace(
      {_id: id},
      fields,
      {returnDocument: 'after'}
    );

    if(!event) throw Error('Update Failed');

    return event;
  }
};

export default exportedMethods;