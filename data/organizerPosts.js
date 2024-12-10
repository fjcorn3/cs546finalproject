import { organizerPosts } from '../config/mongoCollections.js';
import { users } from '../config/mongoCollections.js';

const createEvent = async (userName, photo, description, headCount, time, date, location, rsvpForm) => {
  if (!description && !photo) throw new Error('Post must include a description or photo');

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
    rating: [],
  };

  const insertInfo = await organizerPostCollection.insertOne(newEvent);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw new Error('Could not create event');
  }
  const userCollection = await users();
  await userCollection.updateOne({username: userName}, {$push: {posts: newEvent}});
  //const user = await userCollection.findOne({ username: userName });
  //user.posts.append(newEvent);
  return {registrationCompleted: true};
};

export { createEvent };
