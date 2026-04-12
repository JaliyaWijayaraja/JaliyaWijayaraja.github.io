/**
 * site-enhancements.js
 * Handles: Reading progress bar, Back-to-top button,
 *          Citation copy-to-clipboard, Lightbox arrow navigation.
 */
(function () {
  'use strict';

  /* ============================================================
     1. READING PROGRESS BAR
     A thin accent bar at the very top of the viewport that
     fills as the user scrolls down the page.
  ============================================================ */
  function initProgressBar() {
    var bar = document.createElement('div');
    bar.id = 'reading-progress';
    document.body.prepend(bar);

    function update() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = Math.min(pct, 100) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ============================================================
     2. BACK-TO-TOP BUTTON
     Appears after scrolling 400px; smooth-scrolls to top.
  ============================================================ */
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '&#8679;'; // ↑
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     3. CITATION COPY-TO-CLIPBOARD
     Each .pub-entry with a data-citation attribute gets a
     "Copy Citation" button injected next to it.
  ============================================================ */
  function initCitationCopy() {
    document.querySelectorAll('.pub-entry[data-citation]').forEach(function (entry) {
      var btn = document.createElement('button');
      btn.className = 'copy-citation-btn';
      btn.textContent = '📋 Copy Citation';
      btn.setAttribute('aria-label', 'Copy citation to clipboard');

      btn.addEventListener('click', function () {
        var text = entry.getAttribute('data-citation');
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = '✅ Copied!';
          setTimeout(function () { btn.textContent = '📋 Copy Citation'; }, 2000);
        }).catch(function () {
          // Fallback for Safari/old browsers
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          btn.textContent = '✅ Copied!';
          setTimeout(function () { btn.textContent = '📋 Copy Citation'; }, 2000);
        });
      });

      entry.appendChild(btn);
    });
  }

  /* ============================================================
     4. LIGHTBOX — ARROW KEY NAVIGATION
     Extends the base lightbox.js with Left/Right arrow support
     so users can browse all images in the current figure group.
  ============================================================ */
  function initLightboxArrows() {
    // Wait for lightbox overlay to be available (created by lightbox.js)
    var checkInterval = setInterval(function () {
      var overlay = document.getElementById('lightbox-overlay');
      if (!overlay) return;
      clearInterval(checkInterval);

      var allImages = Array.from(document.querySelectorAll('img.responsive-media'));
      var currentIndex = -1;

      // Track which image opened the lightbox
      allImages.forEach(function (img, idx) {
        img.addEventListener('click', function () {
          currentIndex = idx;
        });
      });

      function showImage(idx) {
        if (idx < 0 || idx >= allImages.length) return;
        var el       = allImages[idx];
        var lbImg    = document.getElementById('lightbox-img');
        var lbCap    = document.getElementById('lightbox-caption');
        var fig      = el.closest('figure');
        var figcap   = fig ? fig.querySelector('figcaption') : null;

        lbImg.src          = el.src;
        lbImg.alt          = el.alt;
        lbCap.textContent  = (figcap ? figcap.textContent : el.alt) || '';
        currentIndex       = idx;
      }

      document.addEventListener('keydown', function (e) {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          showImage(currentIndex + 1);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          showImage(currentIndex - 1);
        }
      });

      // Inject prev/next buttons into the overlay
      var prevBtn = document.createElement('button');
      prevBtn.id = 'lightbox-prev';
      prevBtn.setAttribute('aria-label', 'Previous image');
      prevBtn.innerHTML = '&#8249;'; // ‹

      var nextBtn = document.createElement('button');
      nextBtn.id = 'lightbox-next';
      nextBtn.setAttribute('aria-label', 'Next image');
      nextBtn.innerHTML = '&#8250;'; // ›

      prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        showImage(currentIndex - 1);
      });
      nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        showImage(currentIndex + 1);
      });

      overlay.appendChild(prevBtn);
      overlay.appendChild(nextBtn);
    }, 100);
  }

  /* ============================================================
     INIT ALL ON DOM READY
  ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    initProgressBar();
    initBackToTop();
    initCitationCopy();
    initLightboxArrows();
  });

})();
