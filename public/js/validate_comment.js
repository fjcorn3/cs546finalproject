let commentForm = document.getElementById('commentForm');
let error = document.getElementById('error');
let errorMessage = document.getElementById('error-message');

let rsvpButton = document.getElementById('rsvpButton');
let likeButton = document.getElementById('likeButton');
let favoriteButton = document.getElementById('favoriteButton');


rsvpButton.addEventListener('click', (event) => {

});




if(commentForm) {
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let comment = document.getElementById("comment").value;

    if(!comment) throw "must provide comment";
    if(typeof comment !== 'string') throw "improper comment";
    comment = comment.trim().toLowerCase();
    if(!comment) throw "must provide comment";

    commentForm.submit();
  }
)};