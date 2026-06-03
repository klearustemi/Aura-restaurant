document.addEventListener('DOMContentLoaded', () => {
  const select = (selector, all = false) =>
    all ? Array.from(document.querySelectorAll(selector)) : document.querySelector(selector);

  const on = (event, selector, handler, all = false) => {
    const elements = select(selector, all);
    if (!elements) return;
    if (all) elements.forEach((element) => element.addEventListener(event, handler));
    else elements.addEventListener(event, handler);
  };

  const throttle = (callback, delay = 100) => {
    let timeoutId = null;
    return (...args) => {
      if (timeoutId) return;
      timeoutId = window.setTimeout(() => {
        callback(...args);
        timeoutId = null;
      }, delay);
    };
  };
  
/* ==================================================
     NAVIGATION
     Sticky navbar, active link highlighting,
     smooth scrolling, and mobile menu behavior.
  ================================================== */
  const nav = select('.navigation-wrap');
  const navLinks = select('.navbar-nav .nav-link', true);
  const scrollOffset = 90;
  const revealSections = select('section[id]:not(#home)', true);

  const closeMobileNav = () => {
    const navCollapse = select('.navbar-collapse.collapse');
    if (navCollapse && navCollapse.classList.contains('show')) {
      navCollapse.classList.remove('show');
    }
  };

  const updateNavbarScroll = () => {
    if (window.scrollY > 20) nav.classList.add('scroll-on');
    else nav.classList.remove('scroll-on');
  };

  const updateActiveNavLink = () => {
    const position = window.scrollY + scrollOffset + 40;
    let currentSectionId = 'home';

    revealSections.forEach((section) => {
      if (section.offsetTop <= position) {
        currentSectionId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${currentSectionId}`;
      link.classList.toggle('active', isActive);
    });
  };

  const scrollToTarget = (targetId) => {
    const target = select(targetId);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.pageYOffset - scrollOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const anchorHandler = (event) => {
    const anchor = event.currentTarget;
    const targetHash = anchor.getAttribute('href');
    if (!targetHash || !targetHash.startsWith('#') || targetHash === '#') return;
    const target = select(targetHash);
    if (!target) return;
    event.preventDefault();
    scrollToTarget(targetHash);
    closeMobileNav();
  };

  const initAnchorNavigation = () => {
    on('click', 'a[href^="#"]', anchorHandler, true);
    revealSections.forEach((section) => section.classList.add('section-reveal'));
  };

  const initRevealAnimations = () => {
    const observer = new IntersectionObserver(
      (entries, sectionObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          sectionObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.18 }
    );

    revealSections.forEach((section) => observer.observe(section));
  };

  const initAboutImageReveal = () => {
    const images = select('.about-img', true);
    if (!images.length) return;

    const observer = new IntersectionObserver(
      (entries, imageObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          imageObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.25 }
    );

    images.forEach((image) => observer.observe(image));
  };

  // form validation, user feedback and reservation handling
  const formatPhoneValue = (value) => value.replace(/[^0-9+().\-\s]/g, '');
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const isValidPhone = (value) => /^\+?[0-9\s().-]{7,20}$/.test(value.trim());
  const isValidGuestCount = (value, min = 1, max = 20) => {
    const count = Number(value);
    return Number.isInteger(count) && count >= min && count <= max;
  };

  const isValidReservationTime = (timeValue) => {
    if (!timeValue) return false;
    const [hours, minutes] = timeValue.split(':').map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return false;
    return hours >= 12 && (hours < 23 || (hours === 23 && minutes === 0));
  };

  const createFormMessage = (message, type = 'error') => {
    const element = document.createElement('div');
    element.className = `form-message form-message--${type}`;
    element.setAttribute('role', 'alert');
    element.textContent = message;
    return element;
  };

  const clearFormMessages = (formElement) => {
    formElement.querySelectorAll('.form-message').forEach((message) => message.remove());
    formElement.querySelectorAll('.form-control').forEach((input) => input.classList.remove('input-error'));
  };

  const showFieldError = (input, message) => {
    if (!input) return;
    input.classList.add('input-error');
    const errorMessage = createFormMessage(message, 'error');
    input.parentElement.appendChild(errorMessage);
  };

  const showSuccessMessage = (formElement, message) => {
    const successMessage = createFormMessage(message, 'success');
    formElement.insertBefore(successMessage, formElement.querySelector('button'));
  };

  const setDateMinimum = (dateInput) => {
    if (!dateInput) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateInput.min = today.toISOString().slice(0, 10);
  };

  const initReservationForm = () => {
    const form = select('.reservation-form');
    if (!form) return;

    const nameInput = select('#full-name');
    const emailInput = select('#email');
    const phoneInput = select('#phone');
    const guestsInput = select('#guests');
    const dateInput = select('#date');
    const timeInput = select('#time');
    const submitButton = form.querySelector('button[type="submit"], .btn');
    const defaultButtonText = submitButton?.textContent.trim() ?? 'Confirm Reservation';

    setDateMinimum(dateInput);

    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        phoneInput.value = formatPhoneValue(phoneInput.value);
      });
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!submitButton) return;

      clearFormMessages(form);

      let isValid = true;
      const now = new Date();
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);

      const formValues = {
        name: nameInput?.value.trim() ?? '',
        email: emailInput?.value.trim() ?? '',
        phone: phoneInput?.value.trim() ?? '',
        guests: guestsInput?.value.trim() ?? '',
        date: dateInput?.value ?? '',
        time: timeInput?.value ?? ''
      };

      if (!formValues.name) {
        showFieldError(nameInput, 'Please enter your full name.');
        isValid = false;
      }

      if (!formValues.email || !isValidEmail(formValues.email)) {
        showFieldError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      }

      if (!formValues.phone || !isValidPhone(formValues.phone)) {
        showFieldError(phoneInput, 'Please enter a valid phone number.');
        isValid = false;
      }

      if (!isValidGuestCount(formValues.guests)) {
        showFieldError(guestsInput, 'Enter a guest count between 1 and 20.');
        isValid = false;
      }

      const reservationDate = new Date(formValues.date);
      reservationDate.setHours(0, 0, 0, 0);

      if (!formValues.date || Number.isNaN(reservationDate.valueOf()) || reservationDate < today) {
        showFieldError(dateInput, 'Please select a valid future date.');
        isValid = false;
      }

      if (!isValidReservationTime(formValues.time)) {
        showFieldError(timeInput, 'Select a time between 12:00 and 23:00.');
        isValid = false;
      }

      const reservationDateTime = new Date(formValues.date);
      const [hours, minutes] = formValues.time.split(':').map(Number);
      reservationDateTime.setHours(hours || 0, minutes || 0, 0, 0);

      if (formValues.date && formValues.time && reservationDateTime <= now) {
        showFieldError(timeInput, 'Please choose a future time for your reservation.');
        isValid = false;
      }

      if (!isValid) return;

      submitButton.disabled = true;
      submitButton.classList.add('loading');
      submitButton.textContent = 'Confirming...';

      await new Promise((resolve) => window.setTimeout(resolve, 900));

      showSuccessMessage(form, 'Your reservation request has been received. We will contact you soon.');
      submitButton.textContent = 'Reservation Confirmed';
      submitButton.classList.remove('loading');

      form.reset();
      setDateMinimum(dateInput);

      window.setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = defaultButtonText;
      }, 3000);
    });
  };

  window.addEventListener('scroll', throttle(() => {
    updateNavbarScroll();
    updateActiveNavLink();
  }, 100));

  updateNavbarScroll();
  updateActiveNavLink();
  initAnchorNavigation();
  initRevealAnimations();
  initAboutImageReveal();
  initReservationForm();
});

