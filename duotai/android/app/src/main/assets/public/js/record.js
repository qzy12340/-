/* ========================================
   多肽 App — 训练记录页面
   ======================================== */

let currentRecordDate = todayStr();

function navigateToRecord(dateStr) {
  currentRecordDate = dateStr;
  switchPage('record');
  renderRecordPage();
}

function renderRecordPage() {
  const container = document.getElementById('record-content');
  document.getElementById('record-date-title').textContent = formatDateDisplay(currentRecordDate);
  const day = Store.getOrCreateDay(currentRecordDate);
  const blocks = day.blocks || [];
  const isFuture = currentRecordDate > todayStr();

  var html = '';
  html += '<div class="record-header-actions">';
  html += '<button class="record-action-btn" onclick="showAddBlockModal()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="vertical-align:middle;margin-right:4px;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> 添加方块</button>';
  html += '<button class="record-action-btn" onclick="showApplyTemplateModal()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="vertical-align:middle;margin-right:4px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line></svg> 从模板生成</button>';
  html += '</div>';

  if (isFuture) {
    html += '<div class="empty-state"><div class="empty-state-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.6;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div><div class="empty-state-text">未来的日子<br>先专注今天吧</div></div>';
    container.innerHTML = html;
    return;
  }

  if (blocks.length === 0) {
    html += '<div class="record-empty"><div class="empty-state-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg></div><div class="record-empty-text">还没有训练记录<br>添加方块开始记录吧</div></div>';
  } else {
    html += '<div class="blocks-container" id="blocks-container">';
    blocks.forEach(function(block, index) {
      var typeInfo = BLOCK_TYPES.find(function(t) { return t.id === block.type; }) || { label: '自定义', icon: '+' };
      html += '<div class="block-item" data-block-id="' + block.id + '" data-index="' + index + '">';
      html += '<span class="block-drag-handle">\u22ee\u22ee</span>';
      html += '<span class="block-type-badge">' + typeInfo.icon + '</span>';
      html += '<input class="block-input" type="text" data-block-id="' + block.id + '" value="' + escapeHtml(block.label) + '" placeholder="输入内容..." autocomplete="off">';
      html += '<button class="block-delete-btn" data-block-id="' + block.id + '">\u2715</button>';
      html += '</div>';
    });
    html += '</div>';
  }
  container.innerHTML = html;

  container.querySelectorAll('.block-input').forEach(function(input) {
    input.addEventListener('input', function(e) {
      var day = Store.getOrCreateDay(currentRecordDate);
      var block = day.blocks.find(function(b) { return b.id === e.target.dataset.blockId; });
      if (block) { block.label = e.target.value; Store.saveDay(currentRecordDate, day); }
    });
  });
  container.querySelectorAll('.block-delete-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) { deleteBlock(e.target.dataset.blockId); });
  });
}

function deleteBlock(blockId) {
  var day = Store.getOrCreateDay(currentRecordDate);
  day.blocks = day.blocks.filter(function(b) { return b.id !== blockId; });
  if (day.blocks.length === 0) Store.deleteDay(currentRecordDate);
  else Store.saveDay(currentRecordDate, day);
  renderRecordPage();
  showToast(day.blocks.length === 0 ? '已清空训练记录' : '已删除');
}

function showAddBlockModal() {
  var overlay = document.getElementById('modal-overlay');
  var content = document.getElementById('modal-content');
  var html = '<div class="modal-title">添加方块</div><div class="block-type-grid">';
  BLOCK_TYPES.forEach(function(type) {
    html += '<div class="block-type-option" data-type="' + type.id + '"><div class="block-type-option-icon">' + type.icon + '</div><div class="block-type-option-label">' + type.label + '</div></div>';
  });
  html += '</div>';
  content.innerHTML = html;
  overlay.classList.remove('hidden');
  content.querySelectorAll('.block-type-option').forEach(function(opt) {
    opt.addEventListener('click', function() { addBlockOfType(opt.dataset.type); closeModal(); });
  });
}

function addBlockOfType(type) {
  var day = Store.getOrCreateDay(currentRecordDate);
  day.blocks.push({ id: generateId(), label: '', type: type, sortOrder: day.blocks.length });
  Store.saveDay(currentRecordDate, day);
  renderRecordPage();
  setTimeout(function() {
    var inputs = document.querySelectorAll('.block-input');
    if (inputs.length > 0) inputs[inputs.length - 1].focus();
  }, 50);
}

function showApplyTemplateModal() {
  var overlay = document.getElementById('modal-overlay');
  var content = document.getElementById('modal-content');
  var templates = Store.templates;
  if (templates.length === 0) {
    content.innerHTML = '<div class="modal-title">从模板生成</div><div class="empty-state"><div class="empty-state-text">还没有模板<br>先去「模板」页面创建吧</div></div>';
    overlay.classList.remove('hidden');
    return;
  }
  var html = '<div class="modal-title">选择模板</div><div style="display:flex;flex-direction:column;gap:var(--space-md);">';
  templates.forEach(function(tpl) {
    var preview = tpl.blocks.map(function(b) { return b.label; }).join('、');
    html += '<div class="card" style="cursor:pointer;" data-tpl-id="' + tpl.id + '"><div style="font-weight:600;margin-bottom:4px;">' + escapeHtml(tpl.name) + '</div><div style="font-size:var(--text-sm);color:var(--text-medium);">' + escapeHtml(preview) + '</div></div>';
  });
  html += '</div>';
  content.innerHTML = html;
  overlay.classList.remove('hidden');
  content.querySelectorAll('[data-tpl-id]').forEach(function(card) {
    card.addEventListener('click', function() { applyTemplate(card.dataset.tplId); closeModal(); });
  });
}

function applyTemplate(tplId) {
  var tpl = Store.getTemplate(tplId);
  if (!tpl) { showToast('模板不存在'); return; }
  var day = Store.getOrCreateDay(currentRecordDate);
  tpl.blocks.forEach(function(tb) {
    day.blocks.push({ id: generateId(), label: tb.label, type: tb.type, sortOrder: day.blocks.length });
  });
  Store.saveDay(currentRecordDate, day);
  renderRecordPage();
  showToast('已应用模板「' + tpl.name + '」');
}
