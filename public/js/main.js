let errorMsg = document.getElementById('error-message');
let postForm = document.getElementById('createEventForm');
let postFormAttendee = document.getElementById('createAttendeePostForm');
let eventsList = document.getElementById('eventsList');
let coordinatorProfile = document.getElementById('OrganizerEvents');
let reviewList = document.getElementById('reviewsList');
let rateForm = document.getElementById('rateForm');
let favoriteButton = document.getElementById('favoriteButton');
let favoriteStatus = document.getElementById('favorite-status');
const rsvpButton = document.getElementById('rsvpButton');


(async () => {
    let eventsContainer = document.getElementById('event-container');
  
    if (eventsContainer) {
      try {
        const response = await fetch('/api/events');
        const events = await response.json();
        console.log('Events:', events);
        // Handle the fetched events data here
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
  })();



//add a get element by id for event page and add an add new function that adds iems from post database that have not been inserted. to do this you can add anothe atrribute with inserted: true/false
  

    // if (eventsList) {
    //   fetch('/events')
    //     .then((response) => {
    //       if (!response.ok) throw new Error('Failed to fetch events.');
    //       return response.json();
    //     })
    //     .then((events) => {
    //       events.forEach((event) => {
    //         const eventDiv = document.createElement('div');
    //         eventDiv.classList.add('event');
  
    //         eventDiv.innerHTML = `
    //           <h3>${event.description}</h3>
    //           <p>Location: ${event.location || 'N/A'}</p>
    //           <p>Date: ${event.date || 'N/A'} Time: ${event.time || 'N/A'}</p>
    //           <p>Head Count: ${event.headCount || 'N/A'}</p>
    //           <button onclick="handleRSVP('${event._id}')">RSVP</button>
    //         `;
  
    //         eventsList.appendChild(eventDiv);
    //       });
    //     })
    //     .catch((error) => {
    //       console.error(error.message);
    //       eventsList.innerHTML = '<p>Failed to load events. Please try again later.</p>';
    //     });
    // }
if (rsvpButton) {
  rsvpButton.addEventListener('click', async () => {
    const eventId = rsvpButton.dataset.eventId;

    if (!eventId) {
      alert("Event ID missing. Please refresh the page.");
      return;
    }

    try {
      const response = await fetch(`/events/event/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message); // RSVP success
        location.reload(); // Reload to update attendees
      } else {
        alert(result.error || "Failed to RSVP");
      }
    } catch (err) {
      console.error('Error:', err);
      alert("An error occurred. Please try again.");
    }
  });
}      

    if (favoriteButton) {
        favoriteButton.addEventListener('click', async () => {
          const eventId = favoriteButton.dataset.eventId; 
          const action = favoriteButton.dataset.action;
      
          try {
            const response = await fetch(`/${action}/${eventId}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            });
      
            const result = await response.json();
      
            if (response.ok) {
              favoriteStatus.textContent = result.message;
      
              if (action === 'favorite') {
                favoriteButton.textContent = 'Unfavorite';
                favoriteButton.dataset.action = 'unfavorite';
              } else {
                favoriteButton.textContent = 'Favorite';
                favoriteButton.dataset.action = 'favorite';
              }
            } else {
              favoriteStatus.textContent = result.error || 'An error occurred';
            }
          } catch (err) {
            console.error('Error:', err);
            favoriteStatus.textContent = 'An error occurred. Please try again.';
          }
        });
      }
      
    if(postForm){
        postForm.addEventListener('submit', async(e) => {
            const description = document.getElementById('description').value.trim();
            const photo = document.getElementById('photo').value.trim();
            const headCount = document.getElementById('headCount').value.trim();
            const time = document.getElementById('time').value.trim();
            const date = document.getElementById('date').value.trim();
            const location = document.getElementById('location').value.trim();
            const rsvpForm = document.getElementById('rsvpForm').value.trim();

            try{
                if (!description && !photo) throw new Error('Post must include a description or photo');

                
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
                
  

            }catch(e){
                //do somthing
            }
        });

    }

    if(postFormAttendee){
        postFormAttendee.addEventListener('submit', (e) => {
            const description = document.getElementById('description').value.trim();
            const photo = document.getElementById('photo').value.trim();
            try{
                if (!description && !photo) throw new Error('Post must include a description or photo');

  
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
  

            }catch(e){
                //do somthing
            }
        });
    }

    if(eventsList){
        let eventList = document.getElementById('eventList');
        try{

            fetch('/api/session-data', {
                credentials: 'include',
            })
                .then(response => {
                    if (!response.ok) {
                        console.log("errrrr");
                       //throw error
                    }
                    return response.json(); 
                })
                .then(sessionData => {
                    console.log('padding');
                    if("organizer" === sessionData.role){
                        let profileOption = document.getElementById("profileOption");
                        let aProfile = document.createElement('a');
                        aProfile.href = `/coordinatorProfile/${sessionData.username}`;
                        aProfile.textContent = "Go To My Profile";
                        profileOption.appendChild(aProfile);
                        
                        let creating1 = document.getElementById("creating");
                        let creating = document.createElement('a');
                        creating.href = '/create';
                        creating.textContent = "Create New Post";
                        creating1.appendChild(creating);
                    }
    
                //})

            fetch('http://localhost:3000/api/posts')
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
                let newEvents = data;

                console.log(newEvents[0]);

        for(let i = 0; i<newEvents.length; i++){
            let newEvent = document.createElement('il');
            newEvent.id = newEvents[i]._id.toString();

            let newDiv = document.createElement('div');
            newDiv.id = "aPost";

            let userNameTitle = document.createElement('h3');
            let userName = document.createElement('a');
            userName.textContent = newEvents[i].userName;
            userName.href = `/coordinatorProfile/${newEvents[i].userName}`;
            userNameTitle.appendChild(userName);
            newDiv.appendChild(userNameTitle);

            if(newEvents[i].description){
                let description = document.createElement('p');
                description.textContent = newEvents[i].description;
                newDiv.appendChild(description);
            }

            if(newEvents[i].photo){
                let photo = document.createElement('img');
                photo.src = newEvents[i].photo;
                newDiv.appendChild(photo);
            }

            if(newEvents[i].headCount){
                let headCountTitle = document.createElement('p');
                headCountTitle.id = "headCount Title";
                headCountTitle.textContent = "headCount: ";
                let headCount = document.createElement('p');
                headCount.textContent = newEvents[i].headCount;
                headCountTitle.append(headCount);
                newDiv.appendChild(headCountTitle);
            }

            if(newEvents[i].time){
                let timeTitle = document.createElement('p');
                timeTitle.id = "time Title";
                timeTitle.textContent = "Time: ";
                let time = document.createElement('p');
                time.textContent = newEvents[i].time;
                timeTitle.appendChild(time);
                newDiv.appendChild(timeTitle);
            }

            if(newEvents[i].date){
                let dateTitle = document.createElement('p');
                dateTitle.id = "date Title";
                dateTitle.textContent = "Date: ";
                let date = document.createElement('p');
                date.textContent = newEvents[i].date;
                dateTitle.appendChild(date);
                newDiv.appendChild(dateTitle);
            }

            if(newEvents[i].location){
                let locationTitle = document.createElement('p');
                locationTitle.id = "location Title";
                locationTitle.textContent = "Location: ";
                let location = document.createElement('p');
                location.textContent = newEvents[i].location;
                locationTitle.appendChild(location);
                newDiv.appendChild(locationTitle);
            }

            if(newEvents[i].rsvpForm){
                if(newEvents[i].rsvpForm === "yes"){
                let rsvpForm = document.createElement('a');
                rsvpForm.href = '/rsvpForm';
                rsvpForm.textContent = "RSVP Form";
                newDiv.appendChild(rsvpForm);}
            }

            if(newEvents[i].comments){
                let comments = document.createElement('div');
                comments.id = "commentSection";
                comments.textContent = "Comment Section: ";
                for(let j = 0; j<newEvents[i].comments.length; j++){
                    let newComment = document.createElement('p');
                    newComment.id = "aComment";
                    newComment.textContent = newEvents[i].comments[j];
                    comments.appendChild(newComment);
                }
                newDiv.appendChild(comments);
            }

            if(newEvents[i].rating){
                //add rating logic here
                let ratingTitle = document.createElement('p');
                ratingTitle.textContent = "Rating: "
                let rating = document.createElement('p');
                rating.id = "rating";

                let sum = 0;
                for(let j = 0; j < newEvents[i].rating.length; j++){
                    //console.log(newEvents[i].rating[j]);
                    //console.log("fail");
                    sum += newEvents[i].rating[j];
                }
                //console.log(sum);
                let average = sum/((newEvents[i].rating.length));
                average = Math.round(average * 10) / 10
                //console.log(average);
                rating.textContent = average.toString();
                ratingTitle.appendChild(rating);
                newDiv.appendChild(ratingTitle);
            }
            console.log("making");

            let commentSec = document.createElement('div');
            let comment = document.createElement('a');
            comment.href = `/addComment/${newEvents[i]._id.toString()}`;
            comment.textContent = "Add Comment";

            // comment.addEventListener('click', () => {
            //     window.location.href = `/addComment/${newEvents[i]._id.toString()}`; 
            // });

            commentSec.appendChild(comment);

            let rateSec = document.createElement('div');
            let rate = document.createElement('a');
            rate.href =  `/addRate/${newEvents[i]._id.toString()}`;
            rate.textContent = "Add Rating";

            // rate.addEventListener('click', () => {
            //     window.location.href = `/addRate/${newEvents[i]._id.toString()}`; 
            // });


            rateSec.appendChild(rate);
            
            newDiv.appendChild(commentSec);
            newDiv.appendChild(rateSec);

            newEvent.appendChild(newDiv);
            eventList.appendChild(newEvent);

            console.log("through");

        }}) });
    }catch(e){
        console.log(e);
        //smth
    }

    }

    if(coordinatorProfile){
        let eventList = document.getElementById('eventList');
        try{
            fetch('http://localhost:3000/api/posts')
            .then(response => response.json()) 
            .then(data => {
                let newEvents = data;

                let path = window.location.pathname;
                let segments = path.split('/'); 
                let userName = segments[segments.length - 1];

                let currUser;

                fetch('/api/session-data', {
                    credentials: 'include',
                })
                    .then(response => {
                        if (!response.ok) {
                           //throw error
                        }
                        return response.json(); 
                    })
                    .then(sessionData => {
                        if(userName === sessionData.username){
                            currUser =  true;
                            let profile = document.getElementById('profileDetails');
                            let creating = document.createElement('a');
                            creating.href = '/create';
                            creating.textContent = "Create New Post";
                            profile.appendChild(creating);
                        }
        
                    //})

                // if(userName === session.user.username){
                //     let profile = document.getElementById('profileDetails');
                //     let creating = document.createElement('a');
                //     creating.href = '/create';
                //     creating.textContnet = "Create New Post";
                //     profile.appendChild(creating);
                // }


                for(let i = 0; i<newEvents.length; i++){
                    if(newEvents[i].userName === userName){
                        let newEvent = document.createElement('il');
            newEvent.id = newEvents[i]._id.toString();

            let newDiv = document.createElement('div');
            newDiv.id = "aPost";

            let userName = document.createElement('h3');
            userName.textContent = newEvents[i].userName;
            newDiv.appendChild(userName);

            if(newEvents[i].description){
                let description = document.createElement('p');
                description.textContent = newEvents[i].description;
                newDiv.appendChild(description);
            }

            if(newEvents[i].photo){
                let photo = document.createElement('img');
                photo.src = newEvents[i].photo;
                newDiv.appendChild(photo);
            }

            if(newEvents[i].headCount){
                let headCountTitle = document.createElement('p');
                headCountTitle.id = "headCount Title";
                headCountTitle.textContent = "headCount: ";
                let headCount = document.createElement('p');
                headCount.textContent = newEvents[i].headCount;
                headCountTitle.append(headCount);
                newDiv.appendChild(headCountTitle);
            }

            if(newEvents[i].time){
                let timeTitle = document.createElement('p');
                timeTitle.id = "time Title";
                timeTitle.textContent = "Time: ";
                let time = document.createElement('p');
                time.textContent = newEvents[i].time;
                timeTitle.appendChild(time);
                newDiv.appendChild(timeTitle);
            }

            if(newEvents[i].date){
                let dateTitle = document.createElement('p');
                dateTitle.id = "date Title";
                dateTitle.textContent = "Date: ";
                let date = document.createElement('p');
                date.textContent = newEvents[i].date;
                dateTitle.appendChild(date);
                newDiv.appendChild(dateTitle);
            }

            if(newEvents[i].location){
                let locationTitle = document.createElement('p');
                locationTitle.id = "location Title";
                locationTitle.textContent = "Location: ";
                let location = document.createElement('p');
                location.textContent = newEvents[i].location;
                locationTitle.appendChild(location);
                newDiv.appendChild(locationTitle);
            }

            if(newEvents[i].rsvpForm){
                if(newEvents[i].rsvpForm === "yes"){
                let rsvpForm = document.createElement('a');
                rsvpForm.href = '/rsvpForm';
                rsvpForm.textContent = "RSVP Form";
                newDiv.appendChild(rsvpForm);}
            }

            if(newEvents[i].comments){
                let comments = document.createElement('div');
                comments.id = "commentSection";
                comments.textContent = "Comment Section: ";
                for(let j = 0; j<newEvents[i].comments.length; j++){
                    let newComment = document.createElement('p');
                    newComment.id = "aComment";
                    newComment.textContent = newEvents[i].comments[j];
                    comments.appendChild(newComment);
                }
                newDiv.appendChild(comments);
            }

            if(newEvents[i].rating){
                //add rating logic here
                let ratingTitle = document.createElement('p');
                ratingTitle.textContent = "Rating: "
                let rating = document.createElement('p');
                rating.id = "rating";

                let sum = 0;
                for(let j = 0; j < newEvents[i].rating.length; j++){
                    sum += newEvents[i].rating[j];
                }
                //console.log(sum);
                let average = sum/(newEvents[i].rating.length);
                average = Math.round(average * 10) / 10
                //console.log(average);
                rating.textContent = average.toString();
                //console.log(rating.textContent);
                ratingTitle.appendChild(rating);
                newDiv.appendChild(ratingTitle);
            }
            let commentSec = document.createElement('div');
            let comment = document.createElement('a');
            comment.href =`/addComment/${newEvents[i]._id.toString()}`; 
            comment.textContent = "Add Comment";

            // comment.addEventListener('click', () => {
            //     window.location.href = `/addComment/${newEvents[i]._id.toString()}`; 
            // });

            commentSec.appendChild(comment);

            let rateSec = document.createElement('div');
            let rate = document.createElement('a');
            rate.href = `/addRate/${newEvents[i]._id.toString()}`;
            rate.textContent = "Add Rating";

            // rate.addEventListener('click', () => {
            //     window.location.href = `/addRate/${newEvents[i]._id.toString()}`; 
            // });

            rateSec.appendChild(rate);

            newDiv.appendChild(commentSec);
            newDiv.appendChild(rateSec);

            newEvent.appendChild(newDiv);

            console.log("username" + userName);
            console.log(currUser);

            if(currUser){
                console.log("heree");
                let updating = document.createElement('button');
                updating.id = newEvents[i]._id.toString();
                updating.textContent = "Update Post";

                updating.addEventListener('click', () => {
                    window.location.href = `/updatePost/${newEvents[i]._id.toString()}`; 
                });

                let deleting = document.createElement('button');
                deleting.id = newEvents[i]._id.toString();
                deleting.textContent = "Delete Post";
                
                deleting.addEventListener('click', () => {
                    window.location.href = `/deletePost/${newEvents[i]._id.toString()}`; 
                });

                newEvent.appendChild(updating);
                newEvent.appendChild(deleting);

            }
            eventList.appendChild(newEvent);

                    }
                }})

            });

        }catch(e){

        }
    }

    if(reviewList){
        let eventList = document.getElementById('reviewList');
        try{
            fetch('/api/session-data', {
                credentials: 'include',
            })
                .then(response => {
                    if (!response.ok) {
                       //throw error
                    }
                    return response.json(); 
                })
                .then(sessionData => {
                    if("attendee" === sessionData.role){
                        let creating1 = document.getElementById("creating");
                        let creating = document.createElement('a');
                        creating.href = '/createAttendee';
                        creating.textContent = "Create New Post";
                        creating1.appendChild(creating);
                    }
                    if("organizer" === sessionData.role){
                        let profileOption = document.getElementById("profileOption");
                        let aProfile = document.createElement('a');
                        aProfile.href = `/coordinatorProfile/${sessionData.username}`;
                        aProfile.textContent = "Go To My Profile";
                        profileOption.appendChild(aProfile);
                    }
    
                })

            fetch('http://localhost:3000/api/attendeePosts')
            .then(response => response.json()) 
            .then(data => {
                let newEvents = data;

        for(let i = 0; i<newEvents.length; i++){
            let newEvent = document.createElement('il');
            newEvent.id = newEvents[i]._id.toString();

            let newDiv = document.createElement('div');
            newDiv.id = "aPost";

            let userNameTitle = document.createElement('h3');
            userNameTitle.textContent = newEvents[i].userName;
            newDiv.appendChild(userNameTitle);

            if(!newEvents[i].description && !newEvents[i].description) throw "could not load contents";

            if(newEvents[i].description){
                let description = document.createElement('p');
                description.textContent = newEvents[i].description;
                newDiv.appendChild(description);
            }

            if(newEvents[i].photo){
                let photo = document.createElement('img');
                photo.src = newEvents[i].photo;
                newDiv.appendChild(photo);
            }
            newEvent.appendChild(newDiv);
            console.log(eventList);
            eventList.appendChild(newEvent);
        }})}catch(e){
                //do smth
            }
    }

//     if(commentForm){
//         commentForm.addEventListener('submit', (e) => {
//             e.preventDefault();

//             try{

//             let comment = document.getElementById("comment").value;

//             if(!comment) throw "must provide comment";
//             if(typeof comment !== 'string') throw "improper comment";
//             comment = comment.trim().toLowerCase();
//             if(!comment) throw "must provide comment";

//             else{
//                 commentForm.submit();
//             }
//         }catch(e){
//             //smth
//         }


//     });
// }

// if(rateForm){
//     rateForm.addEventListener('submit', (e) => {
//         e.preventDefault();

//         try{

//         let rate = document.getElementById("rate").value;

//         if(!rate) throw "must provide rate";
//         if(!(/^\d+$/.test(rate))) throw "rate must be a number";

//         else{
//             rateForm.submit();
//         }
//     }catch(e){
//         console.log(e);
//         //smth
//     }


// });
// }
  