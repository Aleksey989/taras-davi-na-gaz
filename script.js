const products = {
    ticket: { name: 'Билет', price: 1500, desc: 'Поездка 30 минут' },
    certificate: { name: 'Подарочный сертификат', price: 3000, desc: 'Номинал 3000 ₽' }
};

let currentProduct = 'ticket';

function selectProduct(type) {
    currentProduct = type;
    document.getElementById('order-type-text').textContent = products[type].name;
    document.getElementById('summary-product').textContent = products[type].name;
    document.getElementById('summary-price').textContent = products[type].price + ' ₽';
    document.getElementById('recipient-group').style.display = type === 'certificate' ? 'block' : 'none';
    document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
}

function generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'TDNG-';
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    code += '-';
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

function sendEmail(name, email, ticketCode, productType, productDesc, productPrice, date) {
    const templateParams = { 
        email: email,
        name: name, 
        ticket_code: ticketCode, 
        product_type: productType, 
        product_desc: productDesc, 
        product_price: productPrice, 
        date: date 
    };
    
    emailjs.send('service_uv8o5xb', 'template_nvsb1bz', templateParams)
        .then(function(response) {
            console.log('Email отправлен!', response.status, response.text);
            alert('Билет отправлен на email!');
        }, function(error) {
            console.log('Ошибка:', error);
            alert('Ошибка отправки email');
        });
}

function submitOrder(e) {
    e.preventDefault();
    
    if (!currentProduct) {
        alert('Выберите билет или сертификат');
        return;
    }
    
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    
    let valid = true;
    if (name.length < 2) { document.getElementById('name-error').textContent = 'Введите имя'; valid = false; } else document.getElementById('name-error').textContent = '';
    if (phone.length < 10) { document.getElementById('phone-error').textContent = 'Введите телефон'; valid = false; } else document.getElementById('phone-error').textContent = '';
    if (!email.includes('@')) { document.getElementById('email-error').textContent = 'Введите email'; valid = false; } else document.getElementById('email-error').textContent = '';
    
    if (!valid) return;
    
    const ticketCode = generateCode();
    const product = products[currentProduct];
    const date = new Date().toLocaleDateString('ru-RU');
    
    document.getElementById('ticket-type').textContent = product.name;
    document.getElementById('ticket-code').textContent = ticketCode;
    document.getElementById('ticket-desc').textContent = product.desc;
    document.getElementById('ticket-price').textContent = product.price + ' ₽';
    document.getElementById('ticket-name').textContent = name;
    document.getElementById('ticket-date').textContent = date;
    
    document.getElementById('products').style.display = 'none';
    document.getElementById('order').style.display = 'none';
    document.getElementById('ticket').style.display = 'block';
    
    sendEmail(name, email, ticketCode, product.name, product.desc, product.price + ' ₽', date);
}

function resetForm() {
    document.getElementById('ticket').style.display = 'none';
    document.getElementById('products').style.display = 'block';
    document.getElementById('order').style.display = 'block';
    document.getElementById('order-form').reset();
    currentProduct = 'ticket';
    selectProduct('ticket');
}
