import { seedCollections } from './site-data.js';

const tabs = [
  { key: 'members', label: '임원진', icon: 'users', columns: ['order', 'name', 'roleLabel', 'grade'], fields: [
    ['name', '이름'], ['photoUrl', '사진 URL'], ['role', '역할', 'select', ['president', 'vp', 'general']], ['roleLabel', '역할명'], ['grade', '학년/학과'], ['skills', '기술', 'array'], ['order', '순서', 'number']
  ] },
  { key: 'activities', label: '활동', icon: 'zap', columns: ['order', 'icon', 'title', 'desc'], fields: [
    ['icon', '아이콘'], ['title', '제목'], ['desc', '설명', 'textarea'], ['tags', '태그', 'array'], ['order', '순서', 'number']
  ] },
  { key: 'projects', label: '프로젝트', icon: 'folder-kanban', columns: ['order', 'year', 'category', 'title', 'team'], fields: [
    ['year', '연도'], ['category', '카테고리', 'select', ['app', 'game', 'hw', 'env']], ['badge', '배지'], ['icon', '아이콘'], ['title', '제목'], ['subtitle', '부제'], ['team', '팀'], ['desc', '설명', 'textarea'], ['tags', '태그', 'array'], ['order', '순서', 'number']
  ] },
  { key: 'notices', label: '공지사항', icon: 'megaphone', columns: ['order', 'pinned', 'badge', 'title', 'date'], fields: [
    ['badge', '배지'], ['badgeType', '배지 타입', 'select', ['default', 'pin', 'event']], ['icon', '아이콘'], ['title', '제목'], ['summary', '요약', 'textarea'], ['date', '날짜'], ['detailHtml', '상세 HTML', 'textarea'], ['pinned', '상단 고정', 'checkbox'], ['order', '순서', 'number']
  ] },
  { key: 'gallery', label: '갤러리', icon: 'image', columns: ['order', 'imageUrl', 'category', 'title', 'date'], fields: [
    ['imageFile', '이미지 업로드', 'file'], ['imageUrl', '이미지 URL'], ['storagePath', 'Storage 경로'], ['size', '크기', 'select', ['normal', 'large', 'tall']], ['category', '카테고리', 'select', ['news', 'study', 'event', 'project']], ['title', '제목'], ['date', '날짜'], ['order', '순서', 'number']
  ] },
  { key: 'applications', label: '지원서', icon: 'file-text', columns: ['studentId', 'name', 'dept', 'phone', 'interest'], readonly: true }
];

const state = {
  fb: null,
  user: null,
  active: tabs[0],
  items: [],
  editing: null
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function loadFirebase() {
  const [{ firebaseConfig }, appMod, authMod, firestoreMod, storageMod] = await Promise.all([
    import('./firebase-config.js'),
    import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js'),
    import('https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js')
  ]);
  const app = appMod.initializeApp(firebaseConfig);
  return {
    auth: authMod.getAuth(app),
    db: firestoreMod.getFirestore(app),
    storage: storageMod.getStorage(app),
    ...authMod,
    ...firestoreMod,
    ...storageMod
  };
}

function sortItems(items) {
  if (state.active.key === 'notices') {
    return [...items].sort((a, b) => {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
      return (a.order ?? 999) - (b.order ?? 999);
    });
  }
  return [...items].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

async function isAdminUser(user) {
  if (!user) return false;
  const ref = state.fb.doc(state.fb.db, 'admins', user.uid);
  return (await state.fb.getDoc(ref)).exists();
}

function renderTabs() {
  $('#adminTabs').innerHTML = tabs.map(tab => `
    <button class="admin-tab ${tab.key === state.active.key ? 'active' : ''}" data-tab="${tab.key}" type="button">
      <i data-lucide="${tab.icon}"></i>${tab.label}
    </button>
  `).join('');
  $$('.admin-tab').forEach(btn => {
    btn.onclick = () => {
      state.active = tabs.find(tab => tab.key === btn.dataset.tab);
      loadTable();
    };
  });
  if (window.lucide) lucide.createIcons();
}

function setAlert(message = '') {
  const el = $('#adminAlert');
  el.hidden = !message;
  el.textContent = message;
}

async function loadTable() {
  renderTabs();
  setAlert('');
  $('#panelTitle').textContent = state.active.label;
  $('#newItemBtn').hidden = !!state.active.readonly;

  const snap = await state.fb.getDocs(state.fb.collection(state.fb.db, state.active.key));
  state.items = sortItems(snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })));
  renderTable();
}

function renderTable() {
  const columns = state.active.columns;
  $('#tableHead').innerHTML = `<tr>${columns.map(col => `<th>${esc(col)}</th>`).join('')}<th>관리</th></tr>`;
  $('#tableBody').innerHTML = state.items.map(item => `
    <tr>
      ${columns.map(col => `<td>${formatCell(col, item[col])}</td>`).join('')}
      <td>
        <div class="admin-row-actions">
          ${state.active.readonly ? '' : `<button class="admin-small-btn" data-edit="${item.id}" type="button">수정</button>`}
          <button class="admin-small-btn" data-delete="${item.id}" type="button">삭제</button>
        </div>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="${columns.length + 1}">데이터가 없습니다.</td></tr>`;

  $$('[data-edit]').forEach(btn => { btn.onclick = () => openEditor(state.items.find(item => item.id === btn.dataset.edit)); });
  $$('[data-delete]').forEach(btn => { btn.onclick = () => deleteItem(state.items.find(item => item.id === btn.dataset.delete)); });
}

function formatCell(col, value) {
  if (col === 'imageUrl' && value) return `<img class="admin-preview" src="${esc(value)}" alt="" />`;
  if (Array.isArray(value)) return esc(value.join(', '));
  if (typeof value === 'boolean') return value ? 'Y' : 'N';
  if (value && typeof value.toDate === 'function') return esc(value.toDate().toLocaleString('ko-KR'));
  return esc(value ?? '');
}

function openEditor(item = null) {
  state.editing = item;
  $('#editorTitle').textContent = item ? `${state.active.label} 수정` : `${state.active.label} 추가`;
  $('#deleteItemBtn').hidden = !item;
  $('#editorFields').innerHTML = state.active.fields.map(([key, label, type = 'text', options = []]) => renderField(key, label, type, options, item)).join('');
  $('#editorModal').hidden = false;
  if (window.lucide) lucide.createIcons();
}

function renderField(key, label, type, options, item) {
  const value = item?.[key] ?? '';
  const full = type === 'textarea' || type === 'file' ? ' full' : '';
  if (type === 'textarea') {
    return `<label class="${full}">${label}<textarea name="${key}">${esc(value)}</textarea></label>`;
  }
  if (type === 'select') {
    return `<label>${label}<select name="${key}">${options.map(option => `<option value="${esc(option)}" ${value === option ? 'selected' : ''}>${esc(option)}</option>`).join('')}</select></label>`;
  }
  if (type === 'checkbox') {
    return `<label><span>${label}</span><input type="checkbox" name="${key}" ${value ? 'checked' : ''} /></label>`;
  }
  if (type === 'file') {
    return `<label class="${full}">${label}<input type="file" name="${key}" accept="image/*" /></label>`;
  }
  return `<label>${label}<input type="${type}" name="${key}" value="${esc(Array.isArray(value) ? value.join(', ') : value)}" /></label>`;
}

function closeEditor() {
  $('#editorModal').hidden = true;
  state.editing = null;
  $('#editorForm').reset();
}

async function saveItem(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const payload = {};

  for (const [key, label, type = 'text'] of state.active.fields) {
    if (type === 'file') continue;
    if (type === 'checkbox') {
      payload[key] = form.get(key) === 'on';
    } else if (type === 'array') {
      payload[key] = String(form.get(key) || '').split(',').map(part => part.trim()).filter(Boolean);
    } else if (type === 'number') {
      payload[key] = Number(form.get(key) || 0);
    } else {
      payload[key] = String(form.get(key) || '').trim();
    }
  }

  if (state.active.key === 'gallery') {
    const file = form.get('imageFile');
    if (file && file.size) {
      const path = `gallery/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const storageRef = state.fb.ref(state.fb.storage, path);
      await state.fb.uploadBytes(storageRef, file);
      payload.imageUrl = await state.fb.getDownloadURL(storageRef);
      payload.storagePath = path;
    }
  }

  const id = state.editing?.id || createDocId(payload);
  await state.fb.setDoc(state.fb.doc(state.fb.db, state.active.key, id), payload, { merge: true });
  closeEditor();
  toast('저장되었습니다.');
  await loadTable();
}

function createDocId(payload) {
  const base = payload.title || payload.name || payload.studentId || `${state.active.key}-${Date.now()}`;
  return String(base).trim().toLowerCase().replace(/[^a-z0-9가-힣]+/gi, '-').replace(/^-|-$/g, '') || `${state.active.key}-${Date.now()}`;
}

async function deleteItem(item) {
  if (!item) return;
  if (!confirm('정말 삭제할까요?')) return;
  if (state.active.key === 'gallery' && item.storagePath) {
    try {
      await state.fb.deleteObject(state.fb.ref(state.fb.storage, item.storagePath));
    } catch (err) {
      console.warn('Storage delete failed; deleting Firestore document anyway.', err);
    }
  }
  await state.fb.deleteDoc(state.fb.doc(state.fb.db, state.active.key, item.id));
  if (state.editing?.id === item.id) closeEditor();
  toast('삭제되었습니다.');
  await loadTable();
}

async function seedInitialData() {
  if (!confirm('현재 초기 데이터를 Firestore에 병합 저장할까요? 기존 같은 ID 문서는 덮어쓸 수 있습니다.')) return;
  for (const [collectionName, items] of Object.entries(seedCollections)) {
    for (const item of items) {
      const { id, ...payload } = item;
      await state.fb.setDoc(state.fb.doc(state.fb.db, collectionName, id), payload, { merge: true });
    }
  }
  toast('초기 데이터 시딩이 완료되었습니다.');
  await loadTable();
}

async function login(event) {
  event.preventDefault();
  $('#loginMessage').textContent = '';
  try {
    const credential = await state.fb.signInWithEmailAndPassword(
      state.fb.auth,
      $('#adminEmail').value.trim(),
      $('#adminPassword').value
    );
    if (!(await isAdminUser(credential.user))) {
      await state.fb.signOut(state.fb.auth);
      $('#loginMessage').textContent = '관리자 권한이 없습니다. admins/{uid} 문서를 먼저 생성해주세요.';
      return;
    }
    await showDashboard(credential.user);
  } catch (err) {
    console.error(err);
    $('#loginMessage').textContent = '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.';
  }
}

async function showDashboard(user) {
  state.user = user;
  $('#loginView').hidden = true;
  $('#dashboardView').hidden = false;
  await loadTable();
}

async function boot() {
  try {
    state.fb = await loadFirebase();
  } catch (err) {
    $('#loginMessage').textContent = 'firebase-config.js를 불러올 수 없습니다.';
    console.error(err);
    return;
  }

  $('#loginForm').onsubmit = login;
  $('#logoutBtn').onclick = async () => {
    await state.fb.signOut(state.fb.auth);
    location.reload();
  };
  $('#newItemBtn').onclick = () => openEditor();
  $('#editorClose').onclick = closeEditor;
  $('#editorModal').onclick = e => { if (e.target.id === 'editorModal') closeEditor(); };
  $('#editorForm').onsubmit = saveItem;
  $('#deleteItemBtn').onclick = () => deleteItem(state.editing);
  $('#seedBtn').onclick = seedInitialData;

  state.fb.onAuthStateChanged(state.fb.auth, async user => {
    if (user && await isAdminUser(user)) await showDashboard(user);
  });
  renderTabs();
}

boot();
