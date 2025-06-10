// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const navbar = document.getElementById('navbar');
const progressBar = document.getElementById('progress-bar');
const backToTopBtn = document.getElementById('back-to-top');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const skillProgressBars = document.querySelectorAll('.skill-progress');
const statNumbers = document.querySelectorAll('.stat-number');
const typingText = document.getElementById('typing-text');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const testimonialItems = document.querySelectorAll('.testimonial-item');
const navDots = document.querySelectorAll('.nav-dot');
const downloadCvBtn = document.getElementById('download-cv');
const contactBtn = document.getElementById('contact-btn');

// Global Variables
let currentTestimonial = 0;
let isLoading = true;
// Check for saved theme in localStorage or system preference
let isDarkMode = localStorage.getItem('theme') === 'dark' || 
                 (localStorage.getItem('theme') === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

// Initializer function
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Hide loading screen after everything is loaded
    window.addEventListener('load', () => {
        loadingScreen.classList.add('hidden');
        isLoading = false;
        // Trigger animations once loaded
        animateOnScroll();
        startTypingEffect();
    });

    // Setup all event listeners
    setupEventListeners();

    // Set initial theme
    updateTheme(isDarkMode);

    // Set initial active nav link
    updateActiveNavLink();
    
    // Animate testimonials
    showTestimonial(currentTestimonial);
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
        showTestimonial(currentTestimonial);
    }, 5000);

    // Init Particles.js
    if(document.getElementById('particles-js')) {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#888888" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#888888", "opacity": 0.4, "width": 1 },
                "move": { "enable": true, "speed": 4, "direction": "none", "random": false, "straight": false, "out_mode": "out" }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, "push": { "particles_nb": 4 } }
            },
            "retina_detect": true
        });
    }
}

function setupEventListeners() {
    // Scroll events
    window.addEventListener('scroll', () => {
        handleScroll();
        animateOnScroll();
        updateActiveNavLink();
    });

    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            updateTheme(isDarkMode);
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        });
    }

    // Hamburger menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // Testimonial navigation
    navDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideIndex = parseInt(e.target.dataset.slide);
            showTestimonial(slideIndex);
        });
    });

    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Basic validation
            const name = this.querySelector('#name').value.trim();
            const email = this.querySelector('#email').value.trim();
            const message = this.querySelector('#message').value.trim();

            if (name === '' || email === '' || message === '' || !isValidEmail(email)) {
                alert('Vui lòng điền đầy đủ và chính xác thông tin.');
                return;
            }
            // In a real application, this would send the form data to a server
            alert('Tin nhắn của bạn đã được gửi! Chúng tôi sẽ liên hệ lại sớm nhất có thể.');
            contactForm.reset();
        });
    }
    
    // Ripple effect on buttons
    document.querySelectorAll('.ripple-effect').forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

function handleScroll() {
    // Navbar scroll effect
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
    backToTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    // Scroll progress bar
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollTop = document.documentElement.scrollTop;
    const progress = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = progress + '%';
}

function animateOnScroll() {
    if (isLoading) return;

    // Animate skill bars
    skillProgressBars.forEach(bar => {
        if (isElementInViewport(bar) && !bar.classList.contains('animated')) {
            bar.style.width = bar.dataset.progress;
            bar.classList.add('animated');
        }
    });

    // Animate stat numbers
    statNumbers.forEach(number => {
        if (isElementInViewport(number) && !number.classList.contains('animated')) {
            animateNumber(number, number.dataset.target);
            number.classList.add('animated');
        }
    });
}

function updateTheme(isDark) {
    document.documentElement.setAttribute('data-color-scheme', isDark ? 'dark' : 'light');
    if(themeIcon) {
        themeIcon.classList.replace(isDark ? 'fa-sun' : 'fa-moon', isDark ? 'fa-moon' : 'fa-sun');
    }
}

function updateActiveNavLink() {
    let currentSection = '';
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - navbar.clientHeight - 5) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
        }
    });
}


function startTypingEffect() {
    const words = ["Full Stack Developer.", "UI/UX Designer.", "Problem Solver."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        const cursorSpan = '<span class="typing-cursor">|</span>';

        if (isDeleting) {
            typingText.innerHTML = currentWord.substring(0, charIndex - 1) + cursorSpan;
            charIndex--;
        } else {
            typingText.innerHTML = currentWord.substring(0, charIndex + 1) + cursorSpan;
            charIndex++;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            setTimeout(() => isDeleting = true, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }

        const typeSpeed = isDeleting ? 100 : 150;
        setTimeout(type, typeSpeed);
    }
    type();
}

function showTestimonial(index) {
    testimonialItems.forEach((item, i) => {
        item.classList.remove('active');
        if (i === index) {
            item.classList.add('active');
        }
    });
    navDots.forEach((dot, i) => {
        dot.classList.remove('active');
        if (i === index) {
            dot.classList.add('active');
        }
    });
    currentTestimonial = index;
}

// Utility functions
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function animateNumber(element, target) {
    let current = 0;
    const targetNum = parseInt(target);
    const increment = targetNum / 100;

    function update() {
        current += increment;
        if (current < targetNum) {
            element.innerText = Math.ceil(current);
            requestAnimationFrame(update);
        } else {
            element.innerText = targetNum;
        }
    }
    update();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
