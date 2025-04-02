function fetchReleaseCards() {
  fetch('./json files/music.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      createReleaseCards(data.releases);
    })
    .catch(error => console.error('Error fetching product data:', error));
}

// Function to create release cards
function createReleaseCards(releases) {
  const container = document.getElementById('releases-container');
  if (!container) return;

  releases.forEach(release => {
    const card = document.createElement('div');
    card.className = 'release-card';
    card.dataset.audioSrc = release.audiosrc; // Add audio source to dataset
    card.innerHTML = `
      <div class="release-cover" style="background-image: url('${release.cover}')">
        <div class="release-play">
          <i class="fas fa-play"></i>
        </div>
      </div>
      <div class="release-details">
        <h3 class="release-title">${release.title}</h3>
        <p class="release-artist">${release.artist}</p>
        <div class="release-info">
          <span><i class="fas fa-calendar-alt"></i> ${release.date}</span>
          <span><i class="fas fa-music"></i> ${release.genre}</span>
        </div>
        <div class="release-platforms">
          <a href="${release.spotify}" title="Spotify" target="_blank"><i class="fab fa-spotify"></i></a>
          <a href="${release.apple}" title="Apple Music" target="_blank"><i class="fab fa-apple"></i></a>
          <a href="${release.youtube}" title="YouTube Music" target="_blank"><i class="fab fa-youtube"></i></a>
          <a href="${release.amazon}" title="Amazon Music" target="_blank"><i class="fab fa-amazon"></i></a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // Add vertical scroller to the container
  container.style.overflowY = 'auto';
  container.style.maxHeight = '500px'; // Adjust the height as needed
}

// Function to handle music submission form
function initMusicSubmissionForm() {
  const form = document.getElementById('musicSubmissionForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
      artistName: this.querySelector('input[placeholder="Artist/Band Name"]').value,
      contactPerson: this.querySelector('input[placeholder="Contact Person"]').value,
      email: this.querySelector('input[placeholder="Email"]').value,
      phoneNumber: this.querySelector('input[placeholder="Phone Number"]').value,
      genre: this.querySelector('select').value,
      musicLink: this.querySelector('input[placeholder="Link to Your Music (SoundCloud, YouTube, etc.)"]').value,
      about: this.querySelector('textarea[placeholder="Tell us about yourself and your music"]').value
    };

    // Format the message for WhatsApp
    const whatsappMessage = `Artist/Band Name: ${formData.artistName}\nContact Person: ${formData.contactPerson}\nEmail: ${formData.email}\nPhone Number: ${formData.phoneNumber}\nGenre: ${formData.genre}\nMusic Link: ${formData.musicLink}\nAbout: ${formData.about}`;
    const whatsappNumber = '5566778899'; // Replace with the WhatsApp number
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    // Redirect to WhatsApp
    window.open(whatsappLink, '_blank');

    // Reset form
    this.reset();
  });
}

// Initialize carousel functionality
function initArtistsCarousel() {
  const carousel = document.querySelector('.artists-carousel');
  if (!carousel) return;

  // In a real app, you might implement arrow navigation or pagination
  // This is a simple implementation for demonstration
  let isDown = false;
  let startX;
  let scrollLeft;

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    carousel.style.cursor = 'grabbing';
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });

  carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.style.cursor = 'grab';
  });

  carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.style.cursor = 'grab';
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    carousel.scrollLeft = scrollLeft - walk;
  });
}

// Handle the play buttons on music releases
function initPlayButtons() {
  let currentAudio = null;
  let currentPlayButton = null;

  document.addEventListener('click', function(e) {
    const playButton = e.target.closest('.release-play');
    if (playButton) {
      const releaseCard = playButton.closest('.release-card');
      const audioSrc = releaseCard.dataset.audioSrc;

      if (audioSrc) {
        if (currentAudio && currentAudio.src === audioSrc) {
          if (currentAudio.paused) {
            currentAudio.play();
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
          } else {
            currentAudio.pause();
            playButton.innerHTML = '<i class="fas fa-play"></i>';
          }
        } else {
          if (currentAudio) {
            currentAudio.pause();
            currentPlayButton.innerHTML = '<i class="fas fa-play"></i>';
          }
          currentAudio = new Audio(audioSrc);
          currentAudio.play();
          playButton.innerHTML = '<i class="fas fa-pause"></i>';
          currentPlayButton = playButton;

          currentAudio.addEventListener('ended', () => {
            playButton.innerHTML = '<i class="fas fa-play"></i>';
          });
        }
      } else {
        alert('No audio source found for this release.');
      }
    }
  });
}

function fetchArtistCards() {
  fetch('./json files/music.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      createArtistCards(data.artists);
    })
    .catch(error => console.error('Error fetching artist data:', error));
}

function createArtistCards(artists) {
  const carousel = document.getElementById('artists-carousel');
  if (!carousel) return;

  artists.forEach(artist => {
    const card = document.createElement('div');
    card.className = 'artist-card';
    card.innerHTML = `
      <div class="artist-image" style="background-image: url('${artist.image}')">
      </div>
      <h3>${artist.name}</h3>
      <p>${artist.genre}</p>
      <div class="artist-social">
        <a href="${artist.spotify}" title="Spotify" target="_blank"><i class="fab fa-spotify"></i></a>
        <a href="${artist.apple}" title="Apple Music" target="_blank"><i class="fab fa-apple"></i></a>
        <a href="${artist.youtube}" title="YouTube Music" target="_blank"><i class="fab fa-youtube"></i></a>
        <a href="${artist.instagram}" title="Instagram" target="_blank"><i class="fab fa-instagram"></i></a>
      </div>
    `;
    carousel.appendChild(card);
  });
}

// Function to filter release cards based on search input
function filterReleases() {
  const searchBar = document.getElementById('searchBar');
  const searchButton = document.getElementById('searchButton');
  const releasesContainer = document.getElementById('releases-container');
  const releaseCards = releasesContainer.getElementsByClassName('release-card');

  function filter() {
    const query = searchBar.value.toLowerCase();
    Array.from(releaseCards).forEach(card => {
      const title = card.querySelector('.release-title').textContent.toLowerCase();
      const artist = card.querySelector('.release-artist').textContent.toLowerCase();
      if (title.includes(query) || artist.includes(query)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  searchBar.addEventListener('input', filter);
  searchButton.addEventListener('click', filter);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  fetchReleaseCards();
  fetchArtistCards(); // Add this line to fetch artist cards
  initMusicSubmissionForm();
  initArtistsCarousel();
  initPlayButtons();
  filterReleases(); // Add this line to initialize the search functionality
});