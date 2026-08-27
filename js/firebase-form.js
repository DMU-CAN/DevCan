async function loadFirebase() {
  const [{ firebaseConfig }, appMod, firestoreMod] = await Promise.all([
    import('./firebase-config.js'),
    import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js')
  ]);
  const app = appMod.initializeApp(firebaseConfig);
  return {
    db: firestoreMod.getFirestore(app),
    doc: firestoreMod.doc,
    getDoc: firestoreMod.getDoc,
    setDoc: firestoreMod.setDoc,
    serverTimestamp: firestoreMod.serverTimestamp
  };
}

function toast(message) {
  if (window.showToast) window.showToast(message);
  else alert(message);
}

async function initApplicationForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  let firebase;
  try {
    firebase = await loadFirebase();
  } catch (err) {
    console.info('Firebase application form unavailable.', err);
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '지원 준비 중';
    }
    return;
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const dept = document.getElementById('dept').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const interest = document.getElementById('interest').value;
    const message = document.getElementById('message').value.trim();

    if (!name || !studentId) return;

    submitBtn.textContent = '처리 중...';
    submitBtn.disabled = true;

    try {
      const docRef = firebase.doc(firebase.db, 'applications', studentId);
      const docSnap = await firebase.getDoc(docRef);

      if (docSnap.exists()) {
        toast('이미 지원된 학번입니다. 중복 지원은 불가합니다.');
        return;
      }

      await firebase.setDoc(docRef, {
        name,
        studentId,
        dept,
        phone,
        interest,
        message,
        submittedAt: firebase.serverTimestamp()
      });

      contactForm.reset();
      toast(`${name}님의 지원서가 접수되었습니다! 빠른 시일 내에 연락드리겠습니다.`);
    } catch (err) {
      console.error('지원서 제출 오류:', err);
      toast('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      submitBtn.textContent = '지원하기';
      submitBtn.disabled = false;
    }
  });
}

initApplicationForm();
