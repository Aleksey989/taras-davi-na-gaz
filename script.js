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
                
                if (index === 0) {
                    thumb.classList.add('active');
                }
            });
        }
    });
}

function generateTicketCode() {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numbers = '0123456789';
    let code = 'TDNG-';
    
    for (let i = 0; i < 4; i++) {
        code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    code += '-';
    for (let i = 0; i < 4; i++) {
        code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return code;
}

function selectProduct(type) {
    currentProduct = type;
    
    const product = products[type];
    
    document.getElementById('order-type-text').textContent = product.name;
    document.getElementById('summary-product').textContent = product.name;
    document.getElementById('summary-price').textContent = product.price;
    
    const recipientGroup = document.getElementById('recipient-group');
    if (type === 'certificate') {
        recipientGroup.style.display = 'block';
    } else {
        recipientGroup.style.display = 'none';
    }
    
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
    
    if (!name.value.trim()) {
        showError('name', 'Пожалуйста, введите имя');
        isValid = false;
    }
    
    if (!phone.value.trim()) {
        showError('phone', 'Пожалуйста, введите телефон');
        isValid = false;
    } else if (!isValidPhone(phone.value)) {
        showError('phone', 'Введите корректный номер телефона');
        isValid = false;
    }
    
    if (!email.value.trim()) {
        showError('email', 'Пожалуйста, введите email');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError('email', 'Введите корректный email');
        isValid = false;
    }
    
    return isValid;
}

function isValidPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorSpan = document.getElementById(fieldId + '-error');
    
    input.classList.add('error');
    errorSpan.textContent = message;
}

function clearErrors() {
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => input.classList.remove('error'));
    
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => error.textContent = '');
}

function submitOrder(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const form = document.getElementById('order-form');
    const formData = new FormData(form);
    
    const ticketCode = generateTicketCode();
    
    const orderData = {
        id: ticketCode,
        product: products[currentProduct],
        customer: {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            recipientName: formData.get('recipient-name') || null,
            comment: formData.get('comment') || null
        },
        createdAt: new Date().toISOString()
    };
    
    console.log('Заказ оформлен:', orderData);
    
    // Заполняем данные билета
    document.getElementById('ticket-code').textContent = ticketCode;
    document.getElementById('ticket-type').textContent = products[currentProduct].name;
    document.getElementById('ticket-desc').textContent = products[currentProduct].desc;
    document.getElementById('ticket-price').textContent = products[currentProduct].price;
    document.getElementById('ticket-name').textContent = formData.get('name');
    document.getElementById('ticket-date').textContent = new Date().toLocaleDateString('ru-RU');
    
    document.getElementById('order').style.display = 'none';
    document.getElementById('success').style.display = 'none';
    document.getElementById('ticket').style.display = 'block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('ticket').style.display = 'none';
    document.getElementById('success').style.display = 'none';
    document.getElementById('products').style.display = 'block';
    document.getElementById('order-form').reset();
    currentProduct = null;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.length <= 1) {
            value = '+' + value;
        } else if (value.length <= 4) {
            value = '+' + value;
        } else if (value.length <= 7) {
            value = '+' + value.slice(0,1) + ' (' + value.slice(1);
        } else if (value.length <= 9) {
            value = '+' + value.slice(0,1) + ' (' + value.slice(1,4) + ') ' + value.slice(4);
        } else {
            value = '+' + value.slice(0,1) + ' (' + value.slice(1,4) + ') ' + value.slice(4,7) + '-' + value.slice(7,9) + '-' + value.slice(9,11);
        }
    }
    e.target.value = value;
});
