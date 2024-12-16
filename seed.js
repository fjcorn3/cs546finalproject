import {dbConnection, closeConnection} from './config/mongoConnection.js';
import * as users from './data/users.js';
import * as eventData from './data/events.js';

const db = await dbConnection();
await db.dropDatabase();

const seedUsers = 
[
  {
    "firstName": "Frankie",
    "lastName": "Cornacchiulo",
    "username": "fcornacc",
    "email": "fcornacc@stevens.edu",
    "role": "organizer",
    "phoneNumber": "201-555-5555",
    "age": 21,
    "password": "Pass123!",
  },
  {
    "firstName": "John",
    "lastName": "Smith",
    "username": "jsmith",
    "email": "jsmith@gmail.com",
    "role": "attendee",
    "phoneNumber": "201-555-7891",
    "age": 39,
    "password": "secretK3y!",
  },
];

for(let i = 0; i < seedUsers.length; i++) {
  await users.createUser(seedUsers[i].firstName, seedUsers[i].lastName, seedUsers[i].username, seedUsers[i].email, seedUsers[i].role, seedUsers[i].phoneNumber, seedUsers[i].age, seedUsers[i].password);
}

const organizer = await users.getUser(seedUsers[0].username, seedUsers[0].password);
const attendee = await users.getUser(seedUsers[1].username, seedUsers[1].password);

const seedComments = 
[
  "Had a great time! Looking forward to the next one.",
  "The event was well-organized and enjoyable.",
  "Loved the atmosphere and the activities offered.",
  "Great for families! My kids had so much fun.",
  "It was a bit crowded, but still a fantastic experience.",
  "The venue was perfect for this event.",
  "Really appreciated the friendly staff and volunteers.",
  "The pricing was reasonable for what was offered.",
  "Could use better signage for directions, but overall a nice event.",
  "The event exceeded my expectations. Highly recommend!"
];

const seedEvents =
[
  {
    "name": "Central Park Summer Picnic",
    "address": "Central Park, New York, NY 10024",
    "date": "2024-06-15",
    "time": "12:00 PM",
    "location": "Central Park",
    "description": "A relaxing picnic event with live music and games for families.",
    "price": 0,
    "familyFriendly": true,
    "tags": ["outdoors", "family", "picnic"],
  },
  {
    "name": "Brooklyn Art Walk",
    "address": "DUMBO, Brooklyn, NY 11201",
    "date": "2024-07-10",
    "time": "5:00 PM",
    "location": "DUMBO",
    "description": "Explore the vibrant art scene of Brooklyn with a guided art walk.",
    "price": 0,
    "familyFriendly": true,
    "tags": ["art", "culture", "walking tour"]
  },
  {
    "name": "Queens Food Festival",
    "address": "Flushing Meadows-Corona Park, Queens, NY 11368",
    "date": "2024-08-20",
    "time": "11:00 AM",
    "location": "Flushing Meadows-Corona Park",
    "description": "A culinary celebration featuring dishes from around the world.",
    "price": 5.00,
    "familyFriendly": true,
    "tags": ["food", "festival", "family"]
  },
  {
    "name": "Hudson River Movie Night",
    "address": "Pier 46, New York, NY 10014",
    "date": "2024-07-25",
    "time": "8:30 PM",
    "location": "Hudson River Park",
    "description": "An open-air movie screening by the river. Bring your blankets!",
    "price": 2.00,
    "familyFriendly": true,
    "tags": ["movies", "outdoors", "family"]
  },
  {
    "name": "Manhattan Book Fair",
    "address": "Union Square, New York, NY 10003",
    "date": "2024-09-10",
    "time": "10:00 AM",
    "location": "Union Square",
    "description": "Discover new authors, books, and stories at this outdoor book fair.",
    "price": 0,
    "familyFriendly": true,
    "tags": ["books", "reading", "fair"]
  },
  {
    "name": "Jazz Night at the Plaza",
    "address": "The Plaza Hotel, 768 5th Ave, New York, NY 10019",
    "date": "2024-06-20",
    "time": "7:00 PM",
    "location": "The Plaza Hotel",
    "description": "An evening of classic jazz performances in a luxurious setting.",
    "price": 10.00,
    "familyFriendly": false,
    "tags": ["music", "jazz", "luxury"]
  },
  {
    "name": "Staten Island Zoo Day",
    "address": "614 Broadway, Staten Island, NY 10310",
    "date": "2024-07-08",
    "time": "9:00 AM",
    "location": "Staten Island Zoo",
    "description": "A day of fun and learning at the Staten Island Zoo.",
    "price": 20.00,
    "familyFriendly": true,
    "tags": ["animals", "zoo", "family"]
  },
  {
    "name": "Chelsea Gallery Crawl",
    "address": "Chelsea, New York, NY 10001",
    "date": "2024-06-30",
    "time": "6:00 PM",
    "location": "Chelsea",
    "description": "Explore contemporary art galleries in the Chelsea neighborhood.",
    "price": 8.00,
    "familyFriendly": false,
    "tags": ["art", "gallery", "culture"]
  },
  {
    "name": "Coney Island Kite Festival",
    "address": "Coney Island, Brooklyn, NY 11224",
    "date": "2024-07-15",
    "time": "10:00 AM",
    "location": "Coney Island",
    "description": "A colorful display of kites on the Coney Island beach.",
    "price": 0,
    "familyFriendly": true,
    "tags": ["beach", "family", "festival"]
  },
  {
    "name": "Harlem Culture Day",
    "address": "125th St, Harlem, New York, NY 10027",
    "date": "2024-09-20",
    "time": "12:00 PM",
    "location": "Harlem",
    "description": "Celebrate the rich history and culture of Harlem with music, food, and art.",
    "price": 0,
    "familyFriendly": true,
    "tags": ["culture", "history", "family"]
  },
  {
    "name": "Bronx Botanic Garden Tour",
    "address": "2900 Southern Blvd, Bronx, NY 10458",
    "date": "2024-07-22",
    "time": "1:00 PM",
    "location": "Bronx Botanic Garden",
    "description": "A guided tour through the beautiful gardens of the Bronx.",
    "price": 15.00,
    "familyFriendly": true,
    "tags": ["nature", "plants", "family"]
  },
  {
    "name": "Rooftop Yoga Retreat",
    "address": "123 Main St, New York, NY 10001",
    "date": "2024-08-05",
    "time": "7:00 AM",
    "location": "Midtown Rooftop",
    "description": "Start your day with a serene yoga session overlooking the NYC skyline.",
    "price": 30.00,
    "familyFriendly": false,
    "tags": ["fitness", "yoga", "relaxation"]
  },
  {
    "name": "NYC Science Festival",
    "address": "Times Square, New York, NY 10036",
    "date": "2024-10-10",
    "time": "10:00 AM",
    "location": "Times Square",
    "description": "Interactive science exhibits and fun experiments for all ages.",
    "price": 10.00,
    "familyFriendly": true,
    "tags": ["science", "education", "family"]
  },
  {
    "name": "East Village Street Fair",
    "address": "East 9th St, New York, NY 10003",
    "date": "2024-06-18",
    "time": "10:00 AM",
    "location": "East Village",
    "description": "A lively street fair with vendors, food, and live entertainment.",
    "price": 0,
    "familyFriendly": true,
    "tags": ["fair", "street food", "family"]
  },
  {
    "name": "Tribeca Outdoor Market",
    "address": "Tribeca, New York, NY 10013",
    "date": "2024-09-15",
    "time": "9:00 AM",
    "location": "Tribeca",
    "description": "Shop for local goods and produce at this charming outdoor market.",
    "price": 0,
    "familyFriendly": true,
    "tags": ["market", "shopping", "local"]
  }
]

for(let i = 0; i < seedEvents.length; i++) {
  const event = await eventData.createEvent(seedEvents[i].name, seedEvents[i].address, seedEvents[i].date, seedEvents[i].time, seedEvents[i].description, seedEvents[i].price, seedEvents[i].familyFriendly, seedEvents[i].tags, organizer._id);
  await eventData.updateEventAttendees(event._id, attendee._id);
  await eventData.updateEventComments(event._id, attendee._id, seedComments[Math.floor(Math.random()*10)]);
}

console.log('Done seeding database');
await closeConnection();
