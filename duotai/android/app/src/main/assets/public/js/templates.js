/* ========================================
   多肽 App — 模板管理页面
   ======================================== */

function renderTemplates() {
  var container = document.getElementById('templates-content');
  var templates = Store.templates;
  var html = '<button class="template-add-btn" onclick="showCreateTemplateModal()">\uff0b 新建模板</button>';
  if (templates.length === 0) {
    html += '<div class="empty-state" style="margin-top:var(--space-2xl);"><div class="empty-state-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.6;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg></div><div class="empty-state-text">还没有训练模板<br>创建一个来规划你的训练计划吧</div></div>';
    container.innerHTML = html;
    return;
  }
  html += '<div class="template-list" style="margin-top:var(--space-lg);">';
  templates.forEach(function(tpl) {
    var preview = tpl.blocks.map(function(b) { return b.label; }).join('、');
    html += '<div class="template-item" data-tpl-id="' + tpl.id + '">';
    html += '<div class="template-item-header" onclick="showEditTemplateModal(\'' + tpl.id + '\')"><span class="template-item-name">' + escapeHtml(tpl.name) + '</span><span class="template-item-count">' + tpl.blocks.length + ' 项</span></div>';
    html += '<div class="template-item-preview" onclick="showEditTemplateModal(\'' + tpl.id + '\')">' + escapeHtml(preview) + '</div>';
    html += '<div class="template-item-actions"><button class="btn-danger" onclick="confirmDeleteTemplate(\'' + tpl.id + '\')">删除</button></div>';
    html += '</div>';
  });
  html += '</div>';
  container.innerHTML = html;
}

function showCreateTemplateModal() {
  var overlay = document.getElementById('modal-overlay');
  var content = document.getElementById('modal-content');
  content.innerHTML = '<div class="modal-title">新建模板</div><div style="display:flex;flex-direction:column;gap:var(--space-lg);"><input class="input-field" id="new-tpl-name" type="text" placeholder="模板名称（如：练胸日）" autocomplete="off"><div style="font-size:var(--text-sm);color:var(--text-medium);">创建后可编辑模板内容</div><div style="display:flex;gap:var(--space-md);"><button class="btn-secondary" onclick="closeModal()" style="flex:1;">取消</button><button class="btn-primary" onclick="createTemplate()" style="flex:1;">创建</button></div></div>';
  overlay.classList.remove('hidden');
  var input = document.getElementById('new-tpl-name');
  setTimeout(function() { input.focus(); }, 100);
  input.addEventListener('keydown', function(e) { if (e.key === 'Enter') createTemplate(); });
}

function createTemplate() {
  var name = document.getElementById('new-tpl-name').value.trim();
  if (!name) { showToast('请输入模板名称'); return; }
  Store.addTemplate(name, [{ id: generateId(), label: '', type: 'exercise' }]);
  closeModal();
  renderTemplates();
  showToast('已创建模板「' + name + '」');
}

function showEditTemplateModal(tplId) {
  var tpl = Store.getTemplate(tplId);
  if (!tpl) return;
  var overlay = document.getElementById('modal-overlay');
  var content = document.getElementById('modal-content');
  var blocksHtml = '';
  tpl.blocks.forEach(function(block) {
    var typeInfo = BLOCK_TYPES.find(function(t) { return t.id === block.type; }) || { label: '自定义', icon: '+' };
    blocksHtml += '<div class="block-item" data-edit-block-id="' + block.id + '" style="margin-bottom:var(--space-sm);"><span class="block-type-badge">' + typeInfo.icon + '</span><input class="block-input" type="text" data-edit-block-id="' + block.id + '" value="' + escapeHtml(block.label) + '" placeholder="输入动作名称..." autocomplete="off"><button class="block-delete-btn" data-edit-block-id="' + block.id + '" style="opacity:0.6;">\u2715</button></div>';
  });
  content.innerHTML = '<div class="modal-title">' + escapeHtml(tpl.name) + '</div><div style="display:flex;flex-direction:column;gap:var(--space-sm);margin-bottom:var(--space-lg);" id="edit-blocks-container">' + blocksHtml + '</div><div style="display:flex;gap:var(--space-sm);margin-bottom:var(--space-lg);"><button class="record-action-btn" onclick="addBlockToEditTemplate(\'' + tplId + '\')">\uff0b 添加动作</button></div><div style="display:flex;gap:var(--space-md);"><button class="btn-secondary" onclick="closeModal()" style="flex:1;">完成</button></div>';
  overlay.classList.remove('hidden');
  content.querySelectorAll('.block-input').forEach(function(input) {
    input.addEventListener('input', function(e) {
      var block = tpl.blocks.find(function(b) { return b.id === e.target.dataset.editBlockId; });
      if (block) { block.label = e.target.value; Store.saveTemplates(); }
    });
  });
  content.querySelectorAll('.block-delete-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      tpl.blocks = tpl.blocks.filter(function(b) { return b.id !== e.target.dataset.editBlockId; });
      Store.saveTemplates();
      showEditTemplateModal(tplId);
      showToast('已删除');
    });
  });
}

function addBlockToEditTemplate(tplId) {
  var tpl = Store.getTemplate(tplId);
  if (!tpl) return;
  tpl.blocks.push({ id: generateId(), label: '', type: 'exercise' });
  Store.saveTemplates();
  showEditTemplateModal(tplId);
}

function confirmDeleteTemplate(tplId) {
  var tpl = Store.getTemplate(tplId);
  if (!tpl) return;
  if (confirm('确定删除模板「' + tpl.name + '」吗？')) {
    Store.deleteTemplate(tplId);
    renderTemplates();
    showToast('已删除模板');
  }
}
