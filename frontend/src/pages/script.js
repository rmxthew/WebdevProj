
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const nav = document.querySelector('nav');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    const icon = menuToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});


document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    }
});


const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.nav-dot');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
let currentSlide = 0;
let autoSlideInterval;


function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        dots[i].classList.remove('active');
    });

    
    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}


function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
}


function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
}

function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(nextSlide, 5000); 
}


function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
}


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

document.getElementById('showLoginBtn').addEventListener('click', function () {
    const loginForm = document.getElementById('loginForm');
    loginForm.classList.toggle('hidden');
});
 
