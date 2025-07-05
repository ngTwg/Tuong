document.addEventListener('DOMContentLoaded', () => {
    // --- KHAI BÁO BIẾN ---
    const loadingScreen = document.getElementById('loading-screen');
    const navbar = document.getElementById('navbar');
    const copyButtons = document.querySelectorAll('.copy-btn');
    const fadeInElements = document.querySelectorAll('.fade-in');
    const serviceCards = document.querySelectorAll('.service-card');

    // --- CÁC BIẾN CHO FORM VÀ MODAL ---
    const GAS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'; // !!! THAY THẾ URL CỦA BẠN VÀO ĐÂY
    const modal = document.getElementById('form-modal');
    const modalBody = document.getElementById('modal-body');
    const modalMessage = document.getElementById('modal-message');
    const closeModalBtn = document.querySelector('.close-button');
    const addReviewBtn = document.getElementById('add-review-btn');
    const contactForm = document.getElementById('contact-form');


    // --- CÁC HÀM XỬ LÝ ---

    // Màn hình tải trang
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1000);
    
    // Cấu hình Particles.js
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

    // Animation khi cuộn trang
    const handleScroll = () => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
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

    // Sao chép vào clipboard
    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const textToCopy = button.getAttribute('data-copy');
            const originalText = button.textContent;
            try {
                // Sử dụng phương pháp cũ hơn để tương thích rộng rãi
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);

                button.textContent = 'Đã chép!';
            } catch (err) {
                console.error('Lỗi sao chép: ', err);
                button.textContent = 'Lỗi!';
            }
            setTimeout(() => {
                button.textContent = 'Sao Chép';
            }, 2000);
        });
    });

    // Tương tác thẻ dịch vụ trên di động
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

    // --- LOGIC CHO MODAL VÀ FORM ---

    // Hàm hiển thị thông báo trong modal
    const showModalMessage = (message, type = 'success') => {
        modalMessage.textContent = message;
        modalMessage.className = `modal-message ${type}`;
        modalMessage.style.display = 'block';
    };

    // Hàm reset modal
    const resetModal = () => {
        modalBody.style.display = 'block';
        modalMessage.style.display = 'none';
        modalMessage.textContent = '';
        modalMessage.className = 'modal-message';
    };

    // Hàm mở modal
    const openModal = (content) => {
        resetModal();
        modalBody.innerHTML = content;
        modal.style.display = 'block';
    };

    // Hàm đóng modal
    const closeModal = () => {
        modal.style.display = 'none';
        modalBody.innerHTML = '';
    };

    // Xử lý khi click nút "Thêm đánh giá"
    if (addReviewBtn) {
        addReviewBtn.addEventListener('click', () => {
            const reviewFormHTML = `
                <h3 class="modal-title">Gửi đánh giá của bạn</h3>
                <form id="review-form">
                    <input type="hidden" name="formType" value="review">
                    <div class="form-group">
                        <input type="text" name="name" class="form-control" placeholder="Tên của bạn" required>
                    </div>
                    <div class="form-group">
                        <textarea name="message" class="form-control" rows="4" placeholder="Viết đánh giá của bạn ở đây..." required></textarea>
                    </div>
                    <button type="submit" class="btn btn--primary btn--full-width">Gửi đánh giá</button>
                </form>
            `;
            openModal(reviewFormHTML);
            // Thêm event listener cho form vừa tạo
            document.getElementById('review-form').addEventListener('submit', handleFormSubmit);
        });
    }

    // Xử lý khi submit form Liên hệ
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Ngăn submit mặc định
            // Mở modal và hiển thị form liên hệ bên trong
            const contactFormHTML = `
                <h3 class="modal-title">Gửi tin nhắn</h3>
                <form id="modal-contact-form">
                    <input type="hidden" name="formType" value="contact">
                    <div class="form-group">
                        <input type="text" name="name" class="form-control" placeholder="Họ và tên" required value="${contactForm.name.value}">
                    </div>
                    <div class="form-group">
                        <input type="email" name="email" class="form-control" placeholder="Email" required value="${contactForm.email.value}">
                    </div>
                    <div class="form-group">
                        <textarea name="message" class="form-control" rows="5" placeholder="Tin nhắn" required>${contactForm.message.value}</textarea>
                    </div>
                    <button type="submit" class="btn btn--primary btn--full-width">Xác nhận gửi</button>
                </form>
            `;
            openModal(contactFormHTML);
            // Thêm event listener cho form trong modal
            document.getElementById('modal-contact-form').addEventListener('submit', handleFormSubmit);
        });
    }

    // Hàm xử lý submit chung cho cả 2 form
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');

        if (GAS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            showModalMessage('Lỗi: Vui lòng cấu hình URL Google Apps Script trong file app.js', 'error');
            return;
        }

        showModalMessage('Đang gửi...', 'loading');
        submitButton.disabled = true;
        submitButton.textContent = 'Đang xử lý...';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(GAS_URL, {
                method: 'POST',
                mode: 'no-cors', // Cần thiết khi gọi Apps Script từ client-side
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                redirect: 'follow'
            });

            // Do mode 'no-cors', chúng ta không thể đọc response.
            // Vì vậy, chúng ta sẽ giả định là thành công và hiển thị thông báo.
            modalBody.style.display = 'none';
            showModalMessage('Cảm ơn bạn! Dữ liệu của bạn đã được gửi thành công.', 'success');
            form.reset();
            if (contactForm) contactForm.reset(); // Reset cả form gốc

        } catch (error) {
            console.error('Error:', error);
            showModalMessage('Đã có lỗi xảy ra. Vui lòng thử lại sau.', 'error');
        } finally {
            submitButton.disabled = false;
             if (data.formType === 'review') {
                submitButton.textContent = 'Gửi đánh giá';
            } else {
                submitButton.textContent = 'Xác nhận gửi';
            }
        }
    };

    // Đóng modal
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
});
