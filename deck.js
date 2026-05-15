// Winscore · Партнёрская программа — deck navigation
(function () {
    'use strict';

    const slides = Array.from(document.querySelectorAll('.slide'));
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const dotsContainer = document.getElementById('dots');

    let currentIndex = 0;

    function render() {
        slides.forEach((slide, idx) => {
            slide.classList.toggle('is-active', idx === currentIndex);
        });

        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('is-active', idx === currentIndex);
        });

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === slides.length - 1;
    }

    function goTo(idx) {
        if (idx < 0 || idx >= slides.length) return;
        currentIndex = idx;
        render();
    }

    function buildDots() {
        slides.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.className = 'dot';
            dot.type = 'button';
            dot.setAttribute('aria-label', `Слайд ${idx + 1}`);
            dot.addEventListener('click', () => goTo(idx));
            dotsContainer.appendChild(dot);
        });
    }

    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
            e.preventDefault();
            goTo(currentIndex + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            e.preventDefault();
            goTo(currentIndex - 1);
        } else if (e.key === 'Home') {
            goTo(0);
        } else if (e.key === 'End') {
            goTo(slides.length - 1);
        }
    });

    buildDots();
    render();

    // copy-to-clipboard for tracking links
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-copy]');
        if (!btn) return;
        const value = btn.getAttribute('data-copy');
        const fallbackCopy = (text) => {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'absolute';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
            } catch (_) {}
            document.body.removeChild(ta);
        };
        const flash = () => {
            btn.classList.add('is-copied');
            const icon = btn.querySelector('.material-symbols-rounded');
            const original = icon ? icon.textContent : null;
            if (icon) icon.textContent = 'check';
            setTimeout(() => {
                btn.classList.remove('is-copied');
                if (icon && original !== null) icon.textContent = original;
            }, 1400);
        };
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(value).then(flash, () => {
                fallbackCopy(value);
                flash();
            });
        } else {
            fallbackCopy(value);
            flash();
        }
    });
})();
