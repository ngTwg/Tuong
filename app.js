// DOM Elements
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
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: isDarkMode ? '#32b8c6' : '#21808d',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
});

// Loading Screen
window.addEventListener('load', function() {
    setTimeout(function() {
        loadingScreen.style.opacity = '0';
        setTimeout(function() {
            loadingScreen.style.display = 'none';
            isLoading = false;
            startAnimations();
        }, 500);
    }, 1500);
});

// Start animations after loading
function startAnimations() {
    // Start typing animation
    typeWriter();
    // Start stat counter animation
    animateStatNumbers();
    // Check for elements in viewport
    checkElementsInViewport();
}

// Typing Animation Effect
let textIndex = 0;
const textToType = 'Nguyễn Văn A';
let typingSpeed = 150; // in milliseconds

function typeWriter() {
    if (textIndex < textToType.length) {
        typingText.textContent += textToType.charAt(textIndex);
        textIndex++;
        setTimeout(typeWriter, typingSpeed);
    }
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Update progress bar
    const scrollPosition = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollPosition / documentHeight) * 100;
    progressBar.style.width = scrollPercentage + '%';

    // Show/hide back to top button
    if (scrollPosition > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }

    // Check elements in viewport for animations
    if (!isLoading) {
        checkElementsInViewport();
    }
});

// Back to top button
backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Theme toggle
themeIcon.parentElement.addEventListener('click', function() {
    if (isDarkMode) {
        document.documentElement.setAttribute('data-color-scheme', 'light');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.documentElement.setAttribute('data-color-scheme', 'dark');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }

    isDarkMode = !isDarkMode;
    // Update particles color
    if (window.pJSDom && window.pJSDom[0]) {
        window.pJSDom[0].pJS.particles.color.value = isDarkMode ? '#32b8c6' : '#21808d';
        window.pJSDom[0].pJS.particles.line_linked.color = isDarkMode ? '#32b8c6' : '#21808d';
        window.pJSDom[0].pJS.fn.particlesRefresh();
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
        });
    });
});

// Download CV button functionality
downloadCvBtn.addEventListener('click', function() {
    // This would typically download a CV file
    // For demo purposes, we'll just show an alert
    alert('CV tải xuống sẽ bắt đầu trong ứng dụng thực tế');
});

// Animate stat numbers
function animateStatNumbers() {
    statNumbers.forEach(statNumber => {
        const target = parseInt(statNumber.getAttribute('data-target'));
        const duration = 2000; // in milliseconds
        const increment = target / (duration / 50); // update every 50ms
        let current = 0;

        const updateCount = () => {
            if (current < target) {
                current += increment;
                statNumber.textContent = Math.ceil(current);
                setTimeout(updateCount, 50);
            } else {
                statNumber.textContent = target;
            }
        };

        updateCount();
    });
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
    );
}

// Check elements in viewport and animate them
function checkElementsInViewport() {
    // Fade in elements
    document.querySelectorAll('.fade-in').forEach(element => {
        if (isInViewport(element)) {
            element.classList.add('show');
        }
    });

    // Animate skill bars
    skillProgressBars.forEach(progressBar => {
        if (isInViewport(progressBar.parentElement.parentElement)) {
            const width = progressBar.getAttribute('data-width');
            progressBar.style.width = width + '%';
        }
    });
}

// Testimonial carousel
function showTestimonial(index) {
    testimonialItems.forEach((item, i) => {
        item.classList.remove('active');
        navDots[i].classList.remove('active');
    });
    testimonialItems[index].classList.add('active');
    navDots[index].classList.add('active');
    currentTestimonial = index;
}

// Testimonial navigation dots
navDots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
        showTestimonial(index);
    });
});

// Auto advance testimonials
setInterval(function() {
    currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
    showTestimonial(currentTestimonial);
}, 5000);

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