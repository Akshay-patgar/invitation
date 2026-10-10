/* ============================================
   WEDDING INVITATION - SCRIPT
   Gate-Fold Card with Hearts & Countdown
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const cardScreen = document.getElementById('card-screen');
    const cardInterior = document.getElementById('card-interior');
    const seal = document.getElementById('seal');
    const panelLeft = document.getElementById('panel-left');
    const panelRight = document.getElementById('panel-right');
    const invitation = document.getElementById('invitation');
    const tapInstruction = document.getElementById('tap-instruction');
    const particlesContainer = document.getElementById('particles');

    let isOpened = false;

    // Initialize
    body.classList.add('card-active');
    createParticles();

    // ==========================================
    // Floating Particles (Hearts + Gold Dots)
    // ==========================================
    function createParticles() {
        const count = 28;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            const isHeart = Math.random() > 0.45;
            particle.className = isHeart ? 'particle heart' : 'particle dot';

            if (isHeart) {
                particle.textContent = '\u2665'; // ♥
                const hue = Math.random() > 0.5 ? '340' : '350';
                const lightness = 70 + Math.random() * 15;
                particle.style.color = `hsl(${hue}, 50%, ${lightness}%)`;
                particle.style.fontSize = (10 + Math.random() * 10) + 'px';
            }

            particle.style.left = Math.random() * 100 + '%';
            const duration = 10 + Math.random() * 12;
            particle.style.animationDuration = duration + 's';
            particle.style.animationDelay = (Math.random() * 15) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // ==========================================
    // Create Seal Burst Particles
    // ==========================================
    function createBurstParticles() {
        const rect = seal.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        for (let i = 0; i < 14; i++) {
            const spark = document.createElement('div');
            spark.style.cssText = `
                position: fixed;
                left: ${cx}px;
                top: ${cy}px;
                width: 4px;
                height: 4px;
                background: ${Math.random() > 0.5 ? '#D4AF37' : '#C76B7E'};
                border-radius: 50%;
                pointer-events: none;
                z-index: 200;
            `;
            document.body.appendChild(spark);

            const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.5;
            const dist = 40 + Math.random() * 60;
            const dx = Math.cos(angle) * dist;
            const dy = Math.sin(angle) * dist;

            if (typeof gsap !== 'undefined') {
                gsap.to(spark, {
                    x: dx,
                    y: dy,
                    opacity: 0,
                    scale: 0,
                    duration: 0.6 + Math.random() * 0.3,
                    ease: 'power3.out',
                    onComplete: () => spark.remove()
                });
            } else {
                spark.style.transition = 'all 0.6s ease-out';
                requestAnimationFrame(() => {
                    spark.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
                    spark.style.opacity = '0';
                });
                setTimeout(() => spark.remove(), 1000);
            }
        }
    }

    // ==========================================
    // Gate-Fold Card Opening
    // ==========================================
    function openCard() {
        if (isOpened) return;
        isOpened = true;
        tapInstruction.style.opacity = '0';

        if (typeof gsap !== 'undefined') {
            openWithGSAP();
        } else {
            openWithCSS();
        }
    }

    function openWithGSAP() {
        const tl = gsap.timeline({
            onComplete: revealInvitation
        });

        // Step 0: Cover frame fades away
        tl.to(['.cover-frame', '.corner-orn'], {
            opacity: 0,
            duration: 0.35,
            ease: 'power1.out'
        }, 0);

        // Step 1: Seal shakes then breaks
        tl.to(seal, {
            x: 3,
            duration: 0.06,
            repeat: 5,
            yoyo: true,
            ease: 'power1.inOut'
        });

        tl.to(seal, {
            scale: 1.4,
            rotation: 20,
            opacity: 0,
            duration: 0.45,
            ease: 'power3.out',
            onStart: createBurstParticles
        }, '+=0.05');

        // Step 2: Left panel swings open toward viewer
        tl.to(panelLeft, {
            rotateY: -110,
            duration: 1.3,
            ease: 'power3.out'
        }, '-=0.15');

        // Step 3: Right panel swings open toward viewer (staggered)
        tl.to(panelRight, {
            rotateY: 110,
            duration: 1.3,
            ease: 'power3.out'
        }, '-=1.1');

        // Step 4: Card interior fades in
        tl.to(cardInterior, {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.6');

        // Step 5: Brief pause — user sees the interior
        tl.to({}, { duration: 0.8 });

        // Step 6: Card scene fades out
        tl.to(cardScreen, {
            opacity: 0,
            duration: 0.7,
            ease: 'power2.in'
        });
    }

    function openWithCSS() {
        // CSS fallback
        seal.classList.add('breaking');
        document.querySelectorAll('.cover-frame, .corner-orn')
            .forEach(el => el.style.opacity = '0');

        setTimeout(() => {
            createBurstParticles();
        }, 200);

        setTimeout(() => {
            panelLeft.classList.add('open');
        }, 350);

        setTimeout(() => {
            panelRight.classList.add('open');
        }, 480);

        setTimeout(() => {
            cardInterior.style.opacity = '1';
        }, 900);

        setTimeout(() => {
            cardScreen.style.opacity = '0';
        }, 1800);

        setTimeout(revealInvitation, 2400);
    }

    // ==========================================
    // Reveal Invitation Content
    // ==========================================
    function revealInvitation() {
        cardScreen.classList.add('hidden');
        body.classList.remove('card-active');

        invitation.classList.add('visible');

        setTimeout(() => {
            invitation.classList.add('revealed');

            const elements = invitation.querySelectorAll(
                '.inv-section, .divider-heart'
            );
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('revealed');
                }, index * 120);
            });
        }, 100);

        // Start countdown after reveal
        setTimeout(initCountdown, 500);
    }

    // ==========================================
    // Countdown Timer
    // ==========================================
    function initCountdown() {
        const target = new Date('2026-12-18T11:30:00').getTime();
        const daysEl = document.getElementById('countdown-days');
        const hoursEl = document.getElementById('countdown-hours');
        const minsEl = document.getElementById('countdown-mins');
        const secsEl = document.getElementById('countdown-secs');

        if (!daysEl) return;

        function update() {
            const now = Date.now();
            const diff = target - now;

            if (diff <= 0) {
                daysEl.textContent = '00';
                hoursEl.textContent = '00';
                minsEl.textContent = '00';
                secsEl.textContent = '00';
                return;
            }

            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);

            daysEl.textContent = String(d).padStart(2, '0');
            hoursEl.textContent = String(h).padStart(2, '0');
            minsEl.textContent = String(m).padStart(2, '0');
            secsEl.textContent = String(s).padStart(2, '0');
        }

        update();
        setInterval(update, 1000);
    }

    // ==========================================
    // Event Listeners
    // ==========================================
    seal.addEventListener('click', openCard);
    seal.addEventListener('touchend', (e) => {
        e.preventDefault();
        openCard();
    });

    // Also allow tapping the card scene
    document.querySelector('.card-scene').addEventListener('click', openCard);

    // ==========================================
    // Prevent double-tap zoom (mobile)
    // ==========================================
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
});
