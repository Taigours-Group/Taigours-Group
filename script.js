// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
      name: this.querySelector('input[type="text"]').value,
      email: this.querySelector('input[type="email"]').value,
      subject: this.querySelector('input[placeholder="Subject"]').value,
      message: this.querySelector('textarea').value
    };

    // Format the message for WhatsApp
    const whatsappMessage = `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\nMessage: ${formData.message}`;
    const whatsappNumber = '9779864088891'; // Replace with the WhatsApp number
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    // Redirect to WhatsApp
    window.open(whatsappLink, '_blank');

    // Reset form
    this.reset();
  });
}

// Header scroll effect
window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  if (header) {
    if (window.scrollY > 50) {
      header.style.padding = '10px 0';
      header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.padding = '15px 0';
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
  }
});

// Initialize animation for company cards
const companyCards = document.querySelectorAll('.company-card');
if (companyCards.length > 0) {
  companyCards.forEach((card, index) => {
    card.style.animation = `fadeIn 0.5s ease forwards ${0.1 + index * 0.1}s`;
    card.style.opacity = '0';
  });
}

// Dark Mode Functionality
function initializeDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      const htmlElement = document.documentElement;
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', newTheme);

      // Update the icon
      const icon = darkModeToggle.querySelector('i');
      if (newTheme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }

      // Save the theme preference in localStorage
      localStorage.setItem('theme', newTheme);
    });

    // Initialize theme on page load
    document.addEventListener('DOMContentLoaded', () => {
      const savedTheme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);

      // Set the correct icon
      const icon = darkModeToggle.querySelector('i');
      if (savedTheme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    });
  }
}

// Menu Navigation Functionality
function initializeMenuNavigation() {
  const mobileNav = document.getElementById('mobileNav');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.querySelector('nav');
  const menuToggleResponsive = document.createElement('button');
  menuToggleResponsive.classList.add('menu-toggle');
  menuToggleResponsive.innerHTML = '<i class="fas fa-bars"></i>';
  nav.parentNode.insertBefore(menuToggleResponsive, nav);

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function() {
      mobileNav.classList.toggle('active');

      // Change icon based on menu state
      if (mobileNav.classList.contains('active')) {
        menuToggle.innerHTML = '<i class="fas fa-times"></i>';
      } else {
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });

    // Close mobile menu when clicking on a link
    const navLinks = mobileNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          mobileNav.classList.remove('active');
          menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
      });
    });
  }

  // Responsive Navigation
  menuToggleResponsive.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggleResponsive.innerHTML = nav.classList.contains('active')
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });

  // Close menu on link click (for mobile)
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        nav.classList.remove('active');
        menuToggleResponsive.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  });

  // Adjust menu on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      nav.classList.remove('active');
      menuToggleResponsive.innerHTML = '<i class="fas fa-bars"></i>';
    }
    if (mobileNav) {
      mobileNav.classList.remove('active');
    }
    if (menuToggle) {
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (mobileNav && menuToggle && window.innerWidth <= 768) {
      const isClickInsideNav = mobileNav.contains(e.target);
      const isClickOnToggle = menuToggle.contains(e.target);

      if (!isClickInsideNav && !isClickOnToggle && mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    }
  });
}

// Loading screen handler
function handleLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingSound = document.getElementById('loading-sound');
  
  if (loadingScreen) {
    // Play sound effect
    if (loadingSound) {
      // Play sound with user interaction (to comply with browser policies)
      const playSound = () => {
        loadingSound.volume = 0.5; // Set volume to 50%
        loadingSound.play()
          .catch(error => console.log("Audio playback error:", error));
        // Remove event listener after first interaction
        document.removeEventListener('click', playSound);
      };
      
      // Add listener for first user interaction
      document.addEventListener('click', playSound);
      
      // Also try to autoplay (may work in some browsers)
      loadingSound.play().catch(() => {
        console.log("Autoplay prevented, waiting for user interaction");
      });
    }
    
    // Hide loading screen after animation completes
    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        // Pause sound when animation completes
        if (loadingSound) {
          loadingSound.pause();
          loadingSound.currentTime = 0;
        }
      }, 800);
    }, 5500); // Longer duration for the cinematic effect
  }
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Handle loading screen
  handleLoadingScreen();

  // Initialize dark mode
  initializeDarkMode();

  // Initialize menu navigation

  initializeMenuNavigation();

  // Check screen size on load
  if (window.innerWidth > 768) {
    const mobileNav = document.getElementById('mobileNav');
    if (mobileNav) {
      mobileNav.classList.remove('active');
    }
  }
});
