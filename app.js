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
const contactFormStatus = document.getElementById('contact-form-status');
const testimonialSlider = document.getElementById('testimonial-slider');
const testimonialItems = document.querySelectorAll('.testimonial-item');
const navDots = document.querySelectorAll('.nav-dot');
const addTestimonialBtn = document.getElementById('add-testimonial-btn');
const testimonialModal = document.getElementById('testimonial-modal');
const closeBtn = testimonialModal.querySelector('.close-btn');
const testimonialForm = document.getElementById('testimonial-form');
const testimonialFormStatus = document.getElementById('testimonial-form-status');

// --- GOOGLE APPS SCRIPT URLS ---
// BẠN CẦN THAY THẾ CÁC URL DƯỚI ĐÂY BẰNG URL DEPLOYMENT CỦA GOOGLE APPS SCRIPT CỦA BẠN
const CONTACT_SCRIPT_URL = 'https://https://script.google.com/macros/s/AKfycbxLi9ypZnprxdGaV383OpXzaeHZ0nebVTqggRl2IW0b7Kx0F-tBCEtPsyYulN0phT7i/exec.google.com/spreadsheets/d/1qTgpyOMhP0QfmHQgSHLQSB_jwrFakv8fraUDHRFotiE/edit?gid=0#gid=0';
const TESTIMONIAL_SCRIPT_URL = 'https://docs.https://script.google.com/macros/s/AKfycbzKedoGxzuftwu-GVbEj5Ty9r2M72cyPU0lVr5ttgeh45gYGLhE51gHCgfu5P9M7l_V/exec.com/spreadsheets/d/1qTgpyOMhP0QfmHQgSHLQSB_jwrFakv8fraUDHRFotiE/edit?gid=1944847481#gid=1944847481';

// Global Variables
let currentTestimonial = 0;
let isLoading = true;
let isDarkMode = localStorage.getItem('theme') === 'dark' || 
                 (localStorage.getItem('theme') === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

// Initializer function
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    window.addEventListener('load', () => {
        loadingScreen.classList.add('hidden');
        isLoading = false;
        animateOnScroll();
        startTypingEffect();
    });
    setupEventListeners();
    updateTheme(isDarkMode);
    updateActiveNavLink();
    showTestimonial(currentTestimonial);
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialSlider.children.length;
        showTestimonial(currentTestimonial);
    }, 5000);
    initParticles();
}

function setupEventListeners() {
    window.addEventListener('scroll', () => {
        handleScroll();
        animateOnScroll();
        updateActiveNavLink();
    });

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            updateTheme(isDarkMode);
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        });
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    navDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideIndex = parseInt(e.target.dataset.slide);
            showTestimonial(slideIndex);
        });
    });

    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    if (addTestimonialBtn) {
        addTestimonialBtn.addEventListener('click', () => testimonialModal.classList.add('show'));
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => testimonialModal.classList.remove('show'));
    }

    window.addEventListener('click', (e) => {
        if (e.target == testimonialModal) {
            testimonialModal.classList.remove('show');
        }
    });

    if (testimonialForm) {
        testimonialForm.addEventListener('submit', handleFormSubmit);
    }

    document.querySelectorAll('.ripple-effect').forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

function handleScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    backToTopBtn.classList.toggle('show', window.scrollY > 300);
    backToTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progressBar.style.width = `${(window.scrollY / scrollHeight) * 100}%`;
}

function animateOnScroll() {
    if (isLoading) return;

    skillProgressBars.forEach(bar => {
        const skillPercent = bar.querySelector('.skill-percent');
        if (isElementInViewport(bar) && !bar.classList.contains('animated')) {
            bar.style.width = bar.dataset.progress;
            animateNumber(skillPercent, bar.dataset.progress.replace('%', ''), '%');
            bar.classList.add('animated');
        }
    });

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
        themeIcon.className = `fas ${isDark ? 'fa-moon' : 'fa-sun'}`;
    }
}

function updateActiveNavLink() {
    let currentSection = '';
    document.querySelectorAll('main section').forEach(section => {
        if (window.scrollY >= section.offsetTop - navbar.clientHeight - 5) {
            currentSection = section.id;
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href').substring(1) === currentSection);
    });
}

function startTypingEffect() {
    const words = ["Full Stack Developer.", "AI Specialist.", "Problem Solver."];
    let wordIndex = 0, charIndex = 0, isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        const cursorSpan = '<span class="typing-cursor">|</span>';
        charIndex += isDeleting ? -1 : 1;
        typingText.innerHTML = currentWord.substring(0, charIndex) + cursorSpan;
        let typeSpeed = isDeleting ? 100 : 150;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
        setTimeout(type, typeSpeed);
    }
    if (typingText) type();
}

function showTestimonial(index) {
    const allItems = testimonialSlider.children;
    Array.from(allItems).forEach((item, i) => item.classList.toggle('active', i === index));
    navDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    currentTestimonial = index;
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const statusEl = form.id === 'contact-form' ? contactFormStatus : testimonialFormStatus;
    const url = form.id === 'contact-form' ? CONTACT_SCRIPT_URL : TESTIMONIAL_SCRIPT_URL;

    // Check if the placeholder URL is still being used
    if (url.includes('YOUR_GOOGLE_APPS_SCRIPT_URL')) {
        showFormStatus(statusEl, 'Lỗi: Vui lòng cấu hình URL của Google Apps Script trong file app.js.', 'error');
        return;
    }
    
    showFormStatus(statusEl, 'Đang gửi...', 'loading');
    const formData = new FormData(form);

    fetch(url, { method: 'POST', body: formData})
      .then(response => response.json())
      .then(data => {
        if(data.result === 'success') {
            showFormStatus(statusEl, 'Gửi thành công! Cảm ơn bạn.', 'success');
            form.reset();
            if(form.id === 'testimonial-form') {
                 setTimeout(() => testimonialModal.classList.remove('show'), 2000);
                 // Optionally, you can dynamically add the new testimonial here
            }
        } else {
            throw new Error(data.message || 'Có lỗi xảy ra.');
        }
      }).catch(error => {
        showFormStatus(statusEl, `Lỗi: ${error.message}`, 'error');
      });
}

function showFormStatus(element, message, type) {
    element.style.display = 'block';
    element.className = type; // 'success' or 'error'
    element.textContent = message;
    if(type === 'success' || type === 'error'){
        setTimeout(() => { element.style.display = 'none'; }, 5000);
    }
}

function createRipple(e) {
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");
    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) { ripple.remove(); }
    button.appendChild(circle);
}

function initParticles() {
    if(document.getElementById('particles-js')) {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 50, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": true },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": false },
                "move": { "enable": true, "speed": 2, "direction": "none", "random": true, "straight": false, "out_mode": "out" }
            },
            "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "bubble" }, "resize": true }, "modes": { "bubble": { "distance": 200, "size": 6, "duration": 2, "opacity": 0.8 } } },
            "retina_detect": true
        });
    }
}

// Utility functions
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom >= 0;
}

function animateNumber(element, target, suffix = '') {
    let current = 0;
    const targetNum = parseInt(target);
    const step = Math.max(1, Math.ceil(targetNum / 100));

    function update() {
        current += step;
        if (current < targetNum) {
            element.innerText = current + suffix;
            requestAnimationFrame(update);
        } else {
            element.innerText = targetNum + suffix;
        }
    }
    update();
}
