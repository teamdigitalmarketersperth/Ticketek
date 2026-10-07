/**
 * ODYSSEY — Core Application Logic
 * Dynamic Ticketek URL Binding · Live Countdown · Navigation · Accordions
 */

(function () {
  "use strict";

  /* --------------------------------------------------------------------------
     01. ASSET AND URL INJECTION (Requirements 40, 41)
     -------------------------------------------------------------------------- */
  function injectConfiguration() {
    if (typeof ODYSSEY_CONFIG === "undefined") {
      console.error("ODYSSEY_CONFIG is not defined.");
      return;
    }

    // Bind ticket URLs to all designated CTA buttons
    const ticketButtons = document.querySelectorAll("[data-ticket-btn], .btn-ticket-link");
    ticketButtons.forEach((btn) => {
      btn.setAttribute("href", ODYSSEY_CONFIG.ticketUrl);
      btn.setAttribute("target", "_blank");
      btn.setAttribute("rel", "noopener noreferrer");
    });

    // Populate images from ODYSSEY_ASSETS if defined
    if (typeof ODYSSEY_ASSETS !== "undefined") {
      const assetMap = {
        "heroBg": ODYSSEY_ASSETS.hero,
        "storyParallaxImg": ODYSSEY_ASSETS.story,
        "musicImg": ODYSSEY_ASSETS.music,
        "theatreImg": ODYSSEY_ASSETS.theatre,
        "audienceImg": ODYSSEY_ASSETS.audience,
        "finalCtaImg": ODYSSEY_ASSETS.final
      };

      Object.keys(assetMap).forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          if (el.tagName === "IMG") {
            el.src = assetMap[id];
          } else {
            el.style.backgroundImage = `url("${assetMap[id]}")`;
          }
        }
      });
    }
  }

  /* --------------------------------------------------------------------------
     02. STICKY HEADER & ACTIVE NAVIGATION
     -------------------------------------------------------------------------- */
  function initHeaderNavigation() {
    const header = document.querySelector(".odyssey-header");
    const mobileToggle = document.querySelector(".mobile-toggle");
    const mobileOverlay = document.querySelector(".mobile-nav-overlay");
    const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

    // Scroll state change for header blur & border
    function handleScroll() {
      if (window.scrollY > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Mobile Hamburger Toggle
    if (mobileToggle && mobileOverlay) {
      mobileToggle.addEventListener("click", () => {
        const isOpen = mobileToggle.classList.toggle("is-open");
        mobileOverlay.classList.toggle("is-open", isOpen);
        document.body.style.overflow = isOpen ? "hidden" : "";
        mobileToggle.setAttribute("aria-expanded", isOpen.toString());
      });

      // Close mobile menu when link is clicked
      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          mobileToggle.classList.remove("is-open");
          mobileOverlay.classList.remove("is-open");
          document.body.style.overflow = "";
          mobileToggle.setAttribute("aria-expanded", "false");
        });
      });

      // Close mobile menu on Escape key
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mobileOverlay.classList.contains("is-open")) {
          mobileToggle.classList.remove("is-open");
          mobileOverlay.classList.remove("is-open");
          document.body.style.overflow = "";
          mobileToggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    // Active Section Tracking
    const sections = document.querySelectorAll("section[id]");
    function highlightNav() {
      const scrollPos = window.scrollY + 180;
      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top + window.scrollY;
        const height = section.offsetHeight;
        const id = section.getAttribute("id");
        if (scrollPos >= top && scrollPos < top + height) {
          document.querySelectorAll(`.nav-link[href="#${id}"]`).forEach((a) => a.classList.add("active"));
        } else {
          document.querySelectorAll(`.nav-link[href="#${id}"]`).forEach((a) => a.classList.remove("active"));
        }
      });
    }
    window.addEventListener("scroll", highlightNav, { passive: true });
  }

  /* --------------------------------------------------------------------------
     03. ACCURATE REAL-TIME COUNTDOWN (Requirement 32)
     Target: 10 April 2027, 7:30 PM AWST (UTC+8)
     -------------------------------------------------------------------------- */
  function initCountdown() {
    const daysEl = document.getElementById("countdownDays");
    const hoursEl = document.getElementById("countdownHours");
    const minutesEl = document.getElementById("countdownMinutes");
    const secondsEl = document.getElementById("countdownSeconds");

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    // Target timestamp: 2027-04-10T19:30:00+08:00
    const targetDate = new Date(ODYSSEY_CONFIG.eventDate).getTime();

    function updateCountdown() {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minutesEl.textContent = String(minutes).padStart(2, "0");
      secondsEl.textContent = String(seconds).padStart(2, "0");
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* --------------------------------------------------------------------------
     04. ACCORDION (BEFORE YOU ARRIVE) (Requirement 34)
     -------------------------------------------------------------------------- */
  function initAccordion() {
    const triggers = document.querySelectorAll(".accordion-trigger");
    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const item = trigger.closest(".accordion-item");
        const isOpen = item.classList.contains("is-open");

        // Close siblings
        document.querySelectorAll(".accordion-item").forEach((el) => {
          el.classList.remove("is-open");
          el.querySelector(".accordion-trigger")?.setAttribute("aria-expanded", "false");
        });

        // Toggle clicked item
        if (!isOpen) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  // Initialize all features on DOM Ready
  document.addEventListener("DOMContentLoaded", () => {
    injectConfiguration();
    initHeaderNavigation();
    initCountdown();
    initAccordion();
  });
})();
