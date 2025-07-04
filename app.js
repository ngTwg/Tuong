document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const navbar = document.getElementById('navbar');
    const copyButtons = document.querySelectorAll('.copy-btn');
    const fadeInElements = document.querySelectorAll('.fade-in');
    const serviceCards = document.querySelectorAll('.service-card');

    // Loading Screen
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1000);
    
    // Particles.js Config
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
          "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#58A6FF" },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.5, "random": true },
            "size": { "value": 3, "random": true },
            "line_linked": { "enable": true, "distance": 150, "color": "#58A6FF", "opacity": 0.1 },
            "move": { "enable": true, "speed": 1, "direction": "none", "out_mode": "out" }
          },
          "interactivity": {
            "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": false } },
            "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.3 } } }
          }
        });
    }

    // Scroll Animations
    const handleScroll = () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        fadeInElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9) {
                el.classList.add('show');
            }
        });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Copy to Clipboard
    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const textToCopy = button.getAttribute('data-copy');
            const originalText = button.textContent;
            try {
                await navigator.clipboard.writeText(textToCopy);
                button.textContent = 'Đã chép!';
            } catch (err) {
                button.textContent = 'Lỗi!';
            }
            setTimeout(() => {
                button.textContent = 'Sao Chép';
            }, 2000);
        });
    });

    // Service Card Interaction
    serviceCards.forEach(card => {
        if (!card.querySelector('.contact-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'contact-overlay';
            const serviceName = card.querySelector('.service-card-title').textContent;
            const encodedServiceName = encodeURIComponent(serviceName);
            
            overlay.innerHTML = `
                <a href="https://m.me/ngtu.ong14.11?text=Tôi%20muốn%20mua%20gói%20${encodedServiceName}" target="_blank" class="social-link" title="Messenger"><i class="fab fa-facebook-messenger"></i></a>
                <a href="https://zalo.me/0365297935?text=Tôi%20muốn%20mua%20gói%20${encodedServiceName}" target="_blank" class="social-link" title="Zalo"><i class="fas fa-comment"></i></a>
                <a href="https://www.instagram.com/ngtu.ong14.11/" target="_blank" class="social-link" title="Instagram"><i class="fab fa-instagram"></i></a>
            `;
            
            card.appendChild(overlay);
        }
        
        card.addEventListener('click', (e) => {
            if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
                if (!e.target.closest('.contact-overlay a')) {
                     document.querySelectorAll('.service-card.overlay-active').forEach(openCard => {
                         if(openCard !== card) {
                             openCard.classList.remove('overlay-active');
                         }
                     });
                     card.classList.toggle('overlay-active');
                }
            }
        });
    });
});

