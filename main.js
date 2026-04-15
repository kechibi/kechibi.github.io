// Shared script for all pages

// Apply saved dark mode before paint (also handled inline in <head>)
const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
    document.documentElement.classList.add('dark-mode');
}

window.addEventListener('DOMContentLoaded', () => {
    // Stars
    const starsContainer = document.getElementById('stars');
    if (starsContainer) {
        const frag = document.createDocumentFragment();
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            frag.appendChild(star);
        }
        starsContainer.appendChild(frag);
    }

    // ── Light mode floating orbs ──
    const canvas = document.getElementById('lightParticles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let orbs = [];

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        // Wide spread of vivid hues
        const hues = [0, 30, 60, 120, 180, 210, 270, 320];

        function createOrb() {
            const size = Math.random() * 140 + 60;
            return {
                x: Math.random() * canvas.width,
                y: canvas.height + size,
                size,
                speedX: (Math.random() - 0.5) * 0.8,
                speedY: -(Math.random() * 0.6 + 0.25),
                opacity: Math.random() * 0.35 + 0.2,
                hue: hues[Math.floor(Math.random() * hues.length)],
            };
        }

        for (let i = 0; i < 25; i++) {
            const orb = createOrb();
            orb.y = Math.random() * canvas.height;
            orbs.push(orb);
        }

        function drawOrbs() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (document.body.classList.contains('dark-mode')) {
                requestAnimationFrame(drawOrbs);
                return;
            }

            orbs.forEach(orb => {
                const gradient = ctx.createRadialGradient(
                    orb.x, orb.y, 0,
                    orb.x, orb.y, orb.size
                );
                gradient.addColorStop(0, `hsla(${orb.hue}, 90%, 65%, ${orb.opacity})`);
                gradient.addColorStop(0.5, `hsla(${orb.hue}, 80%, 70%, ${orb.opacity * 0.5})`);
                gradient.addColorStop(1, `hsla(${orb.hue}, 80%, 70%, 0)`);

                ctx.beginPath();
                ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                orb.x += orb.speedX;
                orb.y += orb.speedY;

                if (orb.y + orb.size < 0) {
                    Object.assign(orb, createOrb());
                }
            });

            requestAnimationFrame(drawOrbs);
        }

        drawOrbs();
    }

    // ── Shooting stars (dark mode only) ──
    const shootingCanvas = document.createElement('canvas');
    shootingCanvas.id = 'shootingStars';
    shootingCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:6;';
    document.body.appendChild(shootingCanvas);
    const sCtx = shootingCanvas.getContext('2d');
    let shooters = [];

    function resizeShooting() {
        shootingCanvas.width = window.innerWidth;
        shootingCanvas.height = window.innerHeight;
    }
    resizeShooting();
    window.addEventListener('resize', resizeShooting);

    function createShooter() {
        const x = Math.random() * shootingCanvas.width;
        const y = Math.random() * shootingCanvas.height * 0.5;
        const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 12 + 8;
        return {
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            length: Math.random() * 120 + 80,
            opacity: 1,
            trail: [],
        };
    }

    // Spawn a shooting star every 2-4 seconds
    function spawnShooter() {
        if (document.body.classList.contains('dark-mode')) {
            shooters.push(createShooter());
        }
        setTimeout(spawnShooter, Math.random() * 2000 + 1500);
    }
    spawnShooter();

    function drawShooters() {
        sCtx.clearRect(0, 0, shootingCanvas.width, shootingCanvas.height);

        if (document.body.classList.contains('dark-mode')) {
            shooters.forEach((s, i) => {
                s.trail.push({ x: s.x, y: s.y });
                if (s.trail.length > 20) s.trail.shift();

                s.x += s.vx;
                s.y += s.vy;
                s.opacity -= 0.018;

                if (s.trail.length > 1) {
                    const grad = sCtx.createLinearGradient(
                        s.trail[0].x, s.trail[0].y, s.x, s.y
                    );
                    grad.addColorStop(0, `rgba(255,255,255,0)`);
                    grad.addColorStop(1, `rgba(255,255,255,${s.opacity})`);

                    sCtx.beginPath();
                    sCtx.moveTo(s.trail[0].x, s.trail[0].y);
                    s.trail.forEach(p => sCtx.lineTo(p.x, p.y));
                    sCtx.strokeStyle = grad;
                    sCtx.lineWidth = 2;
                    sCtx.lineCap = 'round';
                    sCtx.stroke();

                    // bright head
                    sCtx.beginPath();
                    sCtx.arc(s.x, s.y, 2, 0, Math.PI * 2);
                    sCtx.fillStyle = `rgba(255,255,255,${s.opacity})`;
                    sCtx.fill();
                }

                // remove when faded or off screen
                if (s.opacity <= 0 || s.x > shootingCanvas.width + 50 || s.y > shootingCanvas.height + 50) {
                    shooters.splice(i, 1);
                }
            });
        }

        requestAnimationFrame(drawShooters);
    }
    drawShooters();
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const active = document.documentElement.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', active);
        });
    }

    // Mark active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
});
