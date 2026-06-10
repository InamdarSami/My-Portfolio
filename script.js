document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("#about, #skills, #contact");
  const emailLink = document.querySelector(".contact-email");

  // Auto-update footer year
  const footerYear = document.querySelector("[data-year]");
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // Smooth scroll with sticky header offset
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

  // Highlight active nav link while scrolling
  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const activeId = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === `#${activeId}`
            );
          });
        });
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Fade-in cards and sections on scroll
  const revealElements = document.querySelectorAll(
    ".hero-content, .hero-photo, .about-content, .skill-card, .contact-item, .section-title"
  );

  revealElements.forEach((element, index) => {
    element.classList.add("reveal");
    if (element.classList.contains("skill-card")) {
      element.style.transitionDelay = `${(index % 7) * 0.06}s`;
    }
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  // Copy email on click
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
});

function showToast(message) {
  let toast = document.querySelector(".toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("is-visible");

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}
