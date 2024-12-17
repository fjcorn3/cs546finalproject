document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('commentForm');
    const commentsContainer = document.querySelector('.comments-container');

    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const commentText = document.getElementById('comment').value.trim();
            const eventId = commentForm.getAttribute('data-event-id'); // Pass event ID

            if (!commentText) {
                alert("Comment cannot be empty!");
                return;
            }

            try {
                // Send POST request to add the comment
                const response = await fetch(`/events/event/${eventId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ comment: commentText })
                });

                if (response.ok) {
                    const result = await response.json();
                    renderComments(result.comments); // Re-render comments
                    document.getElementById('comment').value = ''; // Clear input
                } else {
                    const error = await response.json();
                    alert("Error: " + error.error);
                }
            } catch (error) {
                console.error("Error submitting comment:", error);
            }
        });

        // Function to re-render comments dynamically
        function renderComments(comments) {
            commentsContainer.innerHTML = ''; // Clear current comments

            comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                commentElement.innerHTML = `
                    <strong>${comment.username}</strong>:
                    <p>${comment.text}</p>
                    <small>${new Date(comment.date).toLocaleString()}</small>
                `;
                commentsContainer.appendChild(commentElement);
            });
        }
    }
});
