// Global variables
let isScrolled = false;
let currentSection = 'home';
let particles = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    createParticles();
    setupEventListeners();
    setupScrollAnimations();
    setupNavigation();
    setupContactForm();
    showElement('.hero-content');
}

// Create animated particles for hero background
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 4 + 1;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const animationDuration = Math.random() * 3 + 3;
    const delay = Math.random() * 2;
    
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.animationDuration = animationDuration + 's';
    particle.style.animationDelay = delay + 's';
    
    container.appendChild(particle);
    particles.push(particle);
}

// Event Listeners Setup
function setupEventListeners() {
    // Scroll events
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', updateActiveSection);
    
    // Resize events
    window.addEventListener('resize', handleResize);
    
    // Navigation toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Back to top button
    const backToTop = document.getElementById('backToTop');
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Handle scroll events
function handleScroll() {
    const scrollY = window.scrollY;
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    
    // Navbar shrink effect
    if (scrollY > 100 && !isScrolled) {
        navbar.classList.add('scrolled');
        isScrolled = true;
    } else if (scrollY <= 100 && isScrolled) {
        navbar.classList.remove('scrolled');
        isScrolled = false;
    }
    
    // Back to top button
    if (scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
    
}

// Update active navigation section
function updateActiveSection() {
    const sections = ['home', 'about', 'branches', 'leadership', 'contact'];
    const scrollPosition = window.scrollY + 200;
    
    for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                if (currentSection !== sectionId) {
                    updateActiveNavLink(sectionId);
                    currentSection = sectionId;
                }
                break;
            }
        }
    }
}

// Update active navigation link
function updateActiveNavLink(activeSection) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === activeSection) {
            link.classList.add('active');
        }
    });
}

// Handle window resize
function handleResize() {
    // Update particles on resize
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer && particles.length > 0) {
        particles.forEach(particle => {
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = Math.random() * window.innerHeight + 'px';
        });
    }
}

// Setup scroll animations
function setupScrollAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    // Create intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.getAttribute('data-aos');
                const delay = element.getAttribute('data-aos-delay') || 0;
                
                setTimeout(() => {
                    element.classList.add('visible');
                    animateElement(element, animationType);
                }, delay);
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
}

// Animate individual elements
function animateElement(element, animationType) {
    switch (animationType) {
        case 'fade-up':
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            break;
        case 'fade-left':
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
            break;
        case 'fade-right':
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
            break;
        default:
            element.style.opacity = '1';
            element.style.transform = 'none';
    }
}

// Show element with animation
function showElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }
}

// Navigation setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            scrollToSection(targetSection);
            
            // Close mobile menu
            document.getElementById('nav-toggle').classList.remove('active');
            document.getElementById('nav-menu').classList.remove('active');
        });
    });
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed navbar
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Contact form setup
function setupContactForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', handleFormSubmit);
    
    // Add real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const isValid = validateForm(form);
    
    if (isValid) {
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            showFormSuccess();
            form.reset();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 2000);
    }
}

// Form validation
function validateForm(form) {
    const fields = [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'service', type: 'select', required: true },
        { name: 'message', type: 'text', required: true }
    ];
    
    let isValid = true;
    
    fields.forEach(field => {
        const input = form.querySelector(`[name="${field.name}"]`);
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(input) {
    const value = input.value.trim();
    const fieldName = input.name;
    const isRequired = input.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error
    clearFieldError(input);
    
    // Required field validation
    if (isRequired && !value) {
        errorMessage = 'This field is required';
        isValid = false;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
    }
    
    // Name validation
    if (fieldName === 'name' && value && value.length < 2) {
        errorMessage = 'Name must be at least 2 characters long';
        isValid = false;
    }
    
    // Message validation
    if (fieldName === 'message' && value && value.length < 10) {
        errorMessage = 'Message must be at least 10 characters long';
        isValid = false;
    }
    
    // Show error if validation failed
    if (!isValid) {
        showFieldError(input, errorMessage);
    } else {
        input.parentElement.classList.add('success');
    }
    
    return isValid;
}

// Show field error
function showFieldError(input, message) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.form-error');
    
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// Clear field error
function clearFieldError(input) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.form-error');
    
    formGroup.classList.remove('error');
    
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// Remove global variable assignments
document.getElementById('contactForm').addEventListener('submit', sendMessage);
function sendMessage(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const company = document.getElementById('company').value;
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value;

    if (validateForm(document.getElementById('contactForm'))) {
        const whatsappMessage = `Hello, my name is ${name}. I would like to inquire about ${service}. My email is ${email} and my company is ${company}. Here is my message: ${message}`;
        const whatsappNumber = '9779766115626'; // Replace with your WhatsApp number
        const encodedMsg = encodeURIComponent(whatsappMessage);
        const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMsg}`;
        window.open(whatsappLink, '_blank');
        showFormSuccess();
    }
}


// Show form success message
function showFormSuccess() {
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for your interest. We'll get back to you soon.</p>
        </div>
    `;
    
    // Style the success message
    successMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--card-bg);
        border: 2px solid var(--primary-gold);
        border-radius: 20px;
        padding: 3rem;
        text-align: center;
        z-index: 10000;
        box-shadow: 0 25px 50px var(--shadow-gold);
        animation: successFadeIn 0.5s ease-out;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes successFadeIn {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
        .success-message .success-content i {
            font-size: 3rem;
            color: var(--primary-gold);
            margin-bottom: 1rem;
        }
        .success-message .success-content h3 {
            color: var(--primary-gold);
            margin-bottom: 1rem;
        }
        .success-message .success-content p {
            color: var(--text-muted);
        }
    `;
    document.head.appendChild(style);
    
    // Show message
    document.body.appendChild(successMessage);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        successMessage.style.animation = 'successFadeIn 0.5s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(successMessage);
            document.head.removeChild(style);
        }, 500);
    }, 3000);
}

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
        const button = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
        
        // Create ripple element
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        // Add ripple animation
        if (!document.querySelector('#ripple-styles')) {
            const rippleStyles = document.createElement('style');
            rippleStyles.id = 'ripple-styles';
            rippleStyles.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(rippleStyles);
        }
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Add loading animation for page load
window.addEventListener('load', function() {
    // Hide any loading indicators and show content
    document.body.classList.remove('loading');
    
    // Trigger hero animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll handler
window.addEventListener('scroll', throttle(handleScroll, 16)); // ~60fps
window.addEventListener('scroll', throttle(updateActiveSection, 100));

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        document.getElementById('nav-toggle').classList.remove('active');
        document.getElementById('nav-menu').classList.remove('active');
    }
    
    // Arrow keys for section navigation
    if (e.key === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        const sections = ['home', 'about', 'branches', 'leadership', 'contact'];
        const currentIndex = sections.indexOf(currentSection);
        if (currentIndex < sections.length - 1) {
            scrollToSection(sections[currentIndex + 1]);
        }
    }
    
    if (e.key === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        const sections = ['home', 'about', 'branches', 'leadership', 'contact'];
        const currentIndex = sections.indexOf(currentSection);
        if (currentIndex > 0) {
            scrollToSection(sections[currentIndex - 1]);
        }
    }
});
