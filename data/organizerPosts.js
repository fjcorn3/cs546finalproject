import { organizerPosts } from '../config/mongoCollections.js';
import { users } from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

const createEvent = async (userName, photo, description, headCount, time, date, location, rsvpForm) => {
  if (!description && !photo) throw new Error('Post must include a description or photo');

  if(!userName) throw "must provide username";
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

  if(headCount){
    if(typeof headCount !== "string") throw "improper head count";
    headCount = headCount.trim();
    if(!(/^\d+$/.test(headCount))) throw "improper head count";
  }

  if(time){
    if(typeof time !== 'string') throw "imporper time";
    time = time.trim();
    if(!(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(time))) throw "improper time";
  }

  if(date){
    if(typeof date !== "string") throw "improper date";
    date = date.trim();
    if(!(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(date))) throw "improper date";
    
    //makes sure that the date is not in the past
    let dateParts = date.split("/");
    let dateNow = new Date(dateParts[2], (dateParts[0] - 1), dateParts[1]);
    let dateComp = new Date();
    if (dateNow < dateComp) {
        throw "improper date";
    }
  }

  if(location){
    if(typeof location !== 'string') throw "improper location";
    location = location.trim();
    if(location.length < 1) throw "empty string for location";

  }

  if(rsvpForm){
    if(typeof rsvpForm !== 'string') throw "improper rsvp selection";

    rsvpForm = rsvpForm.trim();
    if(rsvpForm !== "yes" && rsvpForm !== "no") throw "improper rsvp form selection";
  }
  
  
  const organizerPostCollection = await organizerPosts();
  const newEvent = {
    userName,
    photo,
    description,
    headCount,
    time,
    date,
    location,
    rsvpForm,
    createdAt: new Date(),
    comments: [],
    rating: []
  };

  const insertInfo = await organizerPostCollection.insertOne(newEvent);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw new Error('Could not create event');
  }
  const userCollection = await users();
  const updating = await userCollection.updateOne({username: userName}, {$push: {posts: newEvent}});
  
  if (updating.matchedCount <= 0 || updating.modifiedCount <= 0) throw "could not uplaod post";
  
  //const user = await userCollection.findOne({ username: userName });
  //user.posts.append(newEvent);
  return true;
};

const updatePost = async (id, userName, photo, description, headCount, time, date, location, rsvpForm) => {
  if(!id) throw "no id is provided.";
  if(typeof id !== "string") throw "id is not of proper type.";
  if(id.trim() === "") throw "empty id or only contains spaces.";
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'invalid object ID';

  if (!description && !photo) throw new Error('Post must include a description or photo');
  
  if(!userName) throw "must provide username";
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

  if(headCount){
    if(typeof headCount !== "string") throw "improper head count";
    headCount = headCount.trim();
    if(!(/^\d+$/.test(headCount))) throw "improper head count";
  }

  if(time){
    if(typeof time !== 'string') throw "imporper time";
    time = time.trim();
    if(!(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(time))) throw "improper time";
  }

  if(date){
    if(typeof date !== "string") throw "improper date";
    date = date.trim();
    if(!(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(date))) throw "improper date";
    
    //makes sure that the date is not in the past
    let dateParts = date.split("/");
    let dateNow = new Date(dateParts[2], (dateParts[0] - 1), dateParts[1]);
    let dateComp = new Date();
    if (dateNow < dateComp) {
        throw "improper date";
    }
  }

  if(location){
    if(typeof location !== 'string') throw "improper location";
    location = location.trim();
    if(location.length < 1) throw "empty string for location";

  }

  if(rsvpForm){
    if(typeof rsvpForm !== 'string') throw "improper rsvp selection";

    rsvpForm = rsvpForm.trim();
    if(rsvpForm !== "yes" && rsvpForm !== "no") throw "improper rsvp form selection";
  }

  //if(!Array.isArray(comments)) throw "improper comments";
  //if(!Array.isArray(rating)) throw "improper comments";


  const update = {
    userName,
    photo,
    description,
    headCount,
    time,
    date,
    location,
    rsvpForm,
    createdAt: new Date()
    //comments: comments,
    //rating: rating
  }

  const organizerPostCollection = await organizerPosts();
  const newInfo = await organizerPostCollection.findOneAndUpdate(
    {_id: ObjectId.createFromHexString(id)},
    {$set: update},
    {returnDocument: 'after'}
  );
  if (!newInfo) {
    throw "could not update post successfully";
  }

  return newInfo;
};

const deletePost = async (id) => {
  if(!id) throw "no id is provided.";
  if(typeof id !== "string") throw "id is not of proper type.";
  if(id.trim() === "") throw "empty id or only contains spaces.";
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'invalid object ID';

  const userCollection = await users();

  let post = {};
  
  try{
    post = await userCollection.findOne({"posts._id": ObjectId.createFromHexString(id)});
  }catch(e){
    "could not find post";
  }
  try{
  await userCollection.updateOne(
    {_id: post._id},
    {$pull: {posts: {_id:  ObjectId.createFromHexString(id)}}});
  }catch(e){
    throw "could not remove post";
  }

  const organizerPostCollection = await organizerPosts();
  //FIXX LIKE ABOVE 
  //const teamName = team.name//fidn the name of the team using this
  const deletionInfo = await organizerPostCollection.findOneAndDelete({
    _id: ObjectId.createFromHexString(id)
    });

    if (!deletionInfo) {
      throw `Could not delete post with id of ${id}`;
    }
return true;
};

const getAllPost = async () => {
  const organizerPostCollection = await organizerPosts();

  let postsList;

  try{

    postsList = await organizerPostCollection.find({}).toArray();}
  catch(e){
    throw "could not get posts";
  }


  return postsList;
}

const addComment = async (id, userName, comment) =>{
  if(!id) throw "no id is provided.";
  if(typeof id !== "string") throw "id is not of proper type.";
  if(id.trim() === "") throw "empty id or only contains spaces.";
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'invalid object ID';

  if(!userName) throw "must provide username";
  if(typeof userName !== 'string') throw "improper username";
  userName = userName.trim().toLowerCase();
  if(!userName) throw "must provide username";


  if(!comment) throw "must provide comment";
  if(typeof comment !== 'string') throw "improper comment";
  comment = comment.trim().toLowerCase();
  if(!comment) throw "must provide comment";

  let post;

  try{
  const organizerPostCollection = await organizerPosts();
  const updating = await organizerPostCollection.updateOne({_id: ObjectId.createFromHexString(id)}, {$push: {comments: comment}});
  if (updating.matchedCount <= 0 || updating.modifiedCount <= 0) throw "could not upload comment";
}catch(e){
  throw "could not upload comment";
}
return true;

}

const addRate = async (id, userName, rate) =>{
  if(!id) throw "no id is provided.";
  if(typeof id !== "string") throw "id is not of proper type.";
  if(id.trim() === "") throw "empty id or only contains spaces.";
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'invalid object ID';

  if(!userName) throw "must provide username";
  if(typeof userName !== 'string') throw "improper username";
  userName = userName.trim().toLowerCase();
  if(!userName) throw "must provide username";

  if(!rate) throw "must provide rate";
  if(!(/^\d+$/.test(rate))) throw "rate must be a number";



  try{
  const organizerPostCollection = await organizerPosts();
  const updating = await organizerPostCollection.updateOne({_id: ObjectId.createFromHexString(id)}, {$push: {rating: Number(rate)}});
  if (updating.matchedCount <= 0 || updating.modifiedCount <= 0) throw "could not upload comment";
}catch(e){
  throw "could not upload comment";
}
return true;

}

export{ createEvent, updatePost,  deletePost,  getAllPost, addComment, addRate};
