/**
 * Lightweight Lightbox for Academic Profile Site
 * Opens .responsive-media images in a full-screen overlay with caption.
 * No external dependencies. No rounded corners.
 */
(function () {
  'use strict';

  // Create overlay elements once
  var overlay = document.createElement('div');
  overlay.id = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image viewer');
  overlay.innerHTML =
    '<button id="lightbox-close" aria-label="Close image viewer">&times;</button>' +
    '<div id="lightbox-inner">' +
      '<img id="lightbox-img" src="" alt="" />' +
      '<p id="lightbox-caption"></p>' +
    '</div>';

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(overlay);

    var img      = document.getElementById('lightbox-img');
    var caption  = document.getElementById('lightbox-caption');
    var closeBtn = document.getElementById('lightbox-close');

    // Open lightbox for any .responsive-media image
    document.querySelectorAll('img.responsive-media').forEach(function (el) {
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', function () {
        img.src       = el.src;
        img.alt       = el.alt;
        // Caption: prefer parent <figcaption>, fall back to alt text
        var fig     = el.closest('figure');
        var figcap  = fig ? fig.querySelector('figcaption') : null;
        caption.textContent = (figcap ? figcap.textContent : el.alt) || '';
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
      });
    });

    // Close on overlay background click
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeLightbox();
    });

    // Close button
    closeBtn.addEventListener('click', closeLightbox);

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && overlay.classList.contains('active')) {
        closeLightbox();
      }
    });

    function closeLightbox() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      img.src = '';
    }
  });
})();
