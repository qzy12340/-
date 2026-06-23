/* ========================================
   多肽 App — 设置页面
   ======================================== */

function renderSettings() {
  var container = document.getElementById('settings-content');
  var appVersion = '1.0.0';
  var buildDate = '2026-06-23';
  var dataSize = estimateDataSize();
  var nickname = Store.getNickname();
  var nicknameDisplay = nickname || '未设置';
  var trainingCount = Store.getTrainingCount();

  container.innerHTML = 
    '<div class="settings-section">' +
      '<div class="settings-section-title">个人信息</div>' +
      '<div class="settings-card">' +
        '<div class="settings-item" onclick="showEditNicknameModal()">' +
          '<div class="settings-item-left"><span class="settings-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></span>' +
            '<div class="settings-item-info"><span class="settings-item-label">昵称</span><span class="settings-item-desc">点击修改昵称</span></div></div>' +
          '<span class="settings-item-value">' + escapeHtml(nicknameDisplay) + '</span></div>' +
        '<div class="settings-item" onclick="triggerAvatarUpload()">' +
          '<div class="settings-item-left"><span class="settings-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></span>' +
            '<div class="settings-item-info"><span class="settings-item-label">头像</span><span class="settings-item-desc">点击选择图片</span></div></div>' +
          '<span class="settings-item-action">更换</span></div></div></div>' +

    '<div class="settings-divider-surreal"></div>' +

    '<div class="settings-section">' +
      '<div class="settings-section-title">数据与存储</div>' +
      '<div class="settings-card">' +
        '<div class="settings-item neon-accent">' +
          '<div class="settings-item-left"><span class="settings-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg></span>' +
            '<div class="settings-item-info"><span class="settings-item-label">数据存储</span><span class="settings-item-desc">浏览器本地存储（localStorage）</span></div></div>' +
          '<span class="settings-item-value">' + dataSize + '</span></div>' +
        '<div class="settings-item">' +
          '<div class="settings-item-left"><span class="settings-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></span>' +
            '<div class="settings-item-info"><span class="settings-item-label">数据位置</span><span class="settings-item-desc">仅存储于本设备浏览器内</span></div></div>' +
          '<span class="settings-item-value">本地</span></div>' +
        '<div class="settings-item">' +
          '<div class="settings-item-left"><span class="settings-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></span>' +
            '<div class="settings-item-info"><span class="settings-item-label">导出数据</span><span class="settings-item-desc">备份所有训练记录和设置</span></div></div>' +
          '<span class="settings-item-action" onclick="exportAllData()">导出</span></div>' +
        '<div class="settings-item">' +
          '<div class="settings-item-left"><span class="settings-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg></span>' +
            '<div class="settings-item-info"><span class="settings-item-label">导入数据</span><span class="settings-item-desc">从备份文件恢复</span></div></div>' +
          '<span class="settings-item-action" onclick="document.getElementById(\'restore-file-input\').click()">导入</span></div></div></div>' +

    '<div class="settings-divider-surreal"></div>' +

    '<div class="settings-section">' +
      '<div class="settings-section-title">权限说明</div>' +
      '<div class="settings-card">' +
        '<div class="settings-item amber-accent">' +
          '<div class="settings-item-left"><span class="settings-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></span>' +
            '<div class="settings-item-info"><span class="settings-item-label">图片访问</span><span class="settings-item-desc">仅用于设置头像，不上传网络</span></div></div>' +
          '<span class="settings-item-value">可选</span></div>' +
        '<div class="settings-item crimson-accent">' +
          '<div class="settings-item-left"><span class="settings-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg></span>' +
            '<div class="settings-item-info"><span class="settings-item-label">本地存储</span><span class="settings-item-desc">保存训练记录、模板和个人设置</span></div></div>' +
          '<span class="settings-item-value">必需</span></div>' +
        '<div class="settings-item">' +
          '<div class="settings-item-left"><span class="settings-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></span>' +
            '<div class="settings-item-info"><span class="settings-item-label">网络请求</span><span class="settings-item-desc">零网络请求，数据不上传云端</span></div></div>' +
          '<span class="settings-item-value">无</span></div>' +
        '<div class="settings-item">' +
          '<div class="settings-item-left"><span class="settings-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg></span>' +
            '<div class="settings-item-info"><span class="settings-item-label">图表加载</span><span class="settings-item-desc">Chart.js CDN（仅获取库文件）</span></div></div>' +
          '<span class="settings-item-value">仅CDN</span></div></div>' +
      '<div style="margin-top:var(--space-sm);padding:var(--space-sm) var(--space-sm) 0;font-size:var(--text-xs);color:var(--text-light);line-height:1.6;">' +
        '多肽尊重你的隐私。所有训练数据仅存储在本地设备浏览器中，不会上传到任何服务器。图表库通过CDN加载，除此之外无任何网络请求。</div></div>' +

    '<div class="settings-divider-surreal"></div>' +

    '<div class="settings-section">' +
      '<div class="settings-section-title">关于</div>' +
      '<div class="settings-card">' +
        '<div class="settings-item"><div class="settings-item-left"><span class="settings-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></span><div class="settings-item-info"><span class="settings-item-label">应用名称</span></div></div><span class="settings-item-value">多肽</span></div>' +
        '<div class="settings-item"><div class="settings-item-left"><span class="settings-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></span><div class="settings-item-info"><span class="settings-item-label">版本</span></div></div><span class="settings-item-value">' + appVersion + '</span></div>' +
        '<div class="settings-item"><div class="settings-item-left"><span class="settings-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></span><div class="settings-item-info"><span class="settings-item-label">构建日期</span></div></div><span class="settings-item-value">' + buildDate + '</span></div>' +
        '<div class="settings-item"><div class="settings-item-left"><span class="settings-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path></svg></span><div class="settings-item-info"><span class="settings-item-label">训练天数</span></div></div><span class="settings-item-value">' + trainingCount + ' 天</span></div></div></div>' +

    '<div style="text-align:center;padding:var(--space-xl) 0;font-size:var(--text-xs);color:var(--text-light);">用 \u2764\ufe0f 和 \ud83d\udcaa 打造<br>数据完全属于你</div>';
}

function estimateDataSize() {
  var total = 0;
  try {
    for (var key in localStorage) {
      if (key.indexOf('duotai_') === 0) total += localStorage[key].length * 2;
    }
  } catch(e) {}
  if (total < 1024) return total + ' B';
  if (total < 1024*1024) return (total/1024).toFixed(1) + ' KB';
  return (total/(1024*1024)).toFixed(1) + ' MB';
}

function exportAllData() {
  var data = { version: '1.0.0', exportedAt: new Date().toISOString(), trainingDays: Store.trainingDays, templates: Store.templates, settings: Store.settings };
  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = '多肽_备份_' + todayStr() + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('数据已导出');
}

function importAllData(file) {
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var data = JSON.parse(e.target.result);
      if (!data.trainingDays || !data.templates) { showToast('备份文件格式无效'); return; }
      Store.trainingDays = data.trainingDays || {};
      Store.templates = data.templates || [];
      Store.settings = Object.assign({}, Store.settings, data.settings || {});
      Store.saveTrainingDays();
      Store.saveTemplates();
      Store.saveSettings();
      showToast('数据已恢复');
      renderSettings();
      renderCalendar();
    } catch(err) { showToast('导入失败：文件格式错误'); }
  };
  reader.readAsText(file);
}
