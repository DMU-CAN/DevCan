import { siteCollections } from './site-data.js';

const CMS_COLLECTIONS = ['members', 'activities', 'projects', 'notices', 'gallery'];
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let toastTimer;
let sectionObserver;

function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function sortByOrder(items = []) {
  return [...items].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

function sortNotices(items = []) {
  return [...items].sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
    if ((a.order ?? 999) !== (b.order ?? 999)) return (a.order ?? 999) - (b.order ?? 999);
    return String(b.date ?? '').localeCompare(String(a.date ?? ''));
  });
}

function showToast(msg) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}
window.showToast = showToast;

async function getFirebaseCms() {
  try {
    const [{ firebaseConfig }, appMod, firestoreMod] = await Promise.all([
      import('./firebase-config.js'),
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js')
    ]);
    const app = appMod.initializeApp(firebaseConfig);
    const db = firestoreMod.getFirestore(app);
    return { db, ...firestoreMod };
  } catch (err) {
    console.info('Firebase CMS unavailable; rendering fallback data.', err);
    return null;
  }
}

async function fetchCollection(cms, name) {
  if (!cms) return siteCollections[name] ?? [];
  try {
    const snap = await cms.getDocs(cms.collection(cms.db, name));
    const data = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    return data.length ? data : siteCollections[name] ?? [];
  } catch (err) {
    console.warn(`Failed to fetch ${name}; using fallback data.`, err);
    return siteCollections[name] ?? [];
  }
}

async function loadCmsData() {
  const cms = await getFirebaseCms();
  const entries = await Promise.all(CMS_COLLECTIONS.map(async name => [name, await fetchCollection(cms, name)]));
  return Object.fromEntries(entries);
}

function renderMembers(items) {
  const root = $('#membersGrid');
  if (!root) return;
  root.innerHTML = sortByOrder(items).map(member => `
    <div class="member-card ${member.role === 'president' ? 'executive' : ''}">
      <div class="member-avatar">
        <div class="avatar-photo">
          <img src="${esc(member.photoUrl)}" alt="${esc(member.name)}" />
        </div>
      </div>
      <div class="member-info">
        <h3>${esc(member.name)}</h3>
        <span class="member-role ${member.role === 'president' || member.role === 'vp' ? esc(member.role) : ''}">${esc(member.roleLabel)}</span>
        <p>${esc(member.grade)}</p>
        <div class="member-skills">${(member.skills ?? []).map(skill => `<span>${esc(skill)}</span>`).join('')}</div>
      </div>
    </div>
  `).join('');
}

function renderActivities(items) {
  const root = $('#activitiesGrid');
  if (!root) return;
  root.innerHTML = sortByOrder(items).map(activity => `
    <div class="activity-card" data-aos>
      <div class="activity-icon"><i data-lucide="${esc(activity.icon)}"></i></div>
      <h3>${esc(activity.title)}</h3>
      <p>${esc(activity.desc)}</p>
      <ul class="activity-tags">${(activity.tags ?? []).map(tag => `<li>${esc(tag)}</li>`).join('')}</ul>
    </div>
  `).join('');
}

function renderProjects(items) {
  const root = $('#projectsGrid');
  if (!root) return;
  root.innerHTML = sortByOrder(items).map(project => `
    <div class="project-card" data-category="${esc(project.category)}" data-aos>
      <div class="project-card-header">
        <div class="project-year">${esc(project.year)}</div>
        <div class="project-badge">${esc(project.badge)}</div>
      </div>
      <div class="project-meta">
        <div class="project-icon"><i data-lucide="${esc(project.icon)}"></i></div>
        <div class="project-info">
          <h3 class="project-title">${esc(project.title)}</h3>
          <p class="project-subtitle">${esc(project.subtitle)}</p>
          <p class="project-team"><i data-lucide="users-2"></i> ${esc(project.team)}</p>
        </div>
      </div>
      <p class="project-desc">${esc(project.desc)}</p>
      <ul class="project-tags">${(project.tags ?? []).map(tag => `<li>${esc(tag)}</li>`).join('')}</ul>
    </div>
  `).join('');
}

function noticeBadgeClass(notice) {
  if (notice.badgeType === 'pin') return 'notice-badge pin';
  if (notice.badgeType === 'event') return 'notice-badge event';
  return 'notice-badge';
}

function renderNotices(items) {
  const root = $('#noticeList');
  if (!root) return;
  root.innerHTML = sortNotices(items).map(notice => `
    <div class="notice-item ${notice.pinned ? 'pinned' : ''}">
      <div class="${noticeBadgeClass(notice)}"><i data-lucide="${esc(notice.icon || 'megaphone')}"></i> ${esc(notice.badge)}</div>
      <div class="notice-content">
        <h4>${esc(notice.title)}</h4>
        <p>${esc(notice.summary)}</p>
        <span class="notice-date">${esc(notice.date)}</span>
      </div>
      <span class="notice-arrow">→</span>
      <div class="notice-detail" hidden>${notice.detailHtml || ''}</div>
    </div>
  `).join('');
}

function renderGallery(items) {
  const root = $('#galleryGrid');
  if (!root) return;
  root.innerHTML = sortByOrder(items).map(item => `
    <div class="gallery-item ${item.size && item.size !== 'normal' ? esc(item.size) : ''}" data-category="${esc(item.category)}">
      <div class="gallery-img" style="background: url('${esc(item.imageUrl)}') center/cover no-repeat;">
        <div class="gallery-overlay">
          <h4>${esc(item.title)}</h4>
          <p>${esc(categoryLabel(item.category))} · ${esc(item.date)}</p>
        </div>
      </div>
    </div>
  `).join('');
}

function categoryLabel(category) {
  return ({ news: 'CAN소식', study: '스터디', event: '행사', project: '프로젝트' })[category] ?? category;
}

function renderCms(data) {
  renderMembers(data.members);
  renderActivities(data.activities);
  renderProjects(data.projects);
  renderNotices(data.notices);
  renderGallery(data.gallery);
  if (window.lucide) lucide.createIcons();
  initDynamicBindings();
}

function initNavbar() {
  const navbar = $('#navbar');
  const hamburger = $('#hamburger');
  const navLinks = $('#navLinks');
  if (!navbar || !hamburger || !navLinks) return;
  const navItems = $$('a', navLinks);

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveNavLink();
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navItems.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

function updateActiveNavLink() {
  const navLinks = $('#navLinks');
  if (!navLinks) return;
  const scrollY = window.scrollY + 100;
  $$('section[id]').forEach(sec => {
    const id = sec.getAttribute('id');
    const link = $(`a[href="#${id}"]`, navLinks);
    if (!link) return;
    link.classList.toggle('active', scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight);
  });
}

function initHeroCanvas() {
  const canvas = $('#bgCanvas');
  const heroSection = $('#home');
  if (!canvas || !heroSection) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  const randomBetween = (a, b) => a + Math.random() * (b - a);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = randomBetween(0, canvas.width);
      this.y = randomBetween(0, canvas.height);
      this.vx = randomBetween(-0.3, 0.3);
      this.vy = randomBetween(-0.3, 0.3);
      this.r = randomBetween(1, 2.5);
      this.alpha = randomBetween(0.2, 0.7);
      const colors = ['108,99,255', '0,212,255', '255,101,132'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.fill();
    }
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  function initParticles() {
    const count = Math.min(80, Math.floor(canvas.width / 16));
    particles = Array.from({ length: count }, () => new Particle());
  }
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${(1 - dist / 140) * 0.15})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animId = requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  initParticles();
  animateParticles();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animId) animateParticles();
      if (!entry.isIntersecting) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    });
  }, { threshold: 0.1 }).observe(heroSection);
}

function initTyping() {
  const typedEl = $('#typedText');
  if (!typedEl) return;
  const phrases = ['CAN', 'Code.', 'Algo.', 'Hack.', 'Build.', 'Win.'];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const current = phrases[phraseIdx];
    typedEl.textContent = isDeleting ? current.substring(0, charIdx - 1) : current.substring(0, charIdx + 1);
    charIdx += isDeleting ? -1 : 1;
    let delay = isDeleting ? 80 : 120;
    if (!isDeleting && charIdx === current.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 300;
    }
    setTimeout(type, delay);
  }
  type();
}

function initCounter() {
  const statNums = $$('.stat-num');
  let countersStarted = false;
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - progress, 3)) * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        statNums.forEach(animateCounter);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statsObserver.observe(el));
}

function initGalleryFilter() {
  const buttons = $$('.filter-btn');
  buttons.forEach(btn => {
    btn.onclick = () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      $$('.gallery-item').forEach(item => {
        item.style.display = filter === 'all' || item.dataset.category === filter ? '' : 'none';
        if (item.style.display !== 'none') item.style.animation = 'fadeInUp 0.4s ease forwards';
      });
    };
  });
}

function initProjectFilter() {
  const buttons = $$('.proj-filter-btn');
  buttons.forEach(btn => {
    btn.onclick = () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      $$('.project-card').forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
        if (show) card.style.animation = 'fadeInUp 0.4s ease forwards';
      });
    };
  });
}

function initCardAnimations() {
  const observeCards = selector => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    $$(selector).forEach(card => observer.observe(card));
  };
  observeCards('.activity-card[data-aos]');
  observeCards('.project-card[data-aos]');
}

function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = $(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 68, behavior: 'smooth' });
      }
    });
  });
}

function initAboutTilt() {
  const aboutCard = $('.about-card');
  if (!aboutCard) return;
  const wrap = aboutCard.closest('.about-card-wrap');
  if (!wrap) return;
  wrap.addEventListener('mousemove', e => {
    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    aboutCard.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  });
  wrap.addEventListener('mouseleave', () => { aboutCard.style.transform = ''; });
}

function initImageProtection() {
  $$('img').forEach(img => {
    img.oncontextmenu = e => e.preventDefault();
    img.ondragstart = e => e.preventDefault();
    img.ontouchstart = e => { if (e.cancelable) e.preventDefault(); };
  });
}

function initNoticeModal() {
  const noticeOverlay = $('#noticeOverlay');
  const closeBtn = $('#modalClose');
  if (!noticeOverlay || !closeBtn) return;
  const modalBadgeEl = $('#modalBadge');
  const modalDateEl = $('#modalDate');
  const modalTitleEl = $('#modalTitle');
  const modalBodyEl = $('#modalBody');

  function openNoticeModal(item) {
    const badge = $('.notice-badge', item);
    modalBadgeEl.innerHTML = badge.innerHTML;
    modalBadgeEl.className = badge.className.replace('notice-badge', 'modal-badge notice-badge');
    modalDateEl.textContent = $('.notice-date', item).textContent;
    modalTitleEl.textContent = $('h4', item).textContent;
    modalBodyEl.innerHTML = $('.notice-detail', item)?.innerHTML || `<p>${$('p', item).textContent}</p>`;
    noticeOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (window.lucide) lucide.createIcons({ nodes: [modalBadgeEl, closeBtn] });
  }

  function closeNoticeModal() {
    noticeOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  $$('.notice-item').forEach(item => { item.onclick = () => openNoticeModal(item); });
  closeBtn.onclick = closeNoticeModal;
  noticeOverlay.onclick = e => { if (e.target === noticeOverlay) closeNoticeModal(); };
  document.onkeydown = e => { if (e.key === 'Escape') closeNoticeModal(); };
}

function initScrollAnimations() {
  if (sectionObserver) sectionObserver.disconnect();
  const isMobile = window.innerWidth <= 768;
  sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.08 });
  $$('.section').forEach(sec => {
    sec.style.opacity = '0';
    sec.style.transform = isMobile ? 'none' : 'translateY(24px)';
    sec.style.transition = isMobile ? 'opacity 0.6s ease' : 'opacity 0.7s ease, transform 0.7s ease';
    sectionObserver.observe(sec);
  });
}

function initDynamicBindings() {
  initGalleryFilter();
  initProjectFilter();
  initCardAnimations();
  initImageProtection();
  initNoticeModal();
  initScrollAnimations();
}

async function boot() {
  initNavbar();
  initHeroCanvas();
  initTyping();
  initCounter();
  initSmoothScroll();
  initAboutTilt();
  renderCms(siteCollections);
  const data = await loadCmsData();
  renderCms(data);
}

boot();
