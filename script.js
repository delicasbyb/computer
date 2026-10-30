// Configura estos datos con el WhatsApp y la página reales del negocio.
const WHATSAPP_NUMBER = "594986570870";
const DEFAULT_MESSAGE = "Hola, me interesa cotizar un servicio de PC a domicilio en Quito, Ecuador.";

const currency = new Intl.NumberFormat("es-EC", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const quoteForm = document.querySelector("#quote-form");
const quoteTotal = document.querySelector("#quote-total");
const quoteFeedback = document.querySelector("#quote-feedback");

function openWhatsApp(message) {
  if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
    quoteFeedback.textContent = "Configura WHATSAPP_NUMBER en script.js con el número real, incluyendo código de país.";
    return;
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    quoteFeedback.textContent = "";
    openWhatsApp(DEFAULT_MESSAGE);
  });
});

document.querySelectorAll("[data-phone-link]").forEach((link) => {
  link.href = `tel:+${WHATSAPP_NUMBER}`;
});

function updateQuote() {
  const selected = [...quoteForm.querySelectorAll('input[name="service"]:checked')];
  const total = selected.reduce((sum, input) => sum + Number(input.dataset.price), 0);
  quoteTotal.innerHTML = `${currency.format(total)} <small>USD</small>`;
  quoteFeedback.textContent = "";
}

quoteForm.addEventListener("change", updateQuote);
quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selected = [...quoteForm.querySelectorAll('input[name="service"]:checked')];

  if (selected.length === 0) {
    quoteFeedback.textContent = "Selecciona al menos un servicio para preparar tu cotización.";
    return;
  }

  const total = selected.reduce((sum, input) => sum + Number(input.dataset.price), 0);
  const lines = selected.map((input) => `- ${input.value}: ${currency.format(Number(input.dataset.price))} USD`);
  const message = [
    "Hola, me interesa cotizar estos servicios:",
    ...lines,
    `Estimado: ${currency.format(total)} USD`,
    "Entiendo que el precio final, traslado e impuestos aplicables se confirman antes de contratar.",
  ].join("\n");

  openWhatsApp(message);
});

const reviewForm = document.querySelector("#review-form");
const reviewList = document.querySelector("#review-list");
const reviewFeedback = document.querySelector("#review-feedback");

function createReviewCard({ name, service, comment, rating }) {
  const card = document.createElement("article");
  card.className = "review-card";

  const top = document.createElement("div");
  top.className = "review-top";

  const avatar = document.createElement("div");
  avatar.className = "avatar avatar-cyan";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0].toUpperCase()).join("");

  const identity = document.createElement("div");
  const customerName = document.createElement("strong");
  customerName.textContent = name;
  const serviceName = document.createElement("small");
  serviceName.textContent = service;
  identity.append(customerName, serviceName);

  const stars = document.createElement("span");
  stars.className = "stars";
  stars.setAttribute("aria-label", `${rating} de 5 estrellas`);
  stars.textContent = `${"★".repeat(rating)}${"☆".repeat(5 - rating)}`;

  const quote = document.createElement("blockquote");
  quote.textContent = `“${comment}”`;
  const label = document.createElement("span");
  label.className = "sample-label";
  label.textContent = "VISTA PREVIA EN ESTE NAVEGADOR";

  top.append(avatar, identity, stars);
  card.append(top, quote, label);
  return card;
}

reviewForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!reviewForm.reportValidity()) return;

  const data = new FormData(reviewForm);
  const review = {
    name: String(data.get("name")).trim(),
    service: String(data.get("service")),
    comment: String(data.get("comment")).trim(),
    rating: Number(data.get("rating")),
  };

  document.querySelector("#review-empty")?.remove();
  reviewList.prepend(createReviewCard(review));
  reviewForm.reset();
  reviewFeedback.textContent = "Vista previa agregada en esta página. No se enviará ni guardará al cerrar o recargar.";
});

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
  menuToggle.innerHTML = `<i class="fa-solid ${isOpen ? "fa-bars" : "fa-xmark"}" aria-hidden="true"></i>`;
  mainNav.classList.toggle("is-open", !isOpen);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  });
});

document.querySelector("#current-year").textContent = new Date().getFullYear();

const cookieNotice = document.querySelector("#cookie-notice");
const cookieDismiss = document.querySelector("#cookie-dismiss");
const cookieNoticeKey = "techpro-privacy-notice-dismissed";

try {
  cookieNotice.hidden = localStorage.getItem(cookieNoticeKey) === "true";
} catch (error) {
  console.warn("No se pudo leer el almacenamiento local; el aviso de privacidad seguirá visible.", error);
}

cookieDismiss.addEventListener("click", () => {
  try {
    localStorage.setItem(cookieNoticeKey, "true");
    cookieNotice.hidden = true;
  } catch (error) {
    console.error("No se pudo guardar la preferencia del aviso de privacidad.", error);
  }
});

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  // Keep the image static for visitors who request reduced motion.
} else if (window.gsap && window.ScrollTrigger) {
  window.gsap.registerPlugin(window.ScrollTrigger);
  window.gsap.fromTo(".hero-photo-wrap",
    { scale: 0.9 },
    {
      scale: 1.08,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      },
    },
  );
} else {
  console.warn("GSAP o ScrollTrigger no está disponible; se omite la animación de desplazamiento.");
}