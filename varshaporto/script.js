/**
 * VARSHA S · PORTFOLIO INTERACTIVITY & ANIMATIONS
 * Dynamic particle canvas, typing text, 3D card tilt, theme switcher,
 * animated stats counters, project filters, toast alerts, and modal logic.
 */

(function () {
  "use strict";

  // Mark document as JS-ready
  document.documentElement.classList.add("js");

  // Dynamic Year in Footer
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ==========================================================================
     1. THEME SWITCHER (EMERALD, VIOLET, ROSE, CYAN, AMBER)
     ========================================================= */
  var themeBtn = document.getElementById("theme-toggle-btn");
  var themeDropdown = document.getElementById("theme-dropdown");
  var themeOptions = document.querySelectorAll(".theme-option");
  var htmlRoot = document.documentElement;

  // Load saved theme or default to emerald
  var savedTheme = localStorage.getItem("vs_theme") || "emerald";
  setTheme(savedTheme);

  function setTheme(themeName) {
    htmlRoot.setAttribute("data-theme", themeName);
    localStorage.setItem("vs_theme", themeName);

    themeOptions.forEach(function (opt) {
      if (opt.getAttribute("data-theme") === themeName) {
        opt.classList.add("active");
      } else {
        opt.classList.remove("active");
      }
    });
  }

  if (themeBtn && themeDropdown) {
    themeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = themeDropdown.classList.toggle("is-open");
      themeBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    themeOptions.forEach(function (opt) {
      opt.addEventListener("click", function () {
        var chosen = this.getAttribute("data-theme");
        if (chosen) setTheme(chosen);
        themeDropdown.classList.remove("is-open");
        themeBtn.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", function (e) {
      if (!themeBtn.contains(e.target) && !themeDropdown.contains(e.target)) {
        themeDropdown.classList.remove("is-open");
        themeBtn.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && themeDropdown.classList.contains("is-open")) {
        themeDropdown.classList.remove("is-open");
        themeBtn.setAttribute("aria-expanded", "false");
        themeBtn.focus();
      }
    });
  }

  /* ==========================================================================
     2. MOBILE NAVIGATION MENU
     ========================================================= */
  var navToggle = document.querySelector(".nav-toggle");
  var navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ==========================================================================
     3. INTERACTIVE CONSTELLATION & PARTICLE CANVAS
     ========================================================= */
  var canvas = document.getElementById("bg-canvas");
  if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ctx = canvas.getContext("2d");
    var particles = [];
    var mouse = { x: null, y: null, radius: 140 };
    var width = (canvas.width = window.innerWidth);
    var height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", function () {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    window.addEventListener("mousemove", function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener("mouseout", function () {
      mouse.x = null;
      mouse.y = null;
    });

    function Particle(x, y, vx, vy, size) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.size = size;
      this.baseAlpha = Math.random() * 0.4 + 0.15;
    }

    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        var dx = mouse.x - this.x;
        var dy = mouse.y - this.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          var force = (mouse.radius - distance) / mouse.radius;
          var dirX = (dx / distance) * force * 1.5;
          var dirY = (dy / distance) * force * 1.5;
          this.x -= dirX;
          this.y -= dirY;
        }
      }
    };

    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, " + this.baseAlpha + ")";
      ctx.fill();
    };

    function initParticles() {
      particles = [];
      var count = Math.min(Math.floor((width * height) / 18000), 75);
      for (var i = 0; i < count; i++) {
        var size = Math.random() * 1.8 + 0.8;
        var x = Math.random() * width;
        var y = Math.random() * height;
        var vx = (Math.random() - 0.5) * 0.45;
        var vy = (Math.random() - 0.5) * 0.45;
        particles.push(new Particle(x, y, vx, vy, size));
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connect particles
      for (var i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var maxDist = 110;

          if (dist < maxDist) {
            var alpha = (1 - dist / maxDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = "rgba(255, 255, 255, " + alpha + ")";
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
  }

  /* ==========================================================================
     4. DYNAMIC HERO ROLE TYPING TEXT ROTATOR
     ========================================================= */
  var roleTextEl = document.getElementById("role-text");
  if (roleTextEl) {
    var roles = [
      "Android & Web Applications",
      "AI & Machine Learning Systems",
      "Full-Stack Products",
      "Healthcare & Diagnostic Tools",
      "Interactive Experiences"
    ];
    var currentRoleIdx = 0;
    var charIdx = 0;
    var isDeleting = false;
    var typingSpeed = 90;
    var pauseEnd = 2200;
    var pauseStart = 500;

    function typeRole() {
      var currentRole = roles[currentRoleIdx];

      if (isDeleting) {
        roleTextEl.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
      } else {
        roleTextEl.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
      }

      var delta = isDeleting ? 45 : typingSpeed;

      if (!isDeleting && charIdx === currentRole.length) {
        delta = pauseEnd;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        currentRoleIdx = (currentRoleIdx + 1) % roles.length;
        delta = pauseStart;
      }

      setTimeout(typeRole, delta);
    }

    setTimeout(typeRole, 600);
  }

  /* ==========================================================================
     5. 3D TILT & MOUSE SPOTLIGHT EFFECT
     ========================================================= */
  var tiltCards = document.querySelectorAll("[data-tilt]");
  if (window.matchMedia("(min-width: 768px)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    tiltCards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = ((y - centerY) / centerY) * -5;
        var rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = "perspective(800px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-4px)";
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)";
      });
    });
  }

  /* ==========================================================================
     6. ANIMATED NUMBER COUNTERS ON SCROLL
     ========================================================= */
  var counterEls = document.querySelectorAll("[data-counter]");
  if (counterEls.length > 0 && "IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterEls.forEach(function (el) {
      counterObserver.observe(el);
    });

    function animateCounter(el) {
      var target = parseFloat(el.getAttribute("data-counter"));
      var suffix = el.getAttribute("data-suffix") || "";
      var decimals = parseInt(el.getAttribute("data-decimals"), 10) || 0;
      var duration = 1600;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease out quad
        var current = progress === 1 ? target : (1 - Math.pow(1 - progress, 3)) * target;

        el.textContent = current.toFixed(decimals) + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    }
  }

  /* ==========================================================================
     7. PROJECT CATEGORY FILTER TABS
     ========================================================= */
  var filterTabs = document.querySelectorAll(".filter-tab");
  var projectCards = document.querySelectorAll(".project-card");

  filterTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var filter = this.getAttribute("data-filter");

      filterTabs.forEach(function (t) {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      this.classList.add("active");
      this.setAttribute("aria-selected", "true");

      projectCards.forEach(function (card) {
        var categories = card.getAttribute("data-category") || "";
        if (filter === "all" || categories.indexOf(filter) !== -1) {
          card.classList.remove("is-hidden");
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          setTimeout(function () {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 30);
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });

  /* ==========================================================================
     8. SCROLL PROGRESS & FLOATING BACK-TO-TOP BUTTON
     ========================================================= */
  var progressBar = document.getElementById("scroll-progress");
  var floatingTopBtn = document.getElementById("floating-top-btn");
  var progressCircle = document.getElementById("progress-circle");
  var circleCircumference = 2 * Math.PI * 18; // radius 18 -> ~113.1

  if (progressCircle) {
    progressCircle.style.strokeDasharray = String(circleCircumference);
    progressCircle.style.strokeDashoffset = String(circleCircumference);
  }

  window.addEventListener("scroll", function () {
    var winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;

    if (progressBar) {
      progressBar.style.width = scrolled + "%";
    }

    if (progressCircle) {
      var offset = circleCircumference - (scrolled / 100) * circleCircumference;
      progressCircle.style.strokeDashoffset = String(offset);
    }

    if (floatingTopBtn) {
      if (winScroll > 380) {
        floatingTopBtn.classList.add("is-visible");
      } else {
        floatingTopBtn.classList.remove("is-visible");
      }
    }
  });

  if (floatingTopBtn) {
    floatingTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ==========================================================================
     9. 1-CLICK CLIPBOARD COPY WITH TOAST NOTIFICATION
     ========================================================= */
  var toast = document.getElementById("toast");
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.innerHTML =
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent);"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
      "<span>" +
      message +
      "</span>";
    toast.classList.add("is-active");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-active");
    }, 2800);
  }

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var text = this.getAttribute("data-copy");
      if (!text) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          showToast("Copied to clipboard: " + text);
        }).catch(function () {
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }
    });
  });

  function fallbackCopy(text) {
    var temp = document.createElement("textarea");
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    try {
      document.execCommand("copy");
      showToast("Copied to clipboard: " + text);
    } catch (err) {
      showToast("Failed to copy");
    }
    document.body.removeChild(temp);
  }

  /* ==========================================================================
     10. CERTIFICATE MODAL
     ========================================================= */
  var modal = document.getElementById("cert-modal");
  if (modal) {
    var titleEl = document.getElementById("cert-modal-title");
    var imgEl = modal.querySelector(".cert-modal__img");
    var errorEl = modal.querySelector(".cert-modal__error");
    var lastFocused = null;

    function openCert(item) {
      var src = item.getAttribute("data-cert");
      if (!src) return;

      lastFocused = document.activeElement;
      titleEl.textContent = item.getAttribute("data-title") || item.textContent.trim();
      imgEl.alt = titleEl.textContent;
      imgEl.hidden = false;
      errorEl.hidden = true;
      imgEl.src = src;

      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("cert-modal-open");
      var closeBtn = modal.querySelector(".cert-modal__close");
      if (closeBtn) closeBtn.focus();
    }

    function closeCert() {
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("cert-modal-open");
      imgEl.removeAttribute("src");
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    }

    document.querySelectorAll(".cert-item[data-cert]").forEach(function (item) {
      item.addEventListener("click", function () {
        openCert(item);
      });
      item.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openCert(item);
        }
      });
    });

    imgEl.addEventListener("error", function () {
      imgEl.hidden = true;
      errorEl.hidden = false;
    });

    modal.querySelectorAll("[data-cert-close]").forEach(function (el) {
      el.addEventListener("click", closeCert);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) {
        closeCert();
      }
    });
  }

  /* ==========================================================================
     11. SCROLL REVEAL (INTERSECTION OBSERVER)
     ========================================================= */
  var revealElements = document.querySelectorAll(
    ".hero-copy, .hero-visual, .section-header, .about-card, .skill-card, .timeline-item, .project-card, .awards-list li, .edu-card, .contact-panel"
  );

  if ("IntersectionObserver" in window) {
    revealElements.forEach(function (el, idx) {
      el.classList.add("reveal");
      // Add subtle stagger delay to grid children
      if (el.classList.contains("skill-card") || el.classList.contains("project-card")) {
        el.style.transitionDelay = (idx % 4) * 0.08 + "s";
      }
    });

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ==========================================================================
     12. ACTIVE NAVBAR LINK ON SCROLL
     ========================================================= */
  var navLinks = document.querySelectorAll(".nav-link");
  var sections = document.querySelectorAll("section[id]");

  if ("IntersectionObserver" in window && navLinks.length > 0) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              if (link.getAttribute("href") === "#" + id) {
                link.classList.add("active");
              } else {
                link.classList.remove("active");
              }
            });
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    sections.forEach(function (sec) {
      sectionObserver.observe(sec);
    });
  }
})();
