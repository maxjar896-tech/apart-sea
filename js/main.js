document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    const isInnerPage = navbar && navbar.classList.contains('nav-inner');

    if (navbar && !isInnerPage) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            navbar.classList.toggle('nav-scrolled', y > 60);
            lastScroll = y;
        }, { passive: true });
    }

    // --- Mobile menu ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = !mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden');
            const icon = document.getElementById('menu-icon');
            if (icon) {
                icon.setAttribute('d', isOpen
                    ? 'M4 6h16M4 12h16M4 18h16'
                    : 'M6 18L18 6M6 6l12 12'
                );
            }
        });
    }

    // --- Sticky booking bar (mobile) ---
    const stickyBar = document.getElementById('sticky-bar');
    if (stickyBar) {
        const heroHeight = window.innerHeight * 0.6;
        window.addEventListener('scroll', () => {
            if (window.scrollY > heroHeight) {
                stickyBar.classList.remove('translate-y-full');
                stickyBar.classList.add('translate-y-0');
            } else {
                stickyBar.classList.add('translate-y-full');
                stickyBar.classList.remove('translate-y-0');
            }
        }, { passive: true });
    }

    // --- Hero parallax (desktop only — disabled on mobile/tablet for performance) ---
    const heroParallax = document.querySelector('.hero-parallax');
    if (heroParallax && window.innerWidth >= 1024) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y < window.innerHeight) {
                heroParallax.style.transform = `translateY(${y * 0.35}px) scale(${1 + y * 0.0003})`;
            }
        }, { passive: true });
    }

    // --- Scroll reveal with IntersectionObserver ---
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (revealEls.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => revealObserver.observe(el));
    }

    // --- Animated counters ---
    const counterEls = document.querySelectorAll('[data-counter]');
    if (counterEls.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterEls.forEach(el => counterObserver.observe(el));
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.counter, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    // --- 3D tilt effect on cards ---
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // --- Accordion (FAQ) ---
    document.querySelectorAll('.accordion-item').forEach(item => {
        const trigger = item.querySelector('.accordion-trigger');
        const content = item.querySelector('.accordion-content');

        if (trigger && content) {
            trigger.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                document.querySelectorAll('.accordion-item.open').forEach(openItem => {
                    openItem.classList.remove('open');
                    openItem.querySelector('.accordion-content').classList.remove('open');
                });

                if (!isOpen) {
                    item.classList.add('open');
                    content.classList.add('open');
                }
            });
        }
    });

    // --- Gallery lightbox ---
    const overlay = document.getElementById('gallery-overlay');
    const overlayImg = overlay ? overlay.querySelector('img') : null;

    if (overlay && overlayImg) {
        document.querySelectorAll('.gallery-grid img, .gallery-thumb').forEach(img => {
            img.addEventListener('click', () => {
                overlayImg.src = img.src;
                overlayImg.alt = img.alt;
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        overlay.addEventListener('click', () => {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // --- Contact form ---
    const form = document.getElementById('booking-form');
    const formSuccess = document.getElementById('form-success');

    if (form && formSuccess) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            form.classList.add('hidden');
            formSuccess.classList.remove('hidden');
        });
    }

    // --- Smooth anchor scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
