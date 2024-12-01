import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { validUser, validUserFields } from '../validation.js';

import bcrypt from 'bcryptjs';

let exportedMethods = {
  async getAllUsers() {
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    return userList;
  },

  async getUserById(id) {
    if(!id || !ObjectId.isValid(id)) throw Error('Invalid Object Id');
    id = ObjectId(id);

    const userCollection = await users();
    const user = await userCollection.findOne({_id: id});
    
    if(!user) throw Error('User Not Found');
    return user;
  },

  async addUser(user) {
    if(!validUser(user)) throw Error('Invalid User');

    user.password = await bcrypt.hash(user.password, 10);

    const userCollection = await users();
    const insertionInfo = await userCollection.insertOne(user);

    if(!insertionInfo.acknowledged) throw Error('Insertion Failed');
  
    const newUser = await userCollection.findOne({_id: insertionInfo.insertedId});
    
    return newUser;
  },
  
  async removeUser(id) {
    if(!id || !ObjectId.isValid(id)) throw Error('Invalid Object Id');
    id = ObjectId(id);

    const userCollection = await users();
    const user = await userCollection.findOneAndDelete({_id: id});

    if(!user) throw Error('Deletion Failed');

    return user;
  },

  async updateUser(id, fields) {
    if(!id || !ObjectId.isValid(id)) throw Error('Invalid Object Id');
    id = ObjectId(id);

    if(!validUserFields(fields)) throw Error('Invalid fields for User');

    const userCollection = await users();
    const user = await userCollection.findOneAndReplace(
      {_id: id},
      fields,
      {returnDocument: 'after'}
    );

    if(!user) throw Error('Update Failed');

    return user;
  }
};

export default exportedMethods;