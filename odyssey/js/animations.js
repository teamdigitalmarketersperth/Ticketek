/**
 * ODYSSEY — Clean & Simple Motion Engine
 * Subtle Native Scroll Reveals · Background Drift · Canvas Audio Harmonics
 */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------------------------------------------
     01. NATIVE SCROLL REVEALS & HERO DRIFT
     -------------------------------------------------------------------------- */
  function initScrollReveals() {
    if (prefersReducedMotion) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in-view"));
      return;
    }

    // Performant Native IntersectionObserver
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.08
      }
    );

    document.querySelectorAll(".reveal").forEach((el) => {
      revealObserver.observe(el);
    });

    // Subtle passive scroll drift for hero background
    const heroBg = document.querySelector(".hero-bg-layer");
    if (heroBg) {
      let ticking = false;
      window.addEventListener("scroll", () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight * 1.2) {
              heroBg.style.transform = `translateY(${scrolled * 0.15}px)`;
            }
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }
  }

  /* --------------------------------------------------------------------------
     02. CLEAN AUDIO VISUALIZER (CANVAS)
     -------------------------------------------------------------------------- */
  function initAudioVisualizer() {
    const canvas = document.getElementById("audioVisualizer");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let isSimulating = true;
    let wavePhase = 0;
    let sensitivity = 1.0;

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = canvas.clientWidth || (canvas.parentElement ? canvas.parentElement.clientWidth - 40 : 300);
      const displayHeight = 90;
      canvas.width = Math.floor(displayWidth * dpr);
      canvas.height = Math.floor(displayHeight * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    function drawVisualizer() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);

      const numBars = width < 360 ? 24 : (width < 540 ? 32 : 44);
      const barWidth = Math.max(2, (width / numBars) - 2);

      // Frequency spectrum bars
      for (let i = 0; i < numBars; i++) {
        const freq1 = Math.sin(wavePhase + i * 0.2) * 0.5 + 0.5;
        const freq2 = Math.cos(wavePhase * 0.7 + i * 0.35) * 0.5 + 0.5;
        const freq3 = Math.sin(wavePhase * 1.4 + i * 0.12) * 0.5 + 0.5;

        const centerFactor = Math.sin((i / numBars) * Math.PI);
        const barHeight = Math.max(4, (freq1 * 0.4 + freq2 * 0.35 + freq3 * 0.25) * height * 0.85 * centerFactor * sensitivity);

        const x = i * (barWidth + 2);
        const y = height - barHeight;

        const isPeak = barHeight > height * 0.55;
        const gradient = ctx.createLinearGradient(0, y, 0, height);
        if (isPeak) {
          gradient.addColorStop(0, "rgba(210, 28, 34, 0.95)");
          gradient.addColorStop(0.6, "rgba(181, 18, 24, 0.7)");
          gradient.addColorStop(1, "rgba(92, 8, 12, 0.2)");
        } else {
          gradient.addColorStop(0, "rgba(242, 232, 216, 0.75)");
          gradient.addColorStop(0.7, "rgba(216, 203, 184, 0.35)");
          gradient.addColorStop(1, "rgba(0, 0, 0, 0.1)");
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      // Continuous harmonic curve
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(242, 232, 216, 0.45)";

      for (let x = 0; x <= width; x += 4) {
        const y = height / 2 + Math.sin(x * 0.02 + wavePhase) * Math.cos(x * 0.008 + wavePhase * 0.5) * 20 * sensitivity;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (isSimulating) {
        wavePhase += 0.04;
      }

      animationId = requestAnimationFrame(drawVisualizer);
    }

    if (!prefersReducedMotion) {
      drawVisualizer();
    }

    // Toggle Button
    const toggleBtn = document.getElementById("toggleVisualizerBtn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        isSimulating = !isSimulating;
        toggleBtn.textContent = isSimulating ? "PAUSE HARMONICS" : "RESUME HARMONICS";
        const statusText = document.querySelector(".visualizer-status span:last-child");
        if (statusText) {
          statusText.textContent = isSimulating ? "ACOUSTIC RESONANCE LIVE" : "VISUALIZER STANDBY";
        }
      });
    }

    // Subtle hover responsiveness
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = (e.clientX - rect.left) / rect.width;
      sensitivity = 0.85 + relativeX * 0.6;
    }, { passive: true });

    canvas.addEventListener("mouseleave", () => {
      sensitivity = 1.0;
    }, { passive: true });
  }

  // Export modules
  window.OdysseyAnimations = {
    initScrollReveals,
    initAudioVisualizer
  };

  // Run on DOM Ready
  function init() {
    document.body.classList.add("site-ready");
    initScrollReveals();
    initAudioVisualizer();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
