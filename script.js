/**
 * Logics for Apple P12 Website
 * 1. Filtering Download Items (eSign, Cert, Mods)
 * 2. Fade-in Animation on Scroll
 * 3. Modal (Popup) functionality
 * 4. Particles.js Initialization
 * 5. Dynamic Download Count Update
 */

// ===================================
// 5. CẬP NHẬT LƯỢT TẢI XUỐNG ĐỘNG
// ===================================

/**
 * Cập nhật số lượt tải xuống cho các mục eSign bằng cách thêm một lượng ngẫu nhiên
 * (Mô phỏng lượt tải mới cho mỗi lần load trang).
 */
function updateDownloadCounts() {
    const eSignItems = document.querySelectorAll('.lux-card[data-category="esign"]');
    
    eSignItems.forEach(item => {
        // Lấy phần tử chứa lượt tải xuống
        const pElement = item.querySelector('.download-count span:last-child');
        
        // Lấy số lượt tải ban đầu từ thuộc tính data-initial-downloads
        const initialCount = parseInt(item.getAttribute('data-initial-downloads') || '0');
        
        // Thêm một lượng ngẫu nhiên (từ 5 đến 50)
        const increment = Math.floor(Math.random() * 46) + 5; 
        
        const newCount = initialCount + increment;
        
        // Cập nhật lại thuộc tính để lần tải sau vẫn tính từ giá trị mới
        item.setAttribute('data-initial-downloads', newCount);

        // Cập nhật nội dung hiển thị (dùng toLocaleString để định dạng số)
        pElement.textContent = `Đã tải: ${newCount.toLocaleString('vi-VN')} lượt`;
    });
}


// ===================================
// 3. CHỨC NĂNG MODAL (HỘP THOẠI)
// ===================================
const policyModal = document.getElementById('policyModal');

/**
 * Mở Modal theo ID và chọn tab mặc định.
 * @param {string} tabId 'intro' hoặc 'policy'
 */
function openModal(tabId) {
    if (!policyModal) return;
    policyModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    changeModalTab(tabId);
}

/**
 * Thay đổi tab trong modal
 * @param {string} tabId 'intro' hoặc 'policy'
 */
function changeModalTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
        tab.classList.remove('active');
    });

    // Show selected tab content
    const content = document.getElementById(tabId + 'Tab');
    if(content) {
        content.classList.remove('hidden');
        content.classList.add('active');
    }

    // Update tab buttons
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.classList.remove('active', 'text-[--lux-gold]', 'border-b-2', 'border-[--lux-gold]');
        tab.classList.add('text-gray-400', 'hover:text-white');
    });

    // Activate current tab button
    const activeTabButton = Array.from(document.querySelectorAll('.modal-tab')).find(btn => 
        btn.getAttribute('onclick').includes(tabId)
    );
    if (activeTabButton) {
        activeTabButton.classList.add('active', 'text-[--lux-gold]', 'border-b-2', 'border-[--lux-gold]');
        activeTabButton.classList.remove('text-gray-400', 'hover:text-white');
    }
}

/**
 * Đóng Modal hiện tại
 */
function closeModal() {
    if (!policyModal) return;
    policyModal.classList.remove('open');
    document.body.style.overflow = ''; // Cho phép cuộn trang chính lại
}

// Gán hàm vào window để có thể gọi từ HTML inline
window.openModal = openModal;
window.closeModal = closeModal;
window.changeModalTab = changeModalTab;


// ===================================
// 1. CHỨC NĂNG LỌC MỤC TẢI XUỐNG
// ===================================

/**
 * Lọc các mục tải xuống dựa trên danh mục.
 * @param {HTMLElement | null} clickedButton Nút filter vừa được click.
 * @param {string} category Danh mục để lọc ('esign', 'cert', 'mods').
 */
function filterItems(clickedButton, category) {
    const items = document.querySelectorAll('#downloads-container .lux-card');
    const buttons = document.querySelectorAll('.filter-button');

    // Ẩn tất cả các mục
    items.forEach(item => {
        item.style.display = 'none';
        item.classList.remove('fade-in', 'visible'); // Reset hiệu ứng
        item.style.transitionDelay = '0s'; // Reset delay
    });

    // Loại bỏ class 'active' khỏi tất cả các nút
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // Thêm class 'active' cho nút vừa được nhấn (hoặc nút mặc định)
    if (clickedButton) {
        clickedButton.classList.add('active');
    } else {
         // Trường hợp mặc định cho 'esign'
        const defaultButton = Array.from(buttons).find(btn => btn.textContent.toLowerCase().includes(category.toLowerCase()));
        if (defaultButton) {
            defaultButton.classList.add('active');
        }
    }


    // Lọc và hiển thị các mục tương ứng với danh mục
    const filteredItems = document.querySelectorAll(`#downloads-container .lux-card[data-category="${category}"]`);
    
    filteredItems.forEach((item, index) => {
        // Hiển thị và áp dụng hiệu ứng fade-in cho mục mới
        item.style.display = 'flex'; // Trả về display flex cho layout ban đầu
        
        // Sử dụng delay dựa trên index cho hiệu ứng cuộn mượt mà
        item.style.transitionDelay = `${index * 0.1}s`; 
        item.classList.add('fade-in'); 
        
        // Sử dụng setTimeout để đảm bảo item được hiển thị trước khi áp dụng fade-in
        setTimeout(() => {
            item.classList.add('visible');
        }, index * 100); 
    });
}

// Gán hàm vào window để có thể gọi từ HTML inline
window.filterItems = filterItems;


// ===================================
// 2. HIỆU ỨNG CUỘN (FADE-IN)
// ===================================

/**
 * Kiểm tra và áp dụng hiệu ứng fade-in cho các phần tử khi chúng nằm trong viewport.
 */
function handleScrollFadeIn() {
    const fadeInElements = document.querySelectorAll('.fade-in');
    
    fadeInElements.forEach(element => {
        // Lấy vị trí của phần tử so với viewport
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        // Nếu phần tử nằm trong khoảng 85% chiều cao của viewport
        if (elementTop < windowHeight * 0.85) {
            element.classList.add('visible');
        }
    });
}

// ===================================
// 4. KHỞI TẠO PARTICLES.JS
// ===================================
function initParticles() {
    if (typeof particlesJS === 'undefined') {
        console.warn("particlesJS not loaded. Skipping particle initialization.");
        return;
    }
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": { "enable": true, "value_area": 800 }
            },
            "color": { "value": "#C8AA74" }, /* New Rich Gold Color */
            "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" } },
            "opacity": {
                "value": 0.5,
                "random": true,
                "anim": { "enable": true, "speed": 0.8, "opacity_min": 0.1, "sync": false }
            },
            "size": {
                "value": 2.5, /* Slightly smaller */
                "random": true,
                "anim": { "enable": true, "speed": 1.5, "size_min": 0.1, "sync": false }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#C8AA74",
                "opacity": 0.2, /* More subtle lines */
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 0.8, /* Slower movement */
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": { "enable": true, "rotateX": 600, "rotateY": 1200 }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": { "enable": true, "mode": "grab" },
                "onclick": { "enable": true, "mode": "push" },
                "resize": true
            },
            "modes": {
                "grab": { "distance": 140, "line_linked": { "opacity": 0.8 } },
                "push": { "particles_nb": 4 }
            }
        },
        "retina_detect": true
    });
}


// ===================================
// KHỞI TẠO TỔNG THỂ
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Kích hoạt fade-in ngay lập tức cho các phần tử ở trên cùng
    handleScrollFadeIn();
});

window.addEventListener('scroll', handleScrollFadeIn);

window.addEventListener('load', () => {
    // 1. Khởi tạo Particles
    initParticles(); 
    
    // 2. Cập nhật lượt tải xuống động
    updateDownloadCounts(); 

    // 3. Thiết lập mặc định cho chức năng lọc (eSign)
    filterItems(document.querySelector('.filter-button:first-child'), 'esign'); 
});
