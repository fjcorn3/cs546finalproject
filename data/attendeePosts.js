import { attendeePosts } from '../config/mongoCollections.js';
import { users } from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

const createPost = async (userName, photo, description) => {
  if (!description && !photo) throw new Error('Post must include a description or photo');

  if(typeof userName !== 'string') throw "improper username";
  userName = userName.trim().toLowerCase();
  
  if(photo){
    if(typeof photo !== 'string') throw "improper photo";
    photo = photo.trim();
    if(!(/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(photo))) throw "improper image";
  }
  
  if(description){
    if(typeof description !== 'string') throw "improper description";
    description = description.trim();
    if(description.length < 1) throw "empty string for description";
  }
  
  const attendeePostCollection = await attendeePosts();
  const newPost = {
    userName,
    photo,
    description,
    createdAt: new Date(),
  };

  const insertInfo = await attendeePostCollection.insertOne(newPost);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw new Error('Could not create post');
  }
  const userCollection = await users();
  const updating = await userCollection.updateOne({username: userName}, {$push: {posts: newPost}});
  
  if (updating.matchedCount <= 0 || updating.modifiedCount <= 0) throw "could not uplaod post";

  //const user = await userCollection.findOne({ username: userName });
  //user.posts.append(newPost);
  return true;
};

// const updatePost = async (id, userName, photo, description) => {
//   if(!id) throw "no id is provided.";
//   if(typeof id !== "string") throw "id is not of proper type.";
//   if(id.trim() === "") throw "empty id or only contains spaces.";
//   id = id.trim();
//   if (!ObjectId.isValid(id)) throw 'invalid object ID';

//   if (!description && !photo) throw new Error('Post must include a description or photo');

//   if(typeof userName !== 'string') throw "improper username";
//   userName = userName.trim().toLowerCase();
  
//   if(photo){
//     if(typeof photo !== 'string') throw "improper photo";
//     photo = photo.trim();
//     if(!(/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(photo))) throw "improper image";
//   }
  
//   if(description){
//     if(typeof description !== 'string') throw "improper description";
//     description = description.trim();
//     if(description.length < 1) throw "empty string for description";

    
//   }

//   const update = {
//     username: userName,
//     photo: photo,
//     description: description
//   }

//   const attendeePostCollection = await attendeePosts();
//   const newInfo = await attendeePostCollection.findOneAndUpdate(
//     {_id: ObjectId.createFromHexString(id)},
//     {$set: update},
//     {returnDocument: 'after'}
//   );
//   if (!newInfo) {
//     throw "could not update post successfully";
//   }

//   return newInfo;


// };

// const deletePost = async (id) => {
//   if(!id) throw "no id is provided.";
//   if(typeof id !== "string") throw "id is not of proper type.";
//   if(id.trim() === "") throw "empty id or only contains spaces.";
//   id = id.trim();
//   if (!ObjectId.isValid(id)) throw 'invalid object ID';

//   const userCollection = await users();

//   let post = {};
  
//   try{
//     post = await userCollection.findOne({"posts._id": ObjectId.createFromHexString(id)});
//   }catch(e){
//     "could not find post";
//   }
//   try{
//   await userCollection.updateOne(
//     {_id: post._id},
//     {$pull: {posts: {_id:  ObjectId.createFromHexString(id)}}});
//   }catch(e){
//     throw "could not remove post";
//   }

//   const attendeePostCollection = await attendeePosts();
//   //FIXX LIKE ABOVE 
//   //const teamName = team.name//fidn the name of the team using this
//   const deletionInfo = await attendeePostCollection.findOneAndDelete({
//     _id: ObjectId.createFromHexString(id)
//     });

//     if (!deletionInfo) {
//       throw `Could not delete post with id of ${id}`;
//     }
// return true;
// };

export { createPost};
