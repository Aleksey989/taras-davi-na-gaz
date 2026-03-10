const products = {
    ticket: {
        name: 'Билет',
        price: '1 500 ₽',
        priceValue: 1500,
        desc: 'Поездка 30 минут'
    },
    certificate: {
        name: 'Подарочный сертификат',
        price: '3 000 ₽',
        priceValue: 3000,
        desc: 'Номинал 3000 ₽'
    }
};

let currentProduct = null;

// Инициализация EmailJS
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init('ub7ek0pZy8Qf-F1Y-');
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    initGallery();
});

function initGallery() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const thumbs = card.querySelectorAll('.thumb');
        const mainImg = card.querySelector('.gallery-img');
        if (thumbs.length > 0 && mainImg) {
            thumbs.forEach((thumb, index) => {
                thumb.addEventListener('click', function() {
                    thumbs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    mainImg.src = this.src;
                });
                if (index === 0) thumb.classList.add('active');
            });
        }
    });
}

function generateTicketCode() {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numbers = '0123456789';
    let code = 'TDNG-';
    for (let i = 0; i < 4; i++) code += letters.charAt(Math.floor(Math.random() * letters.length));
    code += '-';
    for (let i = 0; i < 4; i++) code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    return code;
}

function selectProduct(type) {
    currentProduct = type;
    const product = products[type];
    document.getElementById('order-type-text').textContent = product.name;
    document.getElementById('summary-product').textContent = product.name;
    document.getElementById('summary-price').textContent = product.price;
    const recipientGroup = document.getElementById('recipient-group');
    recipientGroup.style.display = type === 'certificate' ? 'block' : 'none';
    document.getElementById('products').style.display = 'none';
    document.getElementById('order').style.display = 'block';
    document.getElementById('name').focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() {
    document.getElementById('order').style.display = 'none';
    document.getElementById('products').style.display = 'block';
    document.getElementById('order-form').reset();
    clearErrors();
    currentProduct = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateForm() {
    let isValid = true;
    clearErrors();
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    
    if (!name.value.trim()) { showError('name', 'Введите имя'); isValid = false; }
    if (!phone.value.trim()) { showError('phone', 'Введите телефон'); isValid = false; }
    else if (!isValidPhone(phone.value)) { showError('phone', 'Неверный номер'); isValid = false; }
    if (!email.value.trim()) { showError('email', 'Введите email'); isValid = false; }
    else if (!isValidEmail(email.value)) { showError('email', 'Неверный email'); isValid = false; }
    return isValid;
}

function isValidPhone(phone) { return phone.replace(/\D/g, '').length >= 10; }
function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

function showError(fieldId, message) {
    document.getElementById(fieldId).classList.add('error');
    document.getElementById(fieldId + '-error').textContent = message;
}

function clearErrors() {
    document.querySelectorAll('.form-input').forEach(i => i.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(e => e.textContent = '');
}

function sendEmail(ticketCode, customerEmail, customerName) {
    const templateParams = {
        to_email: customerEmail,
        name: customerName,
        ticket_code: ticketCode,
        product_type: products[currentProduct].name,
        product_desc: products[currentProduct].desc,
        product_price: products[currentProduct].price,
        date: new Date().toLocaleDateString('ru-RU')
    };
    emailjs.send('default_service', 'ticket_template', templateParams)
        .then(function(response) { console.log('Email отправлен!', response.status); },
        function(error) { console.log('Ошибка email:', error); });
}

function submitOrder(event) {
    event.preventDefault();
    if (!validateForm()) return;
    
    const form = document.getElementById('order-form');
    const formData = new FormData(form);
    const ticketCode = generateTicketCode();
    const customerEmail = formData.get('email');
    const customerName = formData.get('name');
    
    // Отправляем email
    sendEmail(ticketCode, customerEmail, customerName);
    
    // Показываем билет
    document.getElementById('ticket-code').textContent = ticketCode;
    document.getElementById('ticket-type').textContent = products[currentProduct].name;
    document.getElementById('ticket-desc').textContent = products[currentProduct].desc;
    document.getElementById('ticket-price').textContent = products[currentProduct].price;
    document.getElementById('ticket-name').textContent = customerName;
    document.getElementById('ticket-date').textContent = new Date().toLocaleDateString('ru-RU');
    
    document.getElementById('order').style.display = 'none';
    document.getElementById('ticket').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('ticket').style.display = 'none';
    document.getElementById('products').style.display = 'block';
    document.getElementById('order-form').reset();
    currentProduct = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.length <= 1) value = '+' + value;
        else if (value.length <= 4) value = '+' + value;
        else if (value.length <= 7) value = '+' + value.slice(0,1) + ' (' + value.slice(1);
        else if (value.length <= 9) value = '+' + value.slice(0,1) + ' (' + value.slice(1,4) + ') ' + value.slice(4);
        else value = '+' + value.slice(0,1) + ' (' + value.slice(1,4) + ') ' + value.slice(4,7) + '-' + value.slice(7,9) + '-' + value.slice(9,11);
    }
    e.target.value = value;
});