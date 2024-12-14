# Community Event Social Media Web Application

## Project Description

This website is designed to help users discover local events and enable event coordinators to share and promote their activities within the community. It serves as a community-focused social media platform for discovering, sharing, and managing events, fostering communication between event organizers and attendees.

### Purpose

- **For Users:** Users can find recreational activities or events happening in their city or a city they plan to visit. They can interact with event posts by liking, rating, commenting, or RSVPing to an event (if enabled by the organizer). Users can also post reviews of events they attended.
- **For Event Coordinators:** Coordinators can promote their events by sharing details such as whether the event is virtual or in-person, headcount, timing, cost, and RSVP options.

### Objective

To provide seamless tools for searching, communication, and sharing of local events, bridging the gap between users seeking activities and coordinators looking to attract participants.

---

## Core Features

1. **Sign-Up Page**  
   Users can create accounts by providing their full name, email, phone number, age, a unique username, and password. Users must specify if they are an event coordinator or a general user.

2. **Login Page**  
   Registered users can log in using their username and password.

3. **Event Page**  
   Features posts from event coordinators showcasing upcoming events.

4. **Review Page**  
   Allows users to post reviews of community events or recreational activities.

5. **Event Coordinator Posting Page**  
   Coordinators can create event posts with images, descriptions, headcounts, dates, times, locations, and optional RSVP forms. They can update or delete their posts.

6. **RSVP Form**  
   Coordinators can attach RSVP forms to their posts to collect user information (name and email).

7. **User Posting Page**  
   Users can post about events they attended with images and descriptions on the review page.

8. **User-Post Interaction**  
   Users can interact with event postings through likes, ratings, comments, and RSVP options.

9. **Favorites**  
   Users can favorite or unfavorite events and view their list of favorites.

10. **Coordinator Profile**  
    Users can view profiles of event coordinators, including past and upcoming events.

---

## Getting Started

### Prerequisites

- Node.js installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/fjcorn3/cs546finalproject.git
   cd cs546finalproject
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Seed the database (if applicable):

   ```bash
   npm run seed
   ```

4. Start the application:
   ```bash
   npm start
   ```

---

## Scripts

- **`npm start`**: Starts the application.

---

## Technologies Used

- **Backend Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** bcryptjs, express-session
- **Security:** xss (to prevent cross-site scripting)

---

## Author and License

- **Author**: Group 27
- **License**: ISC

---

## Future Enhancements

- Implement comprehensive testing.
- Improve user interface with additional styling and animations.
- Enable advanced filtering for events (e.g., by date, category, or popularity).

---

This README provides an overview of the project, its core features, setup instructions, and technologies used.
