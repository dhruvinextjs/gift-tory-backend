// Gifttory Admin Panel — small UI helpers (no framework needed)

document.addEventListener("DOMContentLoaded", () => {
  // Sidebar toggle (mobile)
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const sidebar = document.querySelector(".gt-sidebar");
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => sidebar.classList.toggle("gt-open"));
  }

  // Confirm before destructive actions (delete forms)
  document.querySelectorAll("[data-confirm]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      const msg = form.getAttribute("data-confirm") || "Are you sure?";
      if (!confirm(msg)) e.preventDefault();
    });
  });

  // Live preview for single image inputs
  document.querySelectorAll("[data-preview-input]").forEach((input) => {
    const targetId = input.getAttribute("data-preview-input");
    const target = document.getElementById(targetId);
    if (!target) return;
    input.addEventListener("change", () => {
      target.innerHTML = "";
      Array.from(input.files).forEach((file) => {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        target.appendChild(img);
      });
    });
  });

  // Auto-hide flash alerts after 4s
  document.querySelectorAll("[data-flash]").forEach((el) => {
    setTimeout(() => {
      el.style.transition = "opacity 0.4s ease";
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 400);
    }, 4000);
  });
});
