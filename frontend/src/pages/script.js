// Toggle menu functionality
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const nav = document.querySelector('nav');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Change icon based on menu state
    const icon = menuToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    }
});

// Slider functionality
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.nav-dot');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
let currentSlide = 0;
let autoSlideInterval;

// Function to show a specific slide
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        dots[i].classList.remove('active');
    });

    // Ensure the index wraps around
    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// Navigate to the next slide
function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
}

// Navigate to the previous slide
function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
}

// Start the auto-slide interval
function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(nextSlide, 5000); // Change slide every 3 seconds
}

// Stop the auto-slide interval
function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
}

// Event listeners for navigation
next.addEventListener('click', () => {
    nextSlide();
    startAutoSlide();
});

prev.addEventListener('click', () => {
    prevSlide();
    startAutoSlide();
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
        startAutoSlide();
    });
});

// Login form toggle
document.getElementById('showLoginBtn').addEventListener('click', function () {
    const loginForm = document.getElementById('loginForm');
    loginForm.classList.toggle('hidden');
});
 
