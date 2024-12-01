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
    
    if(!comment) throw Error('Comment Not Found');
    return comment;
  },

  async addComment(comment) {
    if(!validComment(comment)) throw Error('Invalid Comment');

    const commentCollection = await comments();
    const insertionInfo = await commentCollection.insertOne(comment);

    if(!insertionInfo.acknowledged) throw Error('Insertion Failed');
    
    //TODO: Need to update user record and event record to include id of comment

    const newComment = await commentCollection.findOne({_id: insertionInfo.insertedId});

    return newComment; 
  },

  async removeComment(id) {
    if(!id || !ObjectId.isValid(id)) throw Error('Invalid Object Id');
    id = ObjectId(id);

    const commentCollection = await comments();
    const comment = await commentCollection.findOneAndDelete({_id: id});

    if(!comment) throw Error('Deletion Failed');

    //TODO: Need to update user record and event record to remove id of comment

    return comment;
  },

  async updateComment(id, fields) {
    if(!id || !ObjectId.isValid(id)) throw Error('Invalid Object Id');
    id = ObjectId(id);

    if(!validCommentFields(fields)) throw Error('Invalid Fields for Comment');

    const commentCollection = await comments();
    const comment = await commentCollection.findOneAndReplace(
      {_id: id},
      fields,
      {returnDocument: 'after'}
    );

    if(!comment) throw Error('Update Failed');

    return comment;
  }
};

export default exportedMethods;