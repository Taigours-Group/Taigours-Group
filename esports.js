// Function to fetch tournament data from JSON file
function fetchTournamentData() {
  fetch('./json files/esports.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      createTournamentCards(data.tournaments);
    })
    .catch(error => console.error('Error fetching tournament data:', error));
}

// Function to create tournament cards
function createTournamentCards(tournaments) {
  const container = document.getElementById('tournaments-container');
  if (!container) return;

  tournaments.forEach(tournament => {
    const card = document.createElement('div');
    card.className = 'tournament-card';
    card.innerHTML = `
      <div class="tournament-image" style="background-image: url('${tournament.image}')">
      <div class="tournament-overlay">
      <div class="tournament-game">${tournament.game}</div>
      <div class="tournament-event">${tournament.event}</div>
      </div>
      </div>
      <div class="tournament-details">
      <h3 class="tournament-title">${tournament.title}</h3>
      <div class="tournament-info">
        <i class="fa-solid fa-map-location-dot"></i>
        <span>${tournament.map}</span>
      </div>
      <div class="tournament-info">
        <i class="far fa-calendar-alt"></i>
        <span>${tournament.date}</span>
      </div>
      <div class="tournament-info">
        <i class="far fa-clock"></i>
        <span>${tournament.time}</span>
      </div>
      <div class="tournament-prize">Prize Pool: ${tournament.prize}</div>
      <div class="tournament-actions">
        <a href="#contact" class="btn btn-sm">Participate</a>
        <a href="live.html?tournamentId=${tournament.id}" class="btn btn-sm live-btn">Live</a>
        <div class="social-actions">
        <button class="social-btn like-btn"><i class="far fa-heart"></i></button>
        <button class="social-btn share-btn"><i class="fas fa-share-alt"></i></button>
        </div>
      </div>
      </div>
    `;
    container.appendChild(card);
  });

  // Removed sidebar-related initialization
}

// Function to fetch leaderboard data from JSON file
function fetchLeaderboardData() {
  fetch('./json files/esports.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      createLeaderboardTables(data.leaderboards);
    })
    .catch(error => console.error('Error fetching leaderboard data:', error));
}

// Function to create leaderboard tables
function createLeaderboardTables(leaderboards) {
  const freeFireTable = document.querySelector('#freefire-leaderboard tbody');
  const pubgTable = document.querySelector('#pubg-leaderboard tbody');

  if (freeFireTable) {
    leaderboards.freefire.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${entry.rank}</td>
        <td>${entry.team}</td>
        <td>${entry.kill}</td>
        <td>${entry.wins}</td>
        <td>${entry.points}</td>
      `;
      freeFireTable.appendChild(row);
    });
  }

  if (pubgTable) {
    leaderboards.pubg.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${entry.rank}</td>
        <td>${entry.team}</td>
        <td>${entry.kill}</td>
        <td>${entry.wins}</td>
        <td>${entry.points}</td>
      `;
      pubgTable.appendChild(row);
    });
  }
}

// Function to handle tab switching
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabButtons.length === 0) return;

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked button
      button.classList.add('active');

      // Show corresponding content
      const gameId = button.getAttribute('data-game');
      const content = document.getElementById(`${gameId}-leaderboard`);
      if (content) {
        content.classList.add('active');
      }
    });
  });
}

// Function to handle form submission
function initContactForm() {
  const form = document.getElementById('tournamentForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
      teamName: this.querySelector('input[placeholder="Team Name"]').value,
      teamCaptain: this.querySelector('input[placeholder="Team Captain"]').value,
      email: this.querySelector('input[placeholder="Email"]').value,
      whatsappNumber: this.querySelector('input[placeholder="WhatsApp Number"]').value,
      game: this.querySelector('select').value,
      additionalInfo: this.querySelector('textarea[placeholder="Additional Information"]').value,
      termsAccepted: this.querySelector('#termsCheckbox').checked ? "Yes" : "No"
    };

    // Format the message for WhatsApp
    const whatsappMessage = `Team Name: ${formData.teamName}\nTeam Captain: ${formData.teamCaptain}\nEmail: ${formData.email}\nWhatsApp Number: ${formData.whatsappNumber}\nGame: ${formData.game}\nAdditional Info: ${formData.additionalInfo}\nTerms Accepted: ${formData.termsAccepted}`;
    const whatsappNumber = '9864088891'; // Replace with the WhatsApp number
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    // Redirect to WhatsApp
    window.open(whatsappLink, '_blank');

    // Reset form
    this.reset();
  });
}

// Function to handle sharing
function shareEvent(title, game, date, prize, image) {
  const shareText = `${title} - ${game}\nDate: ${date}\nPrize: ${prize}`;
  const shareUrl = `${window.location.href}?title=${encodeURIComponent(title)}&game=${encodeURIComponent(game)}&date=${encodeURIComponent(date)}&prize=${encodeURIComponent(prize)}&image=${encodeURIComponent(image)}`;
  
  const thumbnailHtml = `
    <div>
      <img src="${image}" alt="${title}" style="width: 100px; height: auto; display: block; margin-bottom: 10px;">
      <strong>${title}</strong><br>
      <small>Date: ${date}</small><br>
      <small>Prize: ${prize}</small>
    </div>
  `;

  if (navigator.share) {
    // If Web Share API is supported
    navigator.share({
      title: title,
      text: shareText,
      url: shareUrl,
    }).then(() => {
      alert("Event shared successfully!");
    }).catch((err) => {
      alert("Error sharing event: " + err);
    });
  } else {
    // Fallback: Copy to clipboard
    navigator.clipboard.writeText(`${thumbnailHtml}\n${shareUrl}`).then(() => {
      alert("Event link copied to clipboard!");
    }).catch((err) => {
      alert("Error copying link: " + err);
    });
  }
}

// Handle like and share buttons
function initSocialButtons() {
  document.addEventListener('click', function(e) {
    if (e.target.closest('.like-btn')) {
      const button = e.target.closest('.like-btn');
      button.classList.toggle('active');
      const icon = button.querySelector('i');
      if (button.classList.contains('active')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon.style.color = '#e74c3c';
      } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        icon.style.color = '';
      }
    }
    
    if (e.target.closest('.share-btn')) {
      const card = e.target.closest('.tournament-card');
      const title = card.querySelector('.tournament-title').textContent;
      const game = card.querySelector('.tournament-game').textContent;
      const date = card.querySelector('.tournament-info span').textContent;
      const prize = card.querySelector('.tournament-prize').textContent;
      const image = card.querySelector('.tournament-image').style.backgroundImage.slice(5, -2); // Extract URL from background-image
      shareEvent(title, game, date, prize, image);
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  fetchTournamentData();
  fetchLeaderboardData();
  initTabs();
  initContactForm();
  initSocialButtons();
});