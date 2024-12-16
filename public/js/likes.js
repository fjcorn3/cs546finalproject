document.addEventListener('DOMContentLoaded', () => {
    const likeButton = document.getElementById('likeButton');

    if (likeButton) {
        likeButton.addEventListener('click', async () => {
            const eventId = likeButton.getAttribute('data-event-id');
            console.log("Like button clicked! Event ID:", eventId);

            try {
                const response = await fetch('/events/like', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ eventId }),
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log("Server response:", result);

                    const likesDisplay = document.getElementById('likes-count');
                    if (likesDisplay) {
                        likesDisplay.textContent = `${result.likes} Likes`;
                        console.log("Likes updated on page.");
                    } else {
                        console.error("Likes count element not found!");
                    }
                } else {
                    console.error("Failed to update likes. Status:", response.status);
                }
            } catch (error) {
                console.error("Error occurred while updating likes:", error);
            }
        });
    } else {
        console.error("Like button not found!");
    }
});
