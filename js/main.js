document.addEventListener('DOMContentLoaded', () => {
    // Product Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked button
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Modal Details functionality
    const modal = document.getElementById('productModal');
    const closeBtn = document.querySelector('.close-btn');
    const viewDetailBtns = document.querySelectorAll('.view-details');
    
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalSpecsText = document.getElementById('modalSpecsText');
    const modalBuyBtn = document.querySelector('.modal-buy-btn');

    viewDetailBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            const specs = btn.getAttribute('data-specs');
            const price = btn.getAttribute('data-price');

            modalTitle.textContent = name;
            modalPrice.textContent = 'Giá: ' + price;
            modalSpecsText.textContent = specs;
            
            modal.style.display = 'flex';
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    modalBuyBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Contact Form Submission Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            
            if (name && phone) {
                alert(`Cảm ơn bạn ${name}! Yêu cầu tư vấn của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ lại qua số ${phone} trong thời gian sớm nhất.`);
                contactForm.reset();
            }
        });
    }
});
