CS546 Final Project


DB schema:

users {
  _id: ObjectId,
  name: string,
  email: string,
  username: string,
  password: string,
  phoneNumber: string,
  age: number,
  comments: Array,
  eventsAttended: Array,
  eventsFavorited: Array,
  organizerInfo: {
    organization: string,
    eventsPosted: Array
  } 
}

events {
  _id: ObjectId,
  name: string,
  address: string,
  description: string,
  price: number,
  familyFriendly: boolean,
  tags: Array,
  comments: Array,
  attendees: Array
}

comments {
  _id: ObjectId,
  userId: ObjectId,
  eventId: eventId,
  text: string
}