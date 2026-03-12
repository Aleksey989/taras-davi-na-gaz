const products = {
    ticket: { name: 'Билет', price: 1500, desc: 'Поездка 30 минут', image: 'https://aleksey989.github.io/taras-davi-na-gaz/img/photo_2026-02-06_18-24-18.jpg' },
    certificate: { name: 'Подарочный сертификат', price: 3000, desc: 'Номинал 3000 ₽', image: 'https://aleksey989.github.io/taras-davi-na-gaz/img/photo_2026-02-13_18-37-39.jpg' }
};

let currentProduct = 'ticket';

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbykVIjNGH_2x1NIWoRR4iuLtMriMBPv3Q63ZDzkJy4uHGkxgzOkPVD54puGSPBpxg/exec';

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

function saveToGoogleSheet(data) {
    console.log('Отправка в таблицу:', data);
    
    var url = GOOGLE_SHEET_URL + 
        '?name=' + encodeURIComponent(data.name) +
        '&phone=' + encodeURIComponent(data.phone) +
        '&email=' + encodeURIComponent(data.email) +
        '&product=' + encodeURIComponent(data.product) +
        '&ticketCode=' + encodeURIComponent(data.ticketCode) +
        '&price=' + encodeURIComponent(data.price);
    
    // Используем fetch с no-cors - запрос отправится, но ответ не получим
    fetch(url, { mode: 'no-cors' })
        .then(() => console.log('Запрос отправлен'))
        .catch(err => console.error('Ошибка:', err));
}

function sendEmail(name, email, ticketCode, productType, productDesc, productPrice, date, imageUrl) {
    const templateParams = { 
        email: email,
        name: name, 
        ticket_code: ticketCode, 
        product_type: productType, 
        product_desc: productDesc, 
        product_price: productPrice, 
        date: date,
        image_url: imageUrl
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
    
    saveToGoogleSheet({
        name: name,
        phone: phone,
        email: email,
        product: product.name,
        ticketCode: ticketCode,
        price: product.price + ' ₽'
    });
    
    document.getElementById('ticket-type').textContent = product.name;
    document.getElementById('ticket-code').textContent = ticketCode;
    document.getElementById('ticket-desc').textContent = product.desc;
    document.getElementById('ticket-price').textContent = product.price + ' ₽';
    document.getElementById('ticket-name').textContent = name;
    document.getElementById('ticket-date').textContent = date;
    
    document.getElementById('products').style.display = 'none';
    document.getElementById('order').style.display = 'none';
    document.getElementById('ticket').style.display = 'block';
    
    sendEmail(name, email, ticketCode, product.name, product.desc, product.price + ' ₽', date, product.image);
}

function resetForm() {
    document.getElementById('ticket').style.display = 'none';
    document.getElementById('products').style.display = 'block';
    document.getElementById('order').style.display = 'block';
    document.getElementById('order-form').reset();
    currentProduct = 'ticket';
    selectProduct('ticket');
}