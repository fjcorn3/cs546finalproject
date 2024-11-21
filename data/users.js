import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import validation from '../validation.js';

let exportedMethods = {

  async getAllUsers() {
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    return userList;
  },

  async getUserById(id) {
    id = validation.checkId(id);
    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(id)});
    if (!user) throw 'Error: User not found';
    return user;
  },

  async addUser(firstName, lastName) {
    //TODO
  },
  
  async removeUser(id) {
    //TODO
  },

  async updateUserPut(id, firstName, lastName) {
    //TODO
  },

  async updateUserPatch(id, userInfo) {
    //TODO
  }
};

export default exportedMethods;