/* main.js  —  Holidae Holiday Booking Website
   Shared JavaScript for all pages. */

/* NAVIGATION — Sticky header + mobile hamburger menu*/

const header     = document.querySelector('.site-header');
const navToggle  = document.querySelector('.nav__toggle');
const navMobile  = document.querySelector('.nav__mobile');

/**
 * Add/remove the "scrolled" class on the header so CSS can
 * apply the solid background once the user scrolls down.
 */
function handleHeaderScroll() {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleHeaderScroll, { passive: true });
handleHeaderScroll(); // Run once on load

/**
 * Toggle the full-screen mobile navigation overlay.
 * Prevents body scroll while the menu is open.
 */
if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile nav when a link inside it is clicked
  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMobile.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/**
 * Highlight the active nav link based on the current page filename.
 */
(function markActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();


/* SCROLL REVEAL  —  Intersection Observer
   Elements with class "reveal" or "reveal-group" animate in
   when they enter the viewport.*/

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after reveal so it doesn't re-fire
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

// Observe all elements tagged for reveal
document.querySelectorAll('.reveal, .reveal-group').forEach(el => {
  revealObserver.observe(el);
});



/*PACKAGE FILTER  (packages.html only)
   Filters the package card grid by category tag.*/

const filterBtns = document.querySelectorAll('.filter-btn');
const packageCards = document.querySelectorAll('.package-card[data-category]');
const noResults = document.querySelector('.no-results');

if (filterBtns.length && packageCards.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selected = btn.dataset.filter;
      let visibleCount = 0;

      packageCards.forEach(card => {
        const category = card.dataset.category || '';
        const shouldShow = selected === 'all' || category.includes(selected);
        card.style.display = shouldShow ? '' : 'none';
        if (shouldShow) visibleCount++;
      });

      // Show "no results" message when nothing matches
      if (noResults) {
        noResults.classList.toggle('visible', visibleCount === 0);
      }
    });
  });
}


/*ITINERARY ACCORDION  (maldives.html only)
   Toggles the open/close state of each itinerary day.*/

document.querySelectorAll('.itinerary-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const body = toggle.nextElementSibling;
    const isActive = toggle.classList.contains('active');

    // Close all panels first (accordion behaviour)
    document.querySelectorAll('.itinerary-toggle').forEach(t => {
      t.classList.remove('active');
      t.nextElementSibling.classList.remove('open');
    });

    // If it wasn't already open, open it now
    if (!isActive) {
      toggle.classList.add('active');
      if (body) body.classList.add('open');
    }
  });
});

// Open the first itinerary item by default on page load
const firstItinerary = document.querySelector('.itinerary-toggle');
if (firstItinerary) {
  firstItinerary.click();
}


/*GALLERY LIGHTBOX  (maldives.html only)
   Opens a full-screen image lightbox when a gallery
   thumbnail is clicked.*/

const lightbox      = document.querySelector('.lightbox');
const lightboxImg   = document.querySelector('.lightbox img');
const lightboxClose = document.querySelector('.lightbox__close');

if (lightbox && lightboxImg) {
  // Open lightbox when any gallery item is clicked
  document.querySelectorAll('.gallery__item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close on button click
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  // Close on overlay click (outside the image)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }
}


/* BOOKING FORM  (maldives.html only)
   Basic validation and simulated submission with spinner. */

const bookingForm = document.querySelector('.booking-form');

if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Gather all required inputs
    const requiredFields = bookingForm.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--coral)';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (!valid) return;

    // Show loading state on the submit button
    const submitBtn = bookingForm.querySelector('[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
    submitBtn.disabled = true;

    // Simulate an API call with a 5s timeout
    setTimeout(() => {
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;

      const successMsg = bookingForm.querySelector('.success-msg');
      if (successMsg) successMsg.classList.add('visible');
      bookingForm.reset();
    }, 1500);
  });

  // Remove error highlight on input focus
  bookingForm.querySelectorAll('input, select').forEach(field => {
    field.addEventListener('focus', () => {
      field.style.borderColor = '';
    });
  });
}


/* HERO SEARCH BAR  (index.html only)
   Redirects to packages page with a filter pre-applied. */

const searchBarForm = document.querySelector('.search-bar');

if (searchBarForm) {
  const searchBtn = searchBarForm.querySelector('.btn');

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const dest = searchBarForm.querySelector('#dest-select')?.value || '';
      const url  = dest ? `packages.html?dest=${encodeURIComponent(dest)}` : 'packages.html';
      window.location.href = url;
    });
  }
}


/* GUEST COUNTER  (booking form)
   Simple +/- counter for number of guests. */

document.querySelectorAll('.guest-counter').forEach(counter => {
  const input   = counter.querySelector('input[type="number"]');
  const btnMinus = counter.querySelector('[data-action="minus"]');
  const btnPlus  = counter.querySelector('[data-action="plus"]');

  if (!input) return;

  const min = parseInt(input.min, 10) || 1;
  const max = parseInt(input.max, 10) || 20;

  btnMinus?.addEventListener('click', () => {
    const val = parseInt(input.value, 10) || min;
    if (val > min) input.value = val - 1;
  });

  btnPlus?.addEventListener('click', () => {
    const val = parseInt(input.value, 10) || min;
    if (val < max) input.value = val + 1;
  });
});