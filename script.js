document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const navToggle = document.querySelector("#nav-toggle");
  const navMenuMobile = document.querySelector("#nav-menu-mobile");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  const sections = document.querySelectorAll("#about, #projects, #contact");
  const emailLink = document.querySelector(".contact-email");
  const contactForm = document.querySelector("#contact-form");

  const footerYear = document.querySelector("[data-year]");
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // Mobile menu toggle
  if (navToggle && navMenuMobile) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenuMobile.classList.toggle("hidden");
      const isOpenNow = !isOpen;
      navToggle.setAttribute("aria-expanded", String(isOpenNow));
      navToggle.setAttribute("aria-label", isOpenNow ? "Close menu" : "Open menu");
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenuMobile.classList.add("hidden");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  // Smooth scroll with header offset
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const top =
        target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  // Active nav link on scroll
  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const activeId = entry.target.id;
          navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${activeId}`;
            link.classList.toggle("text-white", isActive);
            link.classList.toggle("bg-slate-800", isActive);
            link.classList.toggle("text-slate-300", !isActive);
          });
        });
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Copy email
  if (emailLink) {
    emailLink.addEventListener("click", (event) => {
      const email = "inamdarsami07@gmail.com";

      if (navigator.clipboard && window.isSecureContext) {
        event.preventDefault();
        navigator.clipboard.writeText(email).then(() => {
          showToast("Email copied to clipboard");
        });
      }
    });
  }

  // Contact form — name, email, message
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const fields = {
        name: contactForm.querySelector("#name"),
        email: contactForm.querySelector("#email"),
        message: contactForm.querySelector("#message"),
      };

      let isValid = true;

      Object.entries(fields).forEach(([key, field]) => {
        const error = contactForm.querySelector(`[data-for="${key}"]`);
        const value = field.value.trim();

        clearFieldError(field, error);

        if (!value) {
          setFieldError(field, error, "This field is required");
          isValid = false;
          return;
        }

        if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setFieldError(field, error, "Enter a valid email address");
          isValid = false;
        }
      });

      if (!isValid) return;

      const name = fields.name.value.trim();
      const email = fields.email.value.trim();
      const message = fields.message.value.trim();

      const mailSubject = encodeURIComponent(`Portfolio message from ${name}`);
      const mailBody = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      );

      window.location.href = `mailto:inamdarsami07@gmail.com?subject=${mailSubject}&body=${mailBody}`;
      showToast("Opening your email app to send the message");
      contactForm.reset();
    });
  }
});

function setFieldError(field, errorEl, message) {
  field.classList.add("border-red-500", "ring-2", "ring-red-500/20");
  field.classList.remove("border-slate-700");
  if (errorEl) errorEl.textContent = message;
}

function clearFieldError(field, errorEl) {
  field.classList.remove("border-red-500", "ring-2", "ring-red-500/20");
  field.classList.add("border-slate-700");
  if (errorEl) errorEl.textContent = "";
}

function showToast(message) {
  let toast = document.querySelector(".toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className =
      "toast fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-slate-800 border border-slate-700 text-white text-sm font-semibold rounded-lg shadow-xl opacity-0 translate-y-2 transition-all duration-300 pointer-events-none";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.remove("opacity-0", "translate-y-2");
  toast.classList.add("opacity-100", "translate-y-0");

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    toast.classList.remove("opacity-100", "translate-y-0");
  }, 2600);
}
