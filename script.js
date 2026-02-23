const header = document.querySelector('.site-header');
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const revealItems = document.querySelectorAll('.reveal');
const leadModal = document.getElementById('leadModal');
const floorModal = document.getElementById('floorModal');
const legalModal = document.getElementById('legalModal');
const leadReason = document.getElementById('leadReason');
const floorInterest = document.getElementById('floorInterest');
const toast = document.getElementById('toast');
const floorPreviewImage = document.getElementById('floorPreviewImage');
const floorPreviewTitle = document.getElementById('floorPreviewTitle');
const floorPreviewText = document.getElementById('floorPreviewText');
const floorModalImage = document.getElementById('floorModalImage');
const floorModalTitle = document.getElementById('floorModalTitle');
const floorModalText = document.getElementById('floorModalText');
const heroBackground = document.querySelector('.hero-bg');
const floorUnlockArea = document.getElementById('floorUnlockArea');
const backToTopLink = document.getElementById('backToTop');
const legalTabs = [...document.querySelectorAll('.legal-tab')];
const legalPanels = [...document.querySelectorAll('[data-legal-content]')];
const legalLinks = [...document.querySelectorAll('a[href="#privacy-policy"], a[href="#terms-conditions"]')];

const floorData = {
  master: {
    title: 'Master Plan',
    text: 'Expansive township blueprint with residences, open greens, retail and commercial blocks.',
    image: 'sobha brdidgekeys images/floorplan-min-1.webp'
  },
  '1bhk': {
    title: '1 BHK Plan',
    text: '703 sq ft smart layout with efficient zoning and premium finish specifications.',
    image: 'sobha brdidgekeys images/floorplan-min-1.webp'
  },
  '2bhk': {
    title: '2 BHK Plan',
    text: '1015 to 1213 sq ft options featuring expansive living, dining and utility design.',
    image: 'sobha brdidgekeys images/floorplan-min-1.webp'
  },
  '3bhk': {
    title: '3 BHK Plan',
    text: '1511 to 1811 sq ft family-focused configuration with private bedroom zones.',
    image: 'sobha brdidgekeys images/floorplan-min-1.webp'
  },
  '4bhk': {
    title: '4 BHK Plan',
    text: '2102 to 2407 sq ft signature residences designed for expansive luxury living.',
    image: 'sobha brdidgekeys images/floorplan-min-1.webp'
  }
};

let leadModalPromptShown = false;
let toastTimer;

function toggleHeaderState() {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 20);
}

function setMenuState(open) {
  if (!menuToggle || !siteNav) return;
  siteNav.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  const anyModalOpen = document.querySelector('.modal.is-open');
  if (!anyModalOpen) {
    document.body.classList.remove('modal-open');
  }
}

function openLeadModal(reason = 'General Enquiry') {
  leadModalPromptShown = true;
  if (leadReason) {
    leadReason.value = reason;
  }
  openModal(leadModal);
}

function isLegalRoute(hashValue = window.location.hash) {
  return hashValue === '#privacy-policy' || hashValue === '#terms-conditions';
}

function normalizeLegalTarget(target = 'privacy-policy') {
  return target === 'terms-conditions' ? 'terms-conditions' : 'privacy-policy';
}

function setLegalContent(target) {
  const current = normalizeLegalTarget(target);

  legalTabs.forEach((tab) => {
    const isActive = tab.getAttribute('data-legal-target') === current;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  legalPanels.forEach((panel) => {
    const isActive = panel.getAttribute('data-legal-content') === current;
    panel.classList.toggle('is-active', isActive);
    panel.hidden = !isActive;
  });

  return current;
}

function updateLegalUrlHash(nextHash = '') {
  const nextUrl = nextHash
    ? `${window.location.pathname}${window.location.search}#${nextHash}`
    : `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(null, '', nextUrl);
}

function openLegalModal(target = 'privacy-policy', updateHash = true) {
  const current = setLegalContent(target);
  openModal(legalModal);
  if (updateHash) {
    updateLegalUrlHash(current);
  }
}

function closeLegalModal(updateHash = true) {
  closeModal(legalModal);
  if (updateHash && isLegalRoute()) {
    updateLegalUrlHash('');
  }
}

function syncLegalModalFromHash() {
  if (!isLegalRoute()) {
    if (legalModal && legalModal.classList.contains('is-open')) {
      closeLegalModal(false);
    }
    return;
  }

  const target = window.location.hash.replace('#', '');
  openLegalModal(target, false);
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2600);
}

function scrollToSection(id) {
  const target = document.querySelector(id);
  if (!target) return;
  const headerOffset = header ? header.offsetHeight : 0;
  const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset + 1;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

function activateNavLink(sectionId) {
  navLinks.forEach((link) => {
    const isCurrent = link.getAttribute('href') === `#${sectionId}`;
    link.classList.toggle('is-active', isCurrent);
  });
}

function updateFloorPlan(planKey) {
  const entry = floorData[planKey];
  if (!entry) return;

  floorPreviewImage.src = entry.image;
  floorPreviewImage.alt = `${entry.title} preview`;
  floorPreviewTitle.textContent = entry.title;
  floorPreviewText.textContent = entry.text;

  floorModalImage.src = entry.image;
  floorModalImage.alt = `${entry.title} enlarged preview`;
  floorModalTitle.textContent = entry.title;
  floorModalText.textContent = entry.text;

  if (floorInterest) {
    floorInterest.value = entry.title;
  }
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const next = !siteNav.classList.contains('is-open');
    setMenuState(next);
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const id = link.getAttribute('href');
    if (!id || !id.startsWith('#')) return;
    event.preventDefault();
    scrollToSection(id);
    setMenuState(false);
  });
});

window.addEventListener('scroll', () => {
  toggleHeaderState();

  if (heroBackground) {
    if (window.innerWidth > 991) {
      const translateY = Math.min(window.scrollY * 0.2, 90);
      heroBackground.style.transform = `translateY(${translateY}px)`;
    } else {
      heroBackground.style.transform = 'translateY(0)';
    }
  }
});

window.addEventListener('resize', () => {
  if (heroBackground && window.innerWidth <= 991) {
    heroBackground.style.transform = 'translateY(0)';
  }
});

toggleHeaderState();

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target.id) {
        activateNavLink(entry.target.id);
      }
    });
  },
  { threshold: 0.45 }
);

document.querySelectorAll('section[id]').forEach((section) => sectionObserver.observe(section));

document.querySelectorAll('[data-open-popup]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const reason = trigger.getAttribute('data-open-popup') || 'General Enquiry';
    openLeadModal(reason);
  });
});

document.querySelectorAll('[data-close-modal]').forEach((closeButton) => {
  closeButton.addEventListener('click', () => {
    const modalId = closeButton.getAttribute('data-close-modal');
    if (modalId === 'legalModal') {
      closeLegalModal(true);
      return;
    }

    const modal = document.getElementById(modalId);
    closeModal(modal);
  });
});

[leadModal, floorModal, legalModal].forEach((modal) => {
  if (!modal) return;
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      if (modal === legalModal) {
        closeLegalModal(true);
        return;
      }
      closeModal(modal);
    }
  });
});

window.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  closeModal(leadModal);
  closeModal(floorModal);
  closeLegalModal(true);
});

legalTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-legal-target');
    if (!target) return;
    openLegalModal(target, true);
  });
});

legalLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetHash = link.getAttribute('href');
    if (!targetHash || !targetHash.startsWith('#')) return;
    const target = targetHash.slice(1);
    if (target !== 'privacy-policy' && target !== 'terms-conditions') return;
    event.preventDefault();
    openLegalModal(target, true);
  });
});

const floorTabs = [...document.querySelectorAll('.floor-tab')];
floorTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const next = tab.getAttribute('data-plan');
    if (!next) return;

    floorTabs.forEach((el) => {
      const active = el === tab;
      el.classList.toggle('is-active', active);
      el.setAttribute('aria-selected', String(active));
    });

    updateFloorPlan(next);
  });
});

const openFloorModalButton = document.getElementById('openFloorModal');
if (openFloorModalButton) {
  openFloorModalButton.addEventListener('click', () => {
    openModal(floorModal);
  });
}

if (floorUnlockArea) {
  floorUnlockArea.addEventListener('click', () => {
    openModal(floorModal);
  });

  floorUnlockArea.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openModal(floorModal);
  });
}

if (backToTopLink) {
  backToTopLink.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const leadForms = document.querySelectorAll('.lead-form');
// ---------- EmailJS integration for lead forms ----------
// EmailJS credentials (inserted from user)
const EMAILJS_PUBLIC_KEY = 'Nuwqa4o33MbqOfqJ_';
const EMAILJS_SERVICE_ID = 'service_aojz74f';
const EMAILJS_TEMPLATE_TO_OWNER = 'template_sz3v7mc';
const EMAILJS_TEMPLATE_TO_USER = 'template_foh0nxr';
const OWNER_EMAIL = 'abhinav787@gmail.com';

// Initialize EmailJS if available. Some SDK builds expose `emailjs` on `window` or as a global.
try {
  if (typeof emailjs !== 'undefined' && typeof emailjs.init === 'function') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
} catch (e) {
  console.warn('EmailJS init failed:', e);
}

leadForms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formName = form.getAttribute('data-form-name') || 'Form';
    showToast('Submitting...');

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // template parameters for owner notification
    // Include explicit recipient fields often used by EmailJS templates (e.g. `to_email`).
    const ownerParams = {
      form_name: formName,
      name: data.name || '',
      email: data.email || '',
      mobile: data.mobile || '',
      interest: data.interest || data.leadReason || '',
      consent: data.consent ? 'Yes' : 'No',
      submitted_at: new Date().toLocaleString(),
      owner_email: OWNER_EMAIL,
      to_email: OWNER_EMAIL,
      // include raw payload for debugging if template expects other keys
      payload: JSON.stringify(data)
    };

    // template parameters for user autoresponse
    const userParams = {
      user_name: data.name || '',
      user_email: data.email || '',
      email: data.email || '',
      to_email: data.email || '',
      message: 'Thank you for reaching out to us. We will contact you soon.',
      payload: JSON.stringify(data)
    };

    // Send mail to owner first, then send auto-reply to user
    const sendOwner = () => {
      if (typeof emailjs === 'undefined' || typeof emailjs.send !== 'function') {
        return Promise.reject(new Error('EmailJS SDK not available'));
      }
      return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_TO_OWNER, ownerParams);
    };

    const sendUser = () => {
      // if user didn't provide email, skip auto-reply
      if (!data.email) return Promise.resolve({ skipped: true });
      return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_TO_USER, userParams);
    };

    // Send owner notification, then user auto-reply. Log responses for debugging delivery issues.
    sendOwner()
      .then((ownerResp) => {
        console.log('EmailJS owner send response:', ownerResp);
        return sendUser().then((userResp) => ({ ownerResp, userResp }));
      })
      .then(({ ownerResp, userResp }) => {
        try { form.reset(); } catch (e) {}
        closeModal(leadModal);
        closeModal(floorModal);
        console.log('EmailJS user send response:', userResp);
        showToast('Submitted — redirecting...');
        // slight delay to ensure logs are flushed in some browsers
        setTimeout(() => { window.location.href = 'thank-you.html'; }, 350);
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        const errMsg = (err && (err.text || err.message)) ? (err.text || err.message) : 'Submission failed. Please try again.';
        showToast(errMsg);
      });
  });
});

// Timed popup trigger for lead capture.
window.setTimeout(() => {
  if (leadModalPromptShown) return;
  openLeadModal('Limited Period Offer');
}, 30000);

// Desktop exit intent popup trigger for lead capture.
document.addEventListener('mouseleave', (event) => {
  if (leadModalPromptShown || window.innerWidth < 992) return;
  if (event.clientY > 2) return;

  openLeadModal('Exit Intent Offer');
});

window.addEventListener('hashchange', syncLegalModalFromHash);
syncLegalModalFromHash();
