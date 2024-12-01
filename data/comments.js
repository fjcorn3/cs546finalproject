import { comments } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { validComment, validCommentFields } from '../validation.js';

const exportedMethods = {

  async getAllComments() {
    const commentCollection = await comments();
    const commentList = await commentCollection.find({}).toArray();
    return commentList;
  },

  async getCommentById(id) {
    if(!id || !ObjectId.isValid(id)) throw Error('Invalid Object Id');
    id = ObjectId(id);

    const commentCollection = await comments();
    const comment = await commentCollection.findOne({_id: id});
    
    if(!comment) throw Error('User Not Found');
    return comment;
  },

  async addComment(comment) {
    if(!validComment(comment)) throw Error('Invalid Event');

    const commentCollection = await comments();
    const insertionInfo = await commentCollection.insertOne(comment);

    if(!insertionInfo.acknowledged) throw Error('Insertion Failed');
    
    const newComment = await commentCollection.findOne({_id: insertionInfo.insertedId});

    return newComment; 
  },

  async removeComment(id) {
    if(!id || !ObjectId.isValid(id)) throw Error('Invalid Object Id');
    id = ObjectId(id);

    const commentCollection = await comments();
    const comment = await commentCollection.findOneAndDelete({_id: id});

    if(!comment) throw Error('Deletion Failed');

    return comment;
  },

  async updateComment(id, fields) {
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