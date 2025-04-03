document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const tournamentId = urlParams.get('tournamentId'); // Ensure this retrieves the correct ID as a string

  fetch('./json files/esports.json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('live-streams-container');
      if (!container) return;

      const selectedTournament = data.tournaments.find(tournament => String(tournament.id) === tournamentId);
      if (selectedTournament) {
        const streamCard = document.createElement('div');
        streamCard.className = 'live-stream-card';
        streamCard.innerHTML = `
          ${selectedTournament.youtube ? `
              <img src="${selectedTournament.image}"  class="live-stream-image">
          ` : ''}
          <div class="stream-details">
            <h3>${selectedTournament.title}</h3>
            <p>${selectedTournament.game} - ${selectedTournament.date}</p>
            <div class="stream-links">
              ${selectedTournament.youtube ? `<a href="${selectedTournament.youtube}" target="_blank" class="btn">Watch on YouTube</a>` : ''}
              ${selectedTournament.facebook ? `<a href="${selectedTournament.facebook}" target="_blank" class="btn">Watch on Facebook</a>` : ''}
            </div>
          </div>
        `;
        container.appendChild(streamCard);
      } else {
        container.innerHTML = '<p>No live stream available for the selected tournament.</p>';
      }
    })
    .catch(error => {
      console.error('Error loading live streams:', error);
      const container = document.getElementById('live-streams-container');
      if (container) {
        container.innerHTML = '<p>Failed to load live streams. Please try again later.</p>';
      }
    });
});
