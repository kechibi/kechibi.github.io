// ═══════════════════════════════════════════════
//   PSP XMB — Main Script
//   Portfolio — Andre Jose C. Ruiz
// ═══════════════════════════════════════════════

window.addEventListener('DOMContentLoaded', () => {

    // ── Clock ──────────────────────────────────────
    function updateClock() {
        const el = document.getElementById('xmb-clock');
        if (!el) return;
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        el.textContent = `${h}:${m}`;
    }
    updateClock();
    setInterval(updateClock, 1000);

    // ── Date ───────────────────────────────────────
    function updateDate() {
        const el = document.getElementById('xmb-date');
        if (!el) return;
        const now = new Date();
        const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
        const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
        el.textContent = `${days[now.getDay()]} ${months[now.getMonth()]} ${now.getDate()}`;
    }
    updateDate();

    // ── XMB Category Logic ─────────────────────────
    const categories = Array.from(document.querySelectorAll('.xmb-category'));
    let activeIndex = 0;

    function updateCategories(newIndex) {
        activeIndex = ((newIndex % categories.length) + categories.length) % categories.length;

        categories.forEach((cat, i) => {
            cat.classList.remove('active', 'adjacent-left', 'adjacent-right', 'far-left', 'far-right');

            const diff = i - activeIndex;
            const wrapped = ((diff + categories.length) % categories.length);
            // treat as circular distance
            const dist = wrapped <= categories.length / 2 ? diff : diff - categories.length;

            if (dist === 0) {
                cat.classList.add('active');
            } else if (dist === -1 || dist === categories.length - 1) {
                cat.classList.add('adjacent-left');
            } else if (dist === 1 || dist === -(categories.length - 1)) {
                cat.classList.add('adjacent-right');
            } else if (dist < -1) {
                cat.classList.add('far-left');
            } else {
                cat.classList.add('far-right');
            }
        });

        // Update detail panel
        showDetail(activeIndex);
    }

    // ── Keyboard Navigation ────────────────────────
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft')  updateCategories(activeIndex - 1);
        if (e.key === 'ArrowRight') updateCategories(activeIndex + 1);

        // Arrow up/down: move through submenu items
        const submenu = document.querySelector('.xmb-submenu');
        if (!submenu) return;
        const items = Array.from(submenu.querySelectorAll('.submenu-item'));
        const focused = submenu.querySelector('.submenu-item.focused');
        let fi = items.indexOf(focused);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = (fi + 1) % items.length;
            items.forEach(it => it.classList.remove('focused'));
            items[next].classList.add('focused');
            updateDetailContent(activeIndex, next);
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = ((fi - 1) + items.length) % items.length;
            items.forEach(it => it.classList.remove('focused'));
            items[prev].classList.add('focused');
            updateDetailContent(activeIndex, prev);
        }
        if (e.key === 'Enter' || e.key === 'x' || e.key === 'X') {
            // "X" button = confirm/open
            const f = submenu.querySelector('.submenu-item.focused') || items[0];
            if (f && f.href) window.open(f.href, f.target || '_self');
        }
    });

    // ── Touch/Swipe Navigation ─────────────────────
    let touchStartX = 0;
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    document.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
            if (dx < 0) updateCategories(activeIndex + 1);
            else        updateCategories(activeIndex - 1);
        }
    });

    // ── Category click ─────────────────────────────
    categories.forEach((cat, i) => {
        cat.addEventListener('click', () => {
            if (i === activeIndex) return; // already active, do nothing
            updateCategories(i);
        });
    });

    // ── Ripple effect ──────────────────────────────
    function spawnRipple(x, y) {
        const r = document.createElement('div');
        r.className = 'ripple';
        r.style.left = x + 'px';
        r.style.top  = y + 'px';
        document.body.appendChild(r);
        setTimeout(() => r.remove(), 500);
    }

    document.addEventListener('click', (e) => {
        spawnRipple(e.clientX, e.clientY);
    });

    // ── Category definitions ───────────────────────
    // Each category has a set of submenu items and a detail renderer
    const categoryData = [
        // 0: User / Profile
        {
            id: 'user',
            submenu: [
                { label: 'Profile',    sub: 'Andre Jose C. Ruiz',    icon: 'person' },
                { label: 'Resume',     sub: 'View on Google Drive',  icon: 'file',   href: 'https://drive.google.com/file/d/1fcxBe_NlMcFhxIlTtzujs3Um68FO22tv/view?usp=sharing ', target: '_blank' },
                { label: 'Contact',    sub: 'andrejoseruiz2003@gmail.com', icon: 'mail', href: 'https://mail.google.com/mail/?view=cm&to=andrejoseruiz2003@gmail.com', target: '_blank' },
            ],
            detail: [
                { type: 'profile' },
                { type: 'text', content: 'Computer Science graduate from Davao, Philippines. Front-end developer focused on creating interactive and meaningful user experiences.' },
                { type: 'tags', tags: ['HTML', 'CSS', 'JavaScript', 'Vite', 'Tailwind', 'Figma'] },
            ],
        },
        // 1: About
        {
            id: 'about',
            submenu: [
                { label: 'About Me',    sub: 'Bio & background',    icon: 'info' },
            
            ],
            detail: [
                { type: 'title', title: 'About Me' },
                { type: 'text', content: "Hello, I'm Andre Jose C. Ruiz, a Computer Science graduate from the University of Immaculate Concepcion in Davao City, Philippines." },
                { type: 'text', content: 'My passion lies in front-end development — turning creative ideas into interactive and meaningful user experiences. I love building sleek, responsive interfaces and experimenting with modern technologies.' },
                { type: 'text', content: 'Aside from dev work, I have a passion for video editing using Filmora, CapCut, Canva, and DaVinci Resolve.' },
            ],
        },
        // 2: Skills
        {
            id: 'skills',
            submenu: [
                { label: 'Front-End Dev', sub: 'HTML / CSS / JS',       icon: 'code' },
                { label: 'Frameworks',    sub: 'Vite · Tailwind · jQuery', icon: 'layers' },
                { label: 'Design Tools',  sub: 'Figma · Canva',           icon: 'design' },
                { label: 'Video Editing', sub: 'Filmora · CapCut · DaVinci', icon: 'video' },
                { label: 'Version Control', sub: 'Git · GitHub',          icon: 'git' },
            ],
            detail: [
                { type: 'title', title: 'Skills' },
                { type: 'skills' },
            ],
        },
        // 3: Web Projects
        {
            id: 'projects',
            submenu: [
                { label: 'Wine Festival',           sub: 'HTML · CSS',                  icon: 'globe', href: 'WebDev/wineschedule.html',  target: '_blank' },
                { label: "Davie's Burger",          sub: 'HTML · CSS',                  icon: 'globe', href: 'WebDev/DaviesBurger.html',   target: '_blank' },
                { label: 'WireFrame Hi-Fi',         sub: 'HTML · CSS · UI/UX',          icon: 'globe', href: 'WebDev/WireFrame.html',       target: '_blank' },
                { label: 'Fiscally Wise',           sub: 'Figma Prototype',             icon: 'figma', href: 'https://www.figma.com/proto/Z6hlHEo1ih0RQE0zBuI3ma/FiscallyWise---Ruiz?node-id=43-2&t=3gy2bhrtxHh8p8CM-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=43%3A2', target: '_blank' },
                { label: 'Study Track',             sub: 'Figma Prototype',             icon: 'figma', href: 'https://www.figma.com/proto/bPJlhxHFM6duuhZ1EYoNMX/StudyUIUX?node-id=1-2&p=f&t=4hqkWxDW0g03yr2u-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A2&show-proto-sidebar=1', target: '_blank' },
            ],
            detail: [
                { type: 'title', title: 'Web Projects' },
                { type: 'text', content: 'A collection of front-end web development work ranging from event pages and restaurant landing pages to high-fidelity wireframes and Figma app prototypes.' },
                { type: 'tags', tags: ['HTML', 'CSS', 'UI/UX', 'Figma'] },
            ],
        },
        // 4: Video
        {
            id: 'video',
            submenu: [
                { label: 'Intro Video',          sub: 'Short introduction edit',    icon: 'play', href: 'https://drive.google.com/file/d/1x3B9w9IaHD9bfQAEtVFk5vk6YMQOyvvl/view?usp=sharing', target: '_blank' },
                { label: 'Basura Short Film',    sub: 'SDE project · cinematic',    icon: 'play', href: 'https://drive.google.com/file/d/1TloV0kXCJjCZI77IaUAZEEqzIvBgdCGa/view?usp=sharing',  target: '_blank' },
                { label: 'Car Wrapping Ad',      sub: 'Commercial video',           icon: 'play', href: 'https://drive.google.com/file/d/1jU1NLGluJqJEukNOeMRbNzOu5gAKs-Iy/view?usp=sharing',  target: '_blank' },
            ],
            detail: [
                { type: 'title', title: 'Video Editing' },
                { type: 'text', content: 'Short films, intro videos, and commercial content edited with a focus on pacing, cinematic cuts, and visual storytelling.' },
                { type: 'tags', tags: ['Filmora', 'CapCut', 'DaVinci Resolve', 'Canva'] },
            ],
        },
        // 5: Contact
        {
            id: 'contact',
            submenu: [
                { label: 'Send Email',    sub: 'andrejoseruiz2003@gmail.com',  icon: 'mail',     href: 'https://mail.google.com/mail/?view=cm&to=andrejoseruiz2003@gmail.com', target: '_blank' },
                { label: 'GitHub',        sub: 'github.com/kechibiii',         icon: 'github',   href: 'https://github.com/kechibiii',     target: '_blank' },
                { label: 'LinkedIn',      sub: 'Connect on LinkedIn',          icon: 'linkedin', href: 'https://linkedin.com/',             target: '_blank' },
            ],
            detail: [
                { type: 'title', title: 'Contact' },
                { type: 'text', content: "Let's connect and build something awesome together. Reach out via email, check out my GitHub, or connect on LinkedIn." },
                { type: 'tags', tags: ['Available for Work', 'Davao City, PH'] },
            ],
        },
    ];

    // ── Build submenu for a category ──────────────
    const iconSVGs = {
        person:  `<svg viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>`,
        file:    `<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>`,
        mail:    `<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
        info:    `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`,
        code:    `<svg viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>`,
        layers:  `<svg viewBox="0 0 24 24"><path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/></svg>`,
        design:  `<svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>`,
        video:   `<svg viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>`,
        git:     `<svg viewBox="0 0 24 24"><path d="M21.007 11.292L12.708 3c-.39-.39-1.024-.39-1.414 0L9.29 5.006 11.6 7.312a1.502 1.502 0 0 1 1.9 1.915l2.222 2.222a1.503 1.503 0 0 1 1.55 2.48 1.5 1.5 0 0 1-2.14-2.141l-2.073-2.073V15.1a1.503 1.503 0 0 1 .396 2.724A1.5 1.5 0 1 1 11.1 16.45a1.5 1.5 0 0 1 1.007-1.424v-4.43a1.5 1.5 0 0 1-.814-1.97L9.04 6.322 2.993 12.37a1 1 0 0 0 0 1.414l8.3 8.3a1 1 0 0 0 1.414 0l8.3-8.3a1 1 0 0 0 0-1.492z"/></svg>`,
        school:  `<svg viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>`,
        globe:   `<svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>`,
        figma:   `<svg viewBox="0 0 24 24"><path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4z"/><path d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4z"/><path d="M4 4c0-2.208 1.792-4 4-4h4v8H8C5.792 8 4 6.208 4 4z"/><path d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0z"/><path d="M20 12c0 2.208-1.792 4-4 4s-4-1.792-4-4 1.792-4 4-4 4 1.792 4 4z"/></svg>`,
        play:    `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`,
        github:  `<svg viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
        linkedin:`<svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    };

    function buildIcon(name) {
        const div = document.createElement('div');
        div.className = 'submenu-item-icon';
        div.innerHTML = iconSVGs[name] || iconSVGs['file'];
        return div;
    }

    function buildSubmenu(catIndex) {
        const data = categoryData[catIndex];
        const menu = document.createElement('div');
        menu.className = 'xmb-submenu';

        data.submenu.forEach((item, i) => {
            const el = item.href ? document.createElement('a') : document.createElement('div');
            el.className = 'submenu-item' + (i === 0 ? ' focused' : '');
            if (item.href) {
                el.href = item.href;
                el.target = item.target || '_self';
                el.rel = 'noopener noreferrer';
            }

            el.appendChild(buildIcon(item.icon));

            const text = document.createElement('div');
            text.className = 'submenu-item-text';
            text.innerHTML = `
                <div class="submenu-item-title">${item.label}</div>
                <div class="submenu-item-sub">${item.sub}</div>
            `;
            el.appendChild(text);

            const arrow = document.createElement('span');
            arrow.className = 'submenu-arrow';
            arrow.textContent = '▶';
            el.appendChild(arrow);

            el.addEventListener('mouseenter', () => {
                menu.querySelectorAll('.submenu-item').forEach(it => it.classList.remove('focused'));
                el.classList.add('focused');
                updateDetailContent(catIndex, i);
            });

            menu.appendChild(el);
        });

        return menu;
    }

    // ── Detail Panel ───────────────────────────────
    const detailPanel = document.querySelector('.xmb-detail');

    const skillsData = [
        { label: 'HTML / CSS',        pct: 92 },
        { label: 'JavaScript',        pct: 78 },
        { label: 'Tailwind / Vite',   pct: 75 },
        { label: 'Figma / UI-UX',     pct: 70 },
        { label: 'Video Editing',     pct: 82 },
        { label: 'Git',               pct: 68 },
    ];

    const eduData = [
        { deg: 'BS Computer Science', school: 'Univ. of Immaculate Concepcion · Davao', year: '2025–2026' },
        { deg: 'Senior High — STEM',  school: 'Univ. of Immaculate Concepcion · Davao', year: '2021–2022' },
        { deg: 'High School',         school: 'Holy Cross College of Sasa · Davao',     year: '2019–2020' },
    ];

    function renderDetailBlocks(blocks) {
        let html = '';
        blocks.forEach(b => {
            if (b.type === 'title') {
                html += `<div class="detail-title">${b.title}</div><div class="detail-divider"></div>`;
            } else if (b.type === 'text') {
                html += `<p style="margin-bottom:0.8rem;">${b.content}</p>`;
            } else if (b.type === 'tags') {
                html += `<div class="detail-tags">${b.tags.map(t => `<span class="detail-tag">${t}</span>`).join('')}</div>`;
            } else if (b.type === 'profile') {
                html += `
                    <div class="detail-profile">
                        <img class="detail-profile-img" src="images/andre.png" alt="Andre">
                        <div class="detail-profile-info">
                            <div class="name">Andre Jose C. Ruiz</div>
                            <div class="handle">@kechibiii · Davao, PH</div>
                        </div>
                    </div>
                    <div class="detail-divider"></div>
                `;
            } else if (b.type === 'skills') {
                html += `<div class="detail-skills">`;
                skillsData.forEach(s => {
                    html += `
                        <div class="detail-skill-row">
                            <div class="detail-skill-label">${s.label}</div>
                            <div class="detail-skill-bar">
                                <div class="detail-skill-fill" style="--skill-pct:${s.pct}%"></div>
                            </div>
                        </div>
                    `;
                });
                html += `</div>`;
            } else if (b.type === 'edu') {
                html += `<div class="detail-edu-list">`;
                eduData.forEach(e => {
                    html += `
                        <div class="detail-edu-item">
                            <div class="deg">${e.deg}</div>
                            <div class="school">${e.school}</div>
                            <div class="school">${e.year}</div>
                        </div>
                    `;
                });
                html += `</div>`;
            }
        });
        return html;
    }

    // education detail uses 'edu' type — patch About category
    categoryData[1].detail[3] = { type: 'edu' };

    function showDetail(catIndex) {
        if (!detailPanel) return;
        const data = categoryData[catIndex];
        const body = detailPanel.querySelector('.detail-body');
        if (!body) return;

        body.innerHTML = renderDetailBlocks(data.detail);

        // Show action button for user/contact categories
        const actionArea = detailPanel.querySelector('.detail-action');
        if (actionArea) {
            if (catIndex === 0) {
                actionArea.innerHTML = `
                    <a href="https://mail.google.com/mail/?view=cm&to=andrejoseruiz2003@gmail.com" target="_blank" rel="noopener noreferrer" class="detail-btn">
                        <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                        Send Email
                    </a>
                `;
            } else if (catIndex === 5) {
                actionArea.innerHTML = `
                    <a href="https://github.com/kechibiii" target="_blank" rel="noopener noreferrer" class="detail-btn">
                        <svg viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                        GitHub
                    </a>
                `;
            } else {
                actionArea.innerHTML = '';
            }
        }

        // Animate skill bars
        requestAnimationFrame(() => {
            detailPanel.querySelectorAll('.detail-skill-fill').forEach(el => {
                setTimeout(() => el.classList.add('animated'), 50);
            });
        });

        detailPanel.classList.add('visible');
    }

    // ── Detail close button (mobile) ──────────────
    const detailCloseBtn = document.getElementById('detailCloseBtn');
    if (detailCloseBtn) {
        detailCloseBtn.addEventListener('click', () => {
            detailPanel.classList.remove('visible');
        });
    }

    // Tap outside the detail panel to close it on mobile
    document.addEventListener('touchstart', (e) => {
        if (detailPanel && detailPanel.classList.contains('visible')) {
            if (!detailPanel.contains(e.target) && !e.target.closest('.xmb-category')) {
                detailPanel.classList.remove('visible');
            }
        }
    }, { passive: true });

    // Submenu item tap on touch devices — open detail panel
    // (mouseenter doesn't fire on touch, so we wire a click handler inside buildSubmenu)
    // This is handled already via the click on .xmb-category which calls navigateTo → showDetail

    function updateDetailContent(catIndex, subIndex) {
        // Update detail body based on submenu item hover (optional extra info)
        // For now just keep the category detail
    }

    // ── Attach submenus to categories ─────────────
    const categoryRail = document.querySelector('.xmb-categories');

    // Remove existing submenus and rebuild on each activation
    function activateCategory(index) {
        // Remove old submenus
        document.querySelectorAll('.xmb-submenu').forEach(s => s.remove());

        const cat = categories[index];
        if (!cat) return;

        const submenu = buildSubmenu(index);
        cat.appendChild(submenu);
    }

    // ── Init ───────────────────────────────────────
    updateCategories(0);
    activateCategory(0);

    // Override updateCategories to also rebuild submenu
    const origUpdate = updateCategories;

    // Patch category click to also activate submenu
    categories.forEach((cat, i) => {
        // Remove old listener and add new one
        cat.replaceWith(cat.cloneNode(true));
    });

    // Re-query after replace
    const freshCats = Array.from(document.querySelectorAll('.xmb-category'));

    function navigateTo(newIndex) {
        activeIndex = ((newIndex % freshCats.length) + freshCats.length) % freshCats.length;

        freshCats.forEach((cat, i) => {
            cat.classList.remove('active', 'adjacent-left', 'adjacent-right', 'far-left', 'far-right');

            const diff = i - activeIndex;
            const n = freshCats.length;
            // shortest circular distance
            let d = diff;
            if (d > n / 2) d -= n;
            if (d < -n / 2) d += n;

            if (d === 0) cat.classList.add('active');
            else if (d === -1) cat.classList.add('adjacent-left');
            else if (d === 1)  cat.classList.add('adjacent-right');
            else if (d < -1)   cat.classList.add('far-left');
            else               cat.classList.add('far-right');
        });

        // Rebuild submenu
        document.querySelectorAll('.xmb-submenu').forEach(s => s.remove());
        const activeCat = freshCats[activeIndex];
        if (activeCat) {
            const submenu = buildSubmenu(activeIndex);
            activeCat.appendChild(submenu);
        }

        showDetail(activeIndex);
    }

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft')  { navigateToWithVideo(activeIndex - 1); return; }
        if (e.key === 'ArrowRight') { navigateToWithVideo(activeIndex + 1); return; }

        const submenu = document.querySelector('.xmb-submenu');
        if (!submenu) return;
        const items = Array.from(submenu.querySelectorAll('.submenu-item'));
        const focused = submenu.querySelector('.submenu-item.focused');
        let fi = items.indexOf(focused);
        if (fi === -1) fi = 0;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            items.forEach(it => it.classList.remove('focused'));
            items[(fi + 1) % items.length].classList.add('focused');
            // trigger preview if on video or projects category
            const nextLabel = items[(fi + 1) % items.length].querySelector('.submenu-item-title')?.textContent?.trim();
            if (activeIndex === 4) scheduleVideoPreview(nextLabel);
            if (activeIndex === 3) scheduleImagePreview(nextLabel);
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            items.forEach(it => it.classList.remove('focused'));
            items[((fi - 1) + items.length) % items.length].classList.add('focused');
            // trigger preview if on video or projects category
            const prevLabel = items[((fi - 1) + items.length) % items.length].querySelector('.submenu-item-title')?.textContent?.trim();
            if (activeIndex === 4) scheduleVideoPreview(prevLabel);
            if (activeIndex === 3) scheduleImagePreview(prevLabel);
        }
        if (e.key === 'Enter') {
            const f = submenu.querySelector('.submenu-item.focused') || items[0];
            if (f && f.href) window.open(f.href, f.target || '_self');
        }
    });

    // Touch
    let tx = 0;
    document.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
    document.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - tx;
        if (Math.abs(dx) > 40) {
            navigateToWithVideo(dx < 0 ? activeIndex + 1 : activeIndex - 1);
        }
    });

    freshCats.forEach((cat, i) => {
        cat.addEventListener('click', () => navigateToWithVideo(i));
    });

    // Ripple on all clicks
    document.addEventListener('click', (e) => {
        const r = document.createElement('div');
        r.className = 'ripple';
        r.style.left = e.clientX + 'px';
        r.style.top  = e.clientY + 'px';
        document.body.appendChild(r);
        setTimeout(() => r.remove(), 500);
    });

    // ── Video Background Manager ───────────────────
    // Maps each video submenu item label → local file path
    const videoPreviews = {
        'Intro Video':       'vids/Intro%20Video.mp4',
        'Basura Short Film': 'vids/Basura%20Short%20Film.mp4',
        'Car Wrapping Ad':   'vids/Car%20Wrapping%20Ad.mp4',
    };

    const vidBg  = document.getElementById('xmbVidBg');
    const vidEl  = document.getElementById('xmbVidEl');
    let   vidTimer = null;   // delay before playback starts (like PSP's ~1s hover delay)
    let   currentSrc = '';

    function playVideoBg(src) {
        if (!vidBg || !vidEl) return;
        if (src === currentSrc) return; // already playing this one

        currentSrc = src;

        // Fade out first, swap src, then fade back in
        vidBg.classList.remove('visible');

        setTimeout(() => {
            vidEl.src = src;
            vidEl.currentTime = 0;
            vidEl.volume = isMuted ? 0 : (parseFloat(localStorage.getItem('vidVolume') ?? '0.7'));
            vidEl.play().catch(() => {}); // autoplay may be blocked; silently ignore
            vidBg.classList.add('visible');
            showVolControl();
        }, 300); // wait for fade-out to finish before swapping
    }

    function stopVideoBg() {
        if (!vidBg || !vidEl) return;
        clearTimeout(vidTimer);
        vidTimer = null;
        vidBg.classList.remove('visible');
        hideVolControl();
        // Give the fade-out time to finish, then actually stop
        setTimeout(() => {
            vidEl.pause();
            vidEl.src = '';
            currentSrc = '';
        }, 650);
    }

    // ── Volume Control ─────────────────────────────
    const volWidget   = document.getElementById('xmbVol');
    const volSlider   = document.getElementById('volSlider');
    const volFill     = document.getElementById('volFill');
    const volValue    = document.getElementById('volValue');
    const volIconBtn  = document.getElementById('volIconBtn');
    const volIconOn   = volIconBtn?.querySelector('.vol-icon-on');
    const volIconOff  = volIconBtn?.querySelector('.vol-icon-off');

    // Restore saved volume (default 70%)
    const savedVol = parseFloat(localStorage.getItem('vidVolume') ?? '0.7');
    let isMuted = localStorage.getItem('vidMuted') === 'true';
    let lastVolBeforeMute = savedVol;

    function applyVolume(vol) {
        if (!vidEl) return;
        vidEl.volume = isMuted ? 0 : vol;
    }

    function updateVolUI(vol) {
        if (!volSlider || !volFill || !volValue) return;
        const pct = Math.round(vol * 100);
        volSlider.value = pct;
        volFill.style.width = pct + '%';
        volValue.textContent = pct;
        // update ARIA
        volSlider.setAttribute('aria-valuenow', pct);
        // icon swap
        const showMuted = isMuted || vol === 0;
        if (volIconOn)  volIconOn.style.display  = showMuted ? 'none'  : 'block';
        if (volIconOff) volIconOff.style.display = showMuted ? 'block' : 'none';
    }

    // Init
    if (vidEl) vidEl.volume = isMuted ? 0 : savedVol;
    updateVolUI(savedVol);

    // Slider input
    volSlider?.addEventListener('input', () => {
        const vol = parseInt(volSlider.value) / 100;
        isMuted = false;
        lastVolBeforeMute = vol;
        localStorage.setItem('vidVolume', vol);
        localStorage.setItem('vidMuted', 'false');
        applyVolume(vol);
        updateVolUI(vol);
    });

    // Mute toggle button
    volIconBtn?.addEventListener('click', () => {
        isMuted = !isMuted;
        localStorage.setItem('vidMuted', isMuted);
        if (!isMuted && lastVolBeforeMute === 0) {
            lastVolBeforeMute = 0.7;
        }
        applyVolume(isMuted ? 0 : lastVolBeforeMute);
        updateVolUI(isMuted ? 0 : lastVolBeforeMute);
    });

    // Show/hide the widget when video is visible
    function showVolControl() {
        volWidget?.classList.add('visible');
    }

    function hideVolControl() {
        volWidget?.classList.remove('visible');
    }

    // ── Image Background Manager (projects category) ──
    const imagePreviews = {
        'Wine Festival':  'images/winefestival.png',
        "Davie's Burger": "images/Davie%27sBurger.png",
        'WireFrame Hi-Fi':'images/WireframeHi-Fi.png',
        // Fiscally Wise & Study Track have no local screenshot — no entry = no bg swap
    };

    const imgBg  = document.getElementById('xmbImgBg');
    const imgArt = document.getElementById('xmbImgArt');
    let   imgTimer   = null;
    let   currentImg = '';

    function showImageBg(src) {
        if (!imgBg || !imgArt) return;
        if (src === currentImg) return;

        currentImg = src;

        // Fade out, swap, fade in
        imgBg.classList.remove('visible');
        setTimeout(() => {
            imgArt.style.backgroundImage = `url("${src}")`;
            imgBg.classList.add('visible');
        }, src ? 280 : 0);
    }

    function hideImageBg() {
        if (!imgBg) return;
        clearTimeout(imgTimer);
        imgTimer = null;
        imgBg.classList.remove('visible');
        setTimeout(() => {
            if (!imgBg.classList.contains('visible')) {
                imgArt.style.backgroundImage = '';
                currentImg = '';
            }
        }, 550);
    }

    function scheduleImagePreview(label) {
        clearTimeout(imgTimer);
        const src = imagePreviews[label];
        // No local image for this item — fade out any existing bg
        if (!src) {
            imgTimer = setTimeout(() => showImageBg(''), 400);
            return;
        }
        // Short delay so rapid scrolling doesn't flash every frame
        imgTimer = setTimeout(() => showImageBg(src), 350);
    }

    function scheduleVideoPreview(label) {
        clearTimeout(vidTimer);
        const src = videoPreviews[label];
        if (!src) return;
        // ~800ms hover delay, just like PSP's game preview behaviour
        vidTimer = setTimeout(() => playVideoBg(src), 800);
    }

    // Hook into submenu mouseenter — we patch buildSubmenu's mouseenter listener.
    // We do this by overriding the per-item mouseenter inside buildSubmenu.
    // Since buildSubmenu is already defined above, we wrap the item mouseenter
    // inside navigateTo's submenu rebuild instead.

    // Override navigateTo to also wire video previews on the video category submenu
    const _origNavigateTo = navigateTo;

    function navigateToWithVideo(newIndex) {
        _origNavigateTo(newIndex);

        const VIDEO_CAT_INDEX   = 4;
        const PROJECT_CAT_INDEX = 3;

        if (newIndex !== VIDEO_CAT_INDEX) {
            // Left the video category — stop preview
            stopVideoBg();
        }

        if (newIndex !== PROJECT_CAT_INDEX) {
            // Left the projects category — hide image bg
            hideImageBg();
        }

        if (newIndex !== VIDEO_CAT_INDEX && newIndex !== PROJECT_CAT_INDEX) {
            return;
        }

        // We're on the video or projects category — attach hover logic to submenu items
        // Small rAF to ensure the submenu has been appended by navigateTo
        requestAnimationFrame(() => {
            const submenu = document.querySelector('.xmb-submenu');
            if (!submenu) return;

            const items = submenu.querySelectorAll('.submenu-item');
            items.forEach(item => {
                const label = item.querySelector('.submenu-item-title')?.textContent?.trim();

                item.addEventListener('mouseenter', () => {
                    if (activeIndex === VIDEO_CAT_INDEX)   scheduleVideoPreview(label);
                    if (activeIndex === PROJECT_CAT_INDEX) scheduleImagePreview(label);
                });

                item.addEventListener('mouseleave', () => {
                    // Cancel pending timer only; keep showing if already started
                    clearTimeout(vidTimer);
                    clearTimeout(imgTimer);
                    vidTimer = null;
                    imgTimer = null;
                });
            });

            // Auto-preview the first (focused) item after a short delay
            const firstLabel = submenu.querySelector('.submenu-item.focused .submenu-item-title')?.textContent?.trim();
            if (activeIndex === VIDEO_CAT_INDEX)   scheduleVideoPreview(firstLabel);
            if (activeIndex === PROJECT_CAT_INDEX) scheduleImagePreview(firstLabel);
        });
    }

    // Patch keydown handler to use video-aware navigation
    // We re-bind arrow keys using the wrapped version
    // (handled by the main keydown listener below)

    // Also patch the ↑↓ submenu navigation to trigger video previews on the video category
    // (handled inline inside the main keydown listener below)

    // ── Initial state — respect URL hash ──────────
    const hashMap = { '#about': 1, '#skills': 2, '#projects': 3, '#video': 4, '#contact': 5 };
    const startIndex = hashMap[window.location.hash] ?? 0;
    navigateToWithVideo(startIndex);
});
