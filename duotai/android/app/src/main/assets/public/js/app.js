/* ========================================
   多肽 App — 主入口 & 导航
   ======================================== */

function switchPage(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageName);
  if (target) target.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === pageName);
  });
  switch (pageName) {
    case 'calendar': renderCalendar(); updateAvatarAndNickname(); break;
    case 'templates': renderTemplates(); break;
    case 'progress': renderProgress(); break;
    case 'settings': renderSettings(); break;
  }
}

function closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }

function showToast(message) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1600);
}

function triggerAvatarUpload() { document.getElementById('avatar-file-input').click(); }

function updateAvatarAndNickname() {
  const displayEl = document.getElementById('header-nickname-display');
  if (displayEl) displayEl.textContent = Store.getNickname() || '点击设置昵称';
  const greetingEl = document.getElementById('header-greeting');
  if (greetingEl) {
    const h = new Date().getHours();
    let g = '';
    if (h < 6) g = '夜深了';
    else if (h < 9) g = '早上好';
    else if (h < 12) g = '上午好';
    else if (h < 14) g = '中午好';
    else if (h < 18) g = '下午好';
    else g = '晚上好';
    greetingEl.textContent = g;
  }
  const url = Store.getAvatarUrl();
  const imgEl = document.getElementById('avatar-img');
  const placeholderEl = document.getElementById('avatar-placeholder');
  if (imgEl && placeholderEl) {
    if (url) { imgEl.src = url; imgEl.style.display = 'block'; placeholderEl.style.display = 'none'; }
    else { imgEl.style.display = 'none'; placeholderEl.style.display = 'block'; }
  }
}

function handleAvatarFile(file) {
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('请选择图片文件'); return; }
  if (file.size > 5*1024*1024) { showToast('图片不能超过 5MB'); return; }
  const reader = new FileReader();
  reader.onload = (e) => { Store.updateSetting('avatarDataUrl', e.target.result); updateAvatarAndNickname(); showToast('头像已更新'); };
  reader.readAsDataURL(file);
}

function showEditNicknameModal() {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  content.innerHTML = '<div class="modal-title">设置昵称</div><div style="display:flex;flex-direction:column;gap:var(--space-lg);"><input class="input-field" id="nickname-input" type="text" placeholder="输入你的昵称" value="' + escapeHtml(Store.getNickname()) + '" maxlength="20" autocomplete="off"><div style="display:flex;gap:var(--space-md);"><button class="btn-secondary" onclick="closeModal()" style="flex:1;">取消</button><button class="btn-primary" onclick="saveNickname()" style="flex:1;">保存</button></div></div>';
  overlay.classList.remove('hidden');
  const input = document.getElementById('nickname-input');
  setTimeout(() => { input.focus(); input.select(); }, 100);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') saveNickname(); });
}

function saveNickname() {
  const value = document.getElementById('nickname-input').value.trim();
  Store.updateSetting('nickname', value);
  closeModal();
  updateAvatarAndNickname();
  if (document.getElementById('page-settings').classList.contains('active')) renderSettings();
  showToast(value ? '昵称已更新' : '已清空昵称');
}

document.addEventListener('DOMContentLoaded', function() {
  var ai = document.getElementById('avatar-file-input');
  if (ai) ai.addEventListener('change', function(e) { if (e.target.files && e.target.files[0]) handleAvatarFile(e.target.files[0]); e.target.value = ''; });
  var ri = document.getElementById('restore-file-input');
  if (ri) ri.addEventListener('change', function(e) { if (e.target.files && e.target.files[0]) importAllData(e.target.files[0]); e.target.value = ''; });
});

function initApp() {
  Store.init();
  document.querySelectorAll('.nav-item').forEach(function(item) {
    item.addEventListener('click', function() { switchPage(item.dataset.page); });
  });
  document.getElementById('btn-back-from-record').addEventListener('click', function() { switchPage('calendar'); });
  document.getElementById('btn-back-from-templates').addEventListener('click', function() { switchPage('calendar'); });
  document.getElementById('btn-back-from-progress').addEventListener('click', function() { switchPage('calendar'); });
  document.getElementById('btn-back-from-settings').addEventListener('click', function() { switchPage('calendar'); });
  renderCalendar();
  updateAvatarAndNickname();
  document.getElementById('modal-overlay').addEventListener('click', function(e) {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });
}
document.addEventListener('DOMContentLoaded', initApp);
