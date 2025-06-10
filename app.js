const loadingScreen = document.getElementById('loading-screen');
const navbar = document.getElementById('navbar');
const progressBar = document.getElementById('progress-bar');
const backToTopBtn = document.getElementById('back-to-top');
const themeIcon = document.getElementById('theme-icon');
const skillProgressBars = document.querySelectorAll('.skill-progress');
const statNumbers = document.querySelectorAll('.stat-number');
const typingText = document.getElementById('typing-text');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const testimonialItems = document.querySelectorAll('.testimonial-item');
const navDots = document.querySelectorAll('.nav-dot');
const downloadCvBtn = document.getElementById('download-cv');

// Global Variables
let currentTestimonial = 0;
let isLoading = true;
let isDarkMode = false;

// Check if user prefers dark mode
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-color-scheme', 'dark');
    themeIcon.classList.replace('fa-sun', 'fa-moon');
    isDarkMode = true;
}

// Initialize Particles.js Background
document.addEventListener('DOMContentLoaded', function() {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: isDarkMode ? '#32b8c6' : '#21808d'
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                }
            },
            opacity: {
                value: 0.5,
                random: false,
                anim: {
                    enable: false,
                    speed: