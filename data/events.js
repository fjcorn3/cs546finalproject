import { events } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

import userData from './users.js';
import validation from '../validation.js';

const exportedMethods = {

  async getAllEvents() {
    const eventCollection = await events();
    return await eventCollection.find({}).toArray();
  },

  async getEventById(id) {
    id = validation.checkId(id);
    
    const eventCollection = await events();
    const event = await eventCollection.findOne({_id: new ObjectId(id)});
    if (!event) throw 'Error: Event not found';

    return event;
  },

  async addEvent(title, body, posterId, tags) {
    // TODO
  },

  async removeEvent(id) {
    // TODO
  },

  async updatePostPatch(id, updatedPost) {
    // TODO
  }
};

export default exportedMethods;