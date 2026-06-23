/* ========================================
   多肽 App — 数据层 (localStorage)
   ======================================== */

const STORAGE_KEYS = {
  TRAINING_DAYS: 'duotai_trainingDays',
  TEMPLATES: 'duotai_templates',
  SETTINGS: 'duotai_settings',
};

const BLOCK_TYPES = [
  { id: 'exercise', label: '动作', icon: '\u25cf' },
  { id: 'weight', label: '重量', icon: '\u25c6' },
  { id: 'sets', label: '组数', icon: '\u25a0' },
  { id: 'reps', label: '次数', icon: '\u25b2' },
  { id: 'duration', label: '时长', icon: '\u25c9' },
  { id: 'note', label: '备注', icon: '\u2014' },
  { id: 'custom', label: '自定义', icon: '+' },
];

const DEFAULT_TEMPLATES = [
  { id: 'tpl_001', name: '练胸日', blocks: [
    { id: 'tb_001_1', label: '卧推', type: 'exercise' },
    { id: 'tb_001_2', label: '上斜哑铃卧推', type: 'exercise' },
    { id: 'tb_001_3', label: '飞鸟', type: 'exercise' },
    { id: 'tb_001_4', label: '双杠臂屈伸', type: 'exercise' },
  ]},
  { id: 'tpl_002', name: '练背日', blocks: [
    { id: 'tb_002_1', label: '引体向上', type: 'exercise' },
    { id: 'tb_002_2', label: '杠铃划船', type: 'exercise' },
    { id: 'tb_002_3', label: '坐姿划船', type: 'exercise' },
    { id: 'tb_002_4', label: '高位下拉', type: 'exercise' },
  ]},
  { id: 'tpl_003', name: '练腿日', blocks: [
    { id: 'tb_003_1', label: '深蹲', type: 'exercise' },
    { id: 'tb_003_2', label: '腿举', type: 'exercise' },
    { id: 'tb_003_3', label: '腿弯举', type: 'exercise' },
    { id: 'tb_003_4', label: '小腿提踵', type: 'exercise' },
  ]},
];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 8);
}
function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function formatDateDisplay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const wd = ['日','一','二','三','四','五','六'];
  return (d.getMonth()+1) + '月' + d.getDate() + '日 周' + wd[d.getDay()];
}
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

const Store = {
  trainingDays: {},
  templates: [],
  settings: { nickname: '', avatarDataUrl: '', createdAt: new Date().toISOString() },

  init() { this.loadTrainingDays(); this.loadTemplates(); this.loadSettings(); },

  loadSettings() {
    try {
      const r = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (r) { this.settings = { ...this.settings, ...JSON.parse(r) }; }
      else { this.saveSettings(); }
    } catch(e) {}
  },
  saveSettings() { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings)); },
  updateSetting(k,v) { this.settings[k]=v; this.saveSettings(); },
  getNickname() { return this.settings.nickname || ''; },
  getAvatarUrl() { return this.settings.avatarDataUrl || ''; },

  loadTrainingDays() {
    try { const r = localStorage.getItem(STORAGE_KEYS.TRAINING_DAYS); this.trainingDays = r ? JSON.parse(r) : {}; }
    catch(e){ this.trainingDays = {}; }
  },
  saveTrainingDays() { localStorage.setItem(STORAGE_KEYS.TRAINING_DAYS, JSON.stringify(this.trainingDays)); },
  getDay(d) { return this.trainingDays[d] || null; },
  getOrCreateDay(d) { if(!this.trainingDays[d]) this.trainingDays[d]={id:d,date:d,blocks:[]}; return this.trainingDays[d]; },
  saveDay(d,data) { this.trainingDays[d]=data; this.saveTrainingDays(); },
  deleteDay(d) { delete this.trainingDays[d]; this.saveTrainingDays(); },
  hasTraining(d) { const day=this.trainingDays[d]; return day && day.blocks && day.blocks.length>0; },
  getTrainingDates() { return Object.keys(this.trainingDays).filter(d=>this.hasTraining(d)).sort(); },
  getTrainingCount() { return this.getTrainingDates().length; },

  loadTemplates() {
    try {
      const r = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      this.templates = r ? JSON.parse(r) : [];
      if (this.templates.length===0) { this.templates=JSON.parse(JSON.stringify(DEFAULT_TEMPLATES)); this.saveTemplates(); }
    } catch(e){ this.templates=[]; }
  },
  saveTemplates() { localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(this.templates)); },
  getTemplate(id) { return this.templates.find(t=>t.id===id) || null; },
  addTemplate(name,blocks) {
    const tpl={id:generateId(),name:name.trim(),blocks:blocks.map(b=>({id:generateId(),label:b.label||'',type:b.type||'custom'}))};
    this.templates.push(tpl); this.saveTemplates(); return tpl;
  },
  updateTemplate(id,updates) {
    const idx=this.templates.findIndex(t=>t.id===id);
    if(idx===-1)return null; Object.assign(this.templates[idx],updates); this.saveTemplates(); return this.templates[idx];
  },
  deleteTemplate(id) { this.templates=this.templates.filter(t=>t.id!==id); this.saveTemplates(); },
};
