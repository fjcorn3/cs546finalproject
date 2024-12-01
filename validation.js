import { ObjectId } from "mongodb";

export const validUser = (user) => {
  if(!user.name || typeof user.name !== 'string' || user.name.trim().length === 0) return false;
  if(!user.email || typeof user.email !== 'string' || user.email.trim().length === 0) return false;
  if(!user.username || typeof user.username !== 'string' || user.username.trim().length === 0) return false;
  if(!user.password || typeof user.password !== 'string' || user.password.trim().length === 0) return false;
  if(!user.phoneNumber || typeof user.phoneNumber !== 'string' || user.phoneNumber.trim().length === 0) return false;
  if(!user.age || typeof user.age !== 'number' || user.age > 100 || user.age < 0) return false;

  return true;
};

export const validUserFields = (user) => {
  if(user.name && (typeof user.name !== 'string' || user.name.trim().length === 0)) return false;
  if(user.email && (typeof user.email !== 'string' || user.email.trim().length === 0)) return false;
  if(user.username && (typeof user.username !== 'string' || user.username.trim().length === 0)) return false;
  if(user.password && (typeof user.password !== 'string' || user.password.trim().length === 0)) return false;
  if(user.phoneNumber && (typeof user.phoneNumber !== 'string' || user.phoneNumber.trim().length === 0)) return false;
  if(user.age && (typeof user.age !== 'number' || user.age > 100 || user.age < 1)) return false;

  return true;
};

export const validEvent = (event) => {
  if(!event.name || typeof event.name !== 'string' || event.name.trim().length === 0) return false;
  if(!event.address || typeof event.address !== 'string' || event.address.trim().length === 0) return false;
  if(!event.description || typeof event.description !== 'string' || event.description.trim().length === 0) return false;
  if(!event.price || typeof event.price !== 'number' || event.price < 0) return false;
  if(!event.familyFriendly|| typeof event.familyFriendly !== 'boolean') return false;
  if(!event.tags || !Array.isArray(event.tags) || event.tags.any((tag) => typeof tag !== 'string')) return false;

  return true;
};

export const validEventFields = (event) => {
  if(event.name && (typeof event.name !== 'string' || event.name.trim().length === 0)) return false;
  if(event.address && (typeof event.address !== 'string' || event.address.trim().length === 0)) return false;
  if(event.description && (typeof event.description !== 'string' || event.description.trim().length === 0)) return false;
  if(event.price && (typeof event.price !== 'number' || event.price < 0)) return false;
  if(event.familyFriendly && (typeof event.familyFriendly !== 'boolean')) return false;
  if(event.tags && (!Array.isArray(event.tags) || event.tags.any((tag) => typeof tag !== 'string'))) return false;

  return true;
};

export const validComment = (comment) => {
  if(!comment.eventId || !ObjectId.isValid(comment.eventId)) return false;
  if(!comment.userId || !ObjectId.isValid(comment.userId)) return false;
  if(!comment.text || typeof comment.text !== 'string' || comment.text.trim().length === 0) return false;

  return true;
};

export const validCommentFields = (comment) => {
  if(comment.text && (typeof comment.text !== 'string' || comment.text.trim().length === 0)) return false;

  return true;
};