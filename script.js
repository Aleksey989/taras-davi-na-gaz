var PUBLIC_KEY = "ub7ek0pZy8Qf-F1Y-";
var SERVICE_ID = "service_uv8o5xb";
var TEMPLATE_ID = "template_nvsb1bz";

var products = {
  ticket: { 
    name: "Билет", 
    price: 1500, 
    desc: "Поездка 30 минут",
    image: "https://aleksey989.github.io/taras-davi-na-gaz/img/photo_2026-02-06_18-24-18.jpg"
  },
  certificate: { 
    name: "Подарочный сертификат", 
    price: 3000, 
    desc: "Именной сертификат",
    image: "https://aleksey989.github.io/taras-davi-na-gaz/img/photo_2026-02-13_18-37-39.jpg"
  }
};

var currentProduct = null;

function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    try {
      emailjs.init({
        publicKey: PUBLIC_KEY,
        limitRate: true
      });
      console.log('EmailJS инициализирован');
    } catch(e) {
      console.log('Ошибка инициализации:', e);
    }
  }
}

initEmailJS();

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
  
  sendEmailTest(orderId, name, email, product.name, product.price + " ₽", product.desc);
  
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

function sendEmailTest(orderId, name, email, product, price, productDesc) {
  console.log("=== ТЕСТ ===");
  console.log("SERVICE:", SERVICE_ID, "TEMPLATE:", TEMPLATE_ID);
  
  if (typeof emailjs === 'undefined') {
    alert('EmailJS не загружен');
    return;
  }
  
  emailjs.send(SERVICE_ID, TEMPLATE_ID)
    .then(function(response) {
      console.log('УСПЕХ!', response);
      alert('Работает!');
    }, function(error) {
      console.log('ОШИБКА:', error.status, error.text);
      alert('Ошибка ' + error.status + ': ' + error.text);
    });
}
