import { users } from '../config/mongoCollections.js';
import bcrypt from 'bcryptjs';
import {ObjectId} from 'mongodb';

const saltRounds = 16;

const createUser = async (firstName, lastName, username, email, role, phoneNumber, age, password) => {
  if (!firstName) {
    throw new Error("You must provide a first name.");
  }
  if (!lastName) {
    throw new Error("You must provide a last name.");
  }
  if (!username) {
    throw new Error("You must provide a username.");
  }
  if (!password) {
    throw new Error("You must provide a password.");
  }
  if (!age) {
    throw new Error("You must provide an age.");
  }
  if (!phoneNumber) {
    throw new Error("You must provide a phone number.");
  }
  if (!role) {
    throw new Error("You must provide a role.");
  }
  if (!email) {
    throw new Error("You must provide an email.");
  }
  if (typeof firstName !== "string") {
    throw new Error("First name must be of type string.");
  }
  if (typeof lastName !== "string") {
    throw new Error("Last name must be of type string.");
  }
  if (typeof username !== "string") {
    throw new Error("Username must be of type string.");
  }
  if (typeof password !== "string") {
    throw new Error("Password must be of type string.");
  }
  if (typeof email !== "string") {
    throw new Error("Email must be of type string.");
  }
  if (typeof phoneNumber !== "string") {
    throw new Error("Phone number must be of type string.");
  }
  if (typeof Number(age) !== "number") {
    throw new Error("Age must be of type number.");
  }
  if (role.trim().toLowerCase() !== "attendee" && role.trim().toLowerCase() !== "organizer") {
    throw new Error("Role must be either attendee or organizer.");
  }
  firstName = firstName.trim()
  lastName = lastName.trim();
  username = username.trim().toLowerCase();
  password = password.trim();
  email = email.trim();
  role = role.trim().toLowerCase();
  if (!/^[A-Za-z]+$/.test(firstName) || firstName.length < 2 || firstName.length > 25){
    throw new Error("First name should be only letters and has to be no less than 2 characters and no more than 25.");
  }
  if (!/^[A-Za-z]+$/.test(lastName) || lastName.length < 2 || lastName.length > 25){
    throw new Error("Last name should be only letters and has to be no less than 2 characters and no more than 25.");
  }
  if (!/^[A-Za-z]+$/.test(username) || username.length < 5 || username.length > 10){
    throw new Error("Username should be only letters and has to be no less than 5 characters and no more than 10.");
  }
  if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)){
    throw new Error("Email must be a valid email address.");
  }
  if (!/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/.test(phoneNumber)){
    throw new Error("Phone number must be valid.");
  }
  if (password.length < 8){
    throw new Error("Password must by at least 8 characters long.");
  }
  if (!/[A-Z]/.test(password)){
    throw new Error("Password must have at least one uppercase letter.");
  }
  if (!/\d/.test(password)){
    throw new Error("Password must have at least one number.");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)){
    throw new Error("Password must have at least one special character.");
  }
  const hashPassword = await bcrypt.hash(password, saltRounds);
  const newUser = {
    firstName,
    lastName,
    username,
    email,
    role,
    phoneNumber,
    age,
    password: hashPassword,
    posts: [],
    favorites: [],
  };
  const userCollection = await users();
  const user = await userCollection.findOne({ username: username });
  if (user){
    throw new Error("You are already a user, you can't sign up.");
  }
  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw new Error('Could not add user');
  }
  return {registrationCompleted: true};
};

const getUserById = async (username, password) => {
  if (!username) {
    throw new Error("You must provide a user ID.");
  }
  if (!password) {
    throw new Error("You must provide a password.");
  }
  if (typeof username !== "string") {
    throw new Error("User ID must be of type string.");
  }
  if (typeof password !== "string") {
    throw new Error("Password must be of type string.");
  }
  username = username.trim().toLowerCase();
  password = password.trim();
  if (!/^[A-Za-z]+$/.test(username) || username.length < 5 || username.length > 10){
    throw new Error("User ID should be only letters and has to be no less than 5 characters and no more than 10.");
  }
  if (password.length < 8){
    throw new Error("Password must by at least 8 characters long.");
  }
  if (!/[A-Z]/.test(password)){
    throw new Error("Password must have at least one uppercase letter.");
  }
  if (!/\d/.test(password)){
    throw new Error("Password must have at least one number.");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)){
    throw new Error("Password must have at least one special character.");
  }
  const userCollection = await users();
  const user = await userCollection.findOne({ username: username });
  if (!user) {
    throw new Error("Either the username or password is invalid.");
  }
  let comparePasswords = await bcrypt.compare(password, user.password);
  if (!comparePasswords){
    throw new Error("Either the username or password is invalid.");
  }
  
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    age: user.age,
    phoneNumber: user.phoneNumber,
    email: user.email,
    role: user.role
  }
};



export { createUser, getUserById };
