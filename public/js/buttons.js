document.addEventListener('DOMContentLoaded', () => {
    const container = document.body; // Attach listener to the entire document

    // Like Button Event
    container.addEventListener('click', async (e) => {
        if (e.target.classList.contains('likeButton')) {
            e.preventDefault();
            const eventId = e.target.getAttribute('data-event-id');

            try {
                const response = await fetch('/events/like', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ eventId })
                });

                if (response.ok) {
                    const result = await response.json();
                    alert(`Likes updated: ${result.likes}`);
                } else {
                    const error = await response.json();
                    alert(`Error: ${error.error}`);
                }
            } catch (err) {
                console.error("Error liking event:", err);
            }
        }
    });

    // Favorite Button Event
    container.addEventListener('click', async (e) => {
        if (e.target.classList.contains('favoriteButton')) {
            e.preventDefault();
            const eventId = e.target.getAttribute('data-event-id');

            try {
                const response = await fetch('/events/favorite', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ eventId })
                });

                if (response.ok) {
                    alert("Event added to favorites!");
                } else {
                    const error = await response.json();
                    alert(`Error: ${error.error}`);
                }
            } catch (err) {
                console.error("Error favoriting event:", err);
            }
        }
    });

    // RSVP Button Event
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('rsvpButton')) {
            e.preventDefault();
            const eventId = e.target.getAttribute('data-event-id');
            alert(`RSVP for Event ID: ${eventId}`);
        }
    });
});
