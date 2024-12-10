import { attendeePosts } from '../config/mongoCollections.js';
import { users } from '../config/mongoCollections.js';

const createPost = async (userName, photo, description) => {
  if (!description && !photo) throw new Error('Post must include a description or photo');
  
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
  await userCollection.updateOne({username: userName}, {$push: {posts: newPost}});
  //const user = await userCollection.findOne({ username: userName });
  //user.posts.append(newPost);
  return {registrationCompleted: true};
};

export { createPost };
