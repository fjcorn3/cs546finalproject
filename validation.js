import { ObjectId } from "mongodb";

export const validUser = (user) => {
  //   if(!user.name || typeof user.name !== 'string') return false;
  //   if(!user.email || typeof user.email !== 'string') return false;
  //   if(!user.role || typeof user.role !== 'string') return false;
  //   if(!user.age || typeof user.age !== 'number') return false;
  // "phoneNumber": 123456789,
  // "profilePic": "/public/img.jpeg",
  // "password": "f994f14ae2f263357ee7aa7a08d3c4e6ae5af1fdcf30a6e538e46758f43e4727",
  // "comments": ["3edr-fg3245tg4wev", "2red356-vgw4yg-r"],
  // "organizerData": {},
  // "attendeeData": {}

  return true;
};

export const validUserFields = (user) => {
  // TODO
  return true;
};

export const validEvent = (event) => {
  // if(!event.name || typeof event.name !== 'string' || event.name.trim().length()) return false;
  // if(!event.address || typeof event.address !== 'string') return false;
  // if(!event.familyFriendly || typeof event.familyFriendly !== 'boolean') return false;
  // if(!event.tags || !Array.isArray(event.tags)) return false;
  // if(!event.attendees || !Array.isArray(event.attendees)) return false;
  // if(!event.size || typeof event.size !== 'number') return false;
  // if(!event.price || typeof event.price !== 'number' || event.price < 0) return false;

  // if(event.tags.any((tag) => typeof tag !== 'string')) return false;
  // if(event.attendees.any((attendee) => !ObjectId.isValid()))
  return true;
};

export const validEventFields = (event) => {
  // TODO
  return true;
};