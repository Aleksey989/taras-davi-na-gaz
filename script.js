const products = {
  ticket: {
    name: "Билет",
    price: 1500,
    desc: "Поездка 30 минут",
    image:
      "https://aleksey989.github.io/taras-davi-na-gaz/img/photo_2026-02-06_18-24-18.jpg",
  },
  certificate: {
    name: "Подарочный сертификат",
    price: 3000,
    desc: "Номинал 3000 ₽",
    image:
      "https://aleksey989.github.io/taras-davi-na-gaz/img/photo_2026-02-13_18-37-39.jpg",
  },
};

let currentProduct = "ticket";

function selectProduct(type) {
  currentProduct = type;
  document.getElementById("order-type-text").textContent = products[type].name;
  document.getElementById("summary-product").textContent = products[type].name;
  document.getElementById("summary-price").textContent =
    products[type].price + " ₽";
  document.getElementById("recipient-group").style.display =
    type === "certificate" ? "block" : "none";
  document.getElementById("order").scrollIntoView({ behavior: "smooth" });
}

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "TDNG-";
  for (let i = 0; i < 4; i++)
    code += chars[Math.floor(Math.random() * chars.length)];
  code += "-";
  for (let i = 0; i < 4; i++)
    code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// Google Form - ID полей
const FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSdOTkJIsBuLF-xqwuA2rRlJ5lztw7lSfbMTcQp2JyxBDl1MFg/formResponse";
const FORM_FIELDS = {
  name: "1197681044",
  phone: "1980610743",
  email: "115970162",
  product: "1392074882",
  ticketCode: "310718083",
  price: "893407532",
};

function saveToGoogleForm(data) {
  // Используем новую форму
  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSfLhoOwQTS4LZ4XmJp2PexcaEE0Ux8PwkrkpSbZli1dMvZn7g/formResponse";

  // Создаем форму и отправляем
  const form = document.createElement("form");
  form.action = formUrl;
  form.method = "POST";
  form.target = "_blank";

  // Поля формы - нужно заполнить правильные ID
  // Пока используем универсальный подход
  const params = new URLSearchParams();
  params.append("entry.2005620554", data.name);
  params.append("entry.1831295012", data.phone);
  params.append("entry.1282890812", data.email);
  params.append("entry.1847820214", data.product);
  params.append("entry.1065041697", data.ticketCode);
  params.append("entry.1224496916", data.price);

  // Создаем скрытый iframe для отправки
  const iframe = document.createElement("iframe");
  iframe.name = "hidden-iframe";
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  form.action = formUrl + "?" + params.toString();
  form.target = "hidden-iframe";

  document.body.appendChild(form);
  form.submit();

  // Очищаем
  setTimeout(() => {
    document.body.removeChild(form);
    document.body.removeChild(iframe);
  }, 1000);

  console.log("Данные отправлены в Google Таблицу");
}

function sendEmail(
  name,
  email,
  ticketCode,
  productType,
  productDesc,
  productPrice,
  date,
  imageUrl,
) {
  const templateParams = {
    email: email,
    name: name,
    ticket_code: ticketCode,
    product_type: productType,
    product_desc: productDesc,
    product_price: productPrice,
    date: date,
    image_url: imageUrl,
  };

  emailjs.send("service_uv8o5xb", "template_nvsb1bz", templateParams).then(
    function (response) {
      console.log("Email отправлен!", response.status, response.text);
      alert("Билет отправлен на email!");
    },
    function (error) {
      console.log("Ошибка:", error);
      alert("Ошибка отправки email");
    },
  );
}

function submitOrder(e) {
  e.preventDefault();

  if (!currentProduct) {
    alert("Выберите билет или сертификат");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();

  let valid = true;
  if (name.length < 2) {
    document.getElementById("name-error").textContent = "Введите имя";
    valid = false;
  } else document.getElementById("name-error").textContent = "";
  if (phone.length < 10) {
    document.getElementById("phone-error").textContent = "Введите телефон";
    valid = false;
  } else document.getElementById("phone-error").textContent = "";
  if (!email.includes("@")) {
    document.getElementById("email-error").textContent = "Введите email";
    valid = false;
  } else document.getElementById("email-error").textContent = "";

  if (!valid) return;

  const ticketCode = generateCode();
  const product = products[currentProduct];
  const date = new Date().toLocaleDateString("ru-RU");

  // Логируем данные заказа (для отладки)
  console.log("Заказ:", {
    name,
    phone,
    email,
    product: product.name,
    ticketCode,
    price: product.price + " ₽",
  });

  document.getElementById("ticket-type").textContent = product.name;
  document.getElementById("ticket-code").textContent = ticketCode;
  document.getElementById("ticket-desc").textContent = product.desc;
  document.getElementById("ticket-price").textContent = product.price + " ₽";
  document.getElementById("ticket-name").textContent = name;
  document.getElementById("ticket-date").textContent = date;

  document.getElementById("products").style.display = "none";
  document.getElementById("order").style.display = "none";
  document.getElementById("ticket").style.display = "block";

  sendEmail(
    name,
    email,
    ticketCode,
    product.name,
    product.desc,
    product.price + " ₽",
    date,
    product.image,
  );
}

function resetForm() {
  document.getElementById("ticket").style.display = "none";
  document.getElementById("products").style.display = "block";
  document.getElementById("order").style.display = "block";
  document.getElementById("order-form").reset();
  currentProduct = "ticket";
  selectProduct("ticket");
}
