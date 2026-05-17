(function () {
  const apiConfig = window.MINDCRAFTECH_API || {};

  function initTheme() {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("mindcraftech_theme");
    const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", savedTheme || (preferredDark ? "dark" : "light"));

    const toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) {
      return;
    }

    toggle.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("mindcraftech_theme", next);
    });
  }

  function initMobileNav() {
    const mobileBtn = document.querySelector("[data-mobile-nav-toggle]");
    const navMenu = document.querySelector(".nav-menu");
    if (!mobileBtn || !navMenu) {
      return;
    }

    mobileBtn.addEventListener("click", function () {
      navMenu.classList.toggle("open");
      mobileBtn.setAttribute("aria-expanded", navMenu.classList.contains("open") ? "true" : "false");
    });
  }

  function initRevealAnimations() {
    const revealNodes = document.querySelectorAll(".reveal");
    if (!revealNodes.length) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealNodes.forEach(function (node) {
        node.classList.add("visible");
      });
      return;
    }

    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealNodes.forEach(function (node) {
      revealObserver.observe(node);
    });
  }

  function initCookieBanner() {
    const cookieBanner = document.querySelector("[data-cookie-banner]");
    const cookieAccept = document.querySelector("[data-cookie-accept]");
    const cookieDecline = document.querySelector("[data-cookie-decline]");

    if (!cookieBanner) {
      return;
    }

    const consent = localStorage.getItem("mindcraftech_cookie_consent");
    if (!consent) {
      cookieBanner.classList.add("active");
    }

    if (cookieAccept) {
      cookieAccept.addEventListener("click", function () {
        localStorage.setItem("mindcraftech_cookie_consent", "accepted");
        cookieBanner.classList.remove("active");
      });
    }

    if (cookieDecline) {
      cookieDecline.addEventListener("click", function () {
        localStorage.setItem("mindcraftech_cookie_consent", "declined");
        cookieBanner.classList.remove("active");
      });
    }
  }

  function setNotice(noticeNode, text, state) {
    if (!noticeNode) {
      return;
    }

    noticeNode.classList.remove("success", "error");
    if (state) {
      noticeNode.classList.add(state);
    }
    noticeNode.textContent = text;
  }

  function initContactForm() {
    const contactForm = document.querySelector("[data-contact-form]");
    if (!contactForm) {
      return;
    }

    const notice = document.querySelector("[data-contact-notice]");
    const endpoint = contactForm.dataset.endpoint || apiConfig.contactEndpoint || "";

    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const enquiry = String(formData.get("enquiry") || "General Enquiry");
      const routing = {
        "AI Consulting": "consulting@mindcraftech.ai",
        "Generative AI": "genai@mindcraftech.ai",
        "Machine Learning": "ml@mindcraftech.ai",
        "Agentic AI": "agents@mindcraftech.ai",
        "Data Analytics": "data@mindcraftech.ai",
        "AI Literacy": "academy@mindcraftech.ai",
        "General Enquiry": "hello@mindcraftech.ai"
      };

      const payload = {
        fullName: String(formData.get("name") || ""),
        companyName: String(formData.get("company") || ""),
        jobTitle: String(formData.get("title") || ""),
        businessEmail: String(formData.get("email") || ""),
        phoneNumber: String(formData.get("phone") || ""),
        enquiryType: enquiry,
        message: String(formData.get("message") || ""),
        routedTo: routing[enquiry] || routing["General Enquiry"],
        source: "mindcraftech.ai-contact"
      };

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";
      }

      setNotice(notice, "", "");

      try {
        if (endpoint) {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            throw new Error("Submission failed");
          }
        }

        setNotice(
          notice,
          endpoint
            ? "Thanks. Your consultation request has been sent successfully."
            : "Form completed. Add a contact endpoint in assets/api-config.js to send submissions.",
          "success"
        );
        contactForm.reset();
      } catch (error) {
        setNotice(notice, "We could not submit right now. Please retry or email hello@mindcraftech.ai.", "error");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Book Consultation";
        }
      }
    });
  }

  function buildAssessmentResult(percent, tier, guidance) {
    return (
      "<h3>Your AI Maturity Score: " +
      percent +
      "%</h3><p><strong>Readiness Tier:</strong> " +
      tier +
      "</p><p>" +
      guidance +
      "</p><p><strong>Next Step:</strong> Book a consultation for a personalised roadmap and benchmark review.</p>"
    );
  }

  function initAssessmentForm() {
    const assessmentForm = document.querySelector("[data-assessment-form]");
    if (!assessmentForm) {
      return;
    }

    const resultNode = document.querySelector("[data-assessment-result]");
    const endpoint = assessmentForm.dataset.endpoint || apiConfig.assessmentEndpoint || "";

    assessmentForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const data = new FormData(assessmentForm);
      const factors = ["data", "tech", "talent", "process", "leadership"];
      const total = factors.reduce(function (acc, key) {
        return acc + Number(data.get(key) || 0);
      }, 0);
      const percent = Math.round((total / 25) * 100);

      let tier = "Emerging";
      let guidance = "Start with a focused AI opportunity assessment and a short pilot roadmap.";
      if (percent >= 80) {
        tier = "Advanced";
        guidance = "Prioritise Agentic AI and scale governance to move from isolated wins to platform impact.";
      } else if (percent >= 60) {
        tier = "Scaling";
        guidance = "Strengthen data integration and operating models to accelerate enterprise adoption.";
      }

      if (!resultNode) {
        return;
      }

      resultNode.innerHTML = buildAssessmentResult(percent, tier, guidance);

      if (endpoint) {
        try {
          await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              score: percent,
              tier: tier,
              dimensions: {
                data: Number(data.get("data") || 0),
                technology: Number(data.get("tech") || 0),
                talent: Number(data.get("talent") || 0),
                process: Number(data.get("process") || 0),
                leadership: Number(data.get("leadership") || 0)
              },
              source: "mindcraftech.ai-assessment"
            })
          });
        } catch (error) {
          resultNode.innerHTML += "<p class=\"notice error\">Result generated locally, but API sync failed.</p>";
        }
      } else {
        resultNode.innerHTML += "<p class=\"notice\">API endpoint not set. Configure assets/api-config.js to sync responses.</p>";
      }

      resultNode.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function initIndustryAccordion() {
    const industryCards = Array.from(document.querySelectorAll("details.industry-card"));
    if (!industryCards.length) {
      return;
    }

    industryCards.forEach(function (card) {
      const summary = card.querySelector("summary");
      if (!summary) {
        return;
      }

      summary.addEventListener("click", function () {
        window.requestAnimationFrame(function () {
          if (!card.open) {
            return;
          }

          industryCards.forEach(function (otherCard) {
            if (otherCard !== card) {
              otherCard.open = false;
            }
          });
        });
      });
    });
  }

  initTheme();
  initMobileNav();
  initRevealAnimations();
  initCookieBanner();
  initContactForm();
  initAssessmentForm();
  initIndustryAccordion();
})();