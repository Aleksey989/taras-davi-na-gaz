var products = {
  ticket: { name: "Билет", price: 1500, desc: "Поездка 30 минут" },
  certificate: { name: "Подарочный сертификат", price: 3000, desc: "Именной сертификат" }
};

// Инициализация EmailJS
if (typeof emailjs !== 'undefined') {
  emailjs.init("ub7ek0pZy8Qf-F1Y-");
}

var currentProduct = null;

function selectProduct(type) {
  currentProduct = type;
  document.getElementById("order-type-text").textContent = products[type].name;
  document.getElementById("summary-product").textContent = products[type].name;
  document.getElementById("summary-price").textContent = products[type].price + " ₽";
  document.getElementById("recipient-group").style.display = type === "certificate" ? "block" : "none";
  
  document.getElementById("products").style.display = "none";
  document.getElementById("order").style.display = "block";
  document.getElementById("order").scrollIntoView({ behavior: "smooth" });
}

function goBack() {
  document.getElementById("order").style.display = "none";
  document.getElementById("products").style.display = "block";
  document.getElementById("order-form").reset();
  clearErrors();
}

function clearErrors() {
  document.querySelectorAll(".error-message").forEach(function(el) { el.textContent = ""; });
  document.getElementById("agreements-error").textContent = "";
}

function generateOrderId() {
  var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  var code = "TDNG-";
  for (var i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  code += "-";
  for (var i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function submitOrder(e) {
  e.preventDefault();
  
  if (!currentProduct) {
    alert("Выберите билет или сертификат");
    return;
  }
  
  var name = document.getElementById("name").value.trim();
  var phone = document.getElementById("phone").value.trim();
  var email = document.getElementById("email").value.trim();
  var comment = document.getElementById("comment").value.trim();
  
  var valid = true;
  clearErrors();
  
  if (name.length < 2) {
    document.getElementById("name-error").textContent = "Введите имя";
    valid = false;
  }
  if (phone.length < 10) {
    document.getElementById("phone-error").textContent = "Введите телефон";
    valid = false;
  }
  if (!email.includes("@")) {
    document.getElementById("email-error").textContent = "Введите корректный email";
    valid = false;
  }
  
  var agreeOffer = document.getElementById("agree-offer").checked;
  var agreePrivacy = document.getElementById("agree-privacy").checked;
  var agreeRules = document.getElementById("agree-rules").checked;
  
  if (!agreeOffer || !agreePrivacy || !agreeRules) {
    document.getElementById("agreements-error").textContent = "Необходимо согласиться со всеми условиями";
    valid = false;
  }
  
  if (!valid) return;
  
  var orderId = generateOrderId();
  var product = products[currentProduct];
  
  console.log("Заказ:", { orderId: orderId, name: name, phone: phone, email: email, product: product.name, price: product.price + " ₽" });
  
  // Отправить email
  sendEmail(orderId, name, email, product.name, product.price + " ₽", product.desc);
  
  // Показать успех
  document.getElementById("order-id").textContent = orderId;
  document.getElementById("products").style.display = "none";
  document.getElementById("order").style.display = "none";
  document.getElementById("success").style.display = "block";
  document.getElementById("success").scrollIntoView({ behavior: "smooth" });
}

function resetForm() {
  document.getElementById("success").style.display = "none";
  document.getElementById("products").style.display = "block";
  document.getElementById("order-form").reset();
  currentProduct = null;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function sendEmail(orderId, name, email, product, price, productDesc) {
  if (typeof emailjs === 'undefined') {
    console.log('EmailJS не загружен');
    return;
  }
  
  var templateParams = {
    name: name,
    ticket_code: orderId,
    product_type: product,
    product_desc: productDesc,
    product_price: price,
    date: new Date().toLocaleDateString('ru-RU')
  };
  
  emailjs.send('service_uv8o5xb', 'template_nvsb1bz', templateParams)
    .then(function(response) {
      console.log('Email отправлен!', response.status, response.text);
    }, function(error) {
      console.log('Ошибка отправки email:', error);
    });
}
