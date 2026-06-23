/* ========================================
   多肽 App — 进度追踪页面
   ======================================== */

var progressChart = null;

function renderProgress() {
  var container = document.getElementById('progress-content');
  var exerciseSet = new Set();
  var days = Store.getTrainingDates();
  days.forEach(function(dateStr) {
    var day = Store.getDay(dateStr);
    if (day && day.blocks) {
      day.blocks.forEach(function(b) {
        var label = b.label.trim();
        if (label && (b.type === 'exercise' || b.type === 'custom')) exerciseSet.add(label);
      });
    }
  });
  var exercises = Array.from(exerciseSet).sort();
  if (exercises.length === 0) {
    container.innerHTML = '<div class="empty-state" style="margin-top:var(--space-2xl);"><div class="empty-state-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.6;"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg></div><div class="empty-state-text">还没有训练数据<br>开始记录训练后，这里会展示你的进度</div></div>';
    return;
  }
  var html = '<div style="font-size:var(--text-sm);color:var(--text-medium);margin-bottom:var(--space-md);font-weight:500;">选择动作</div><select class="exercise-selector" id="exercise-selector">';
  exercises.forEach(function(ex) { html += '<option value="' + escapeHtml(ex) + '">' + escapeHtml(ex) + '</option>'; });
  html += '</select><div class="metric-selector" id="metric-selector"><button class="metric-option active" data-metric="count">次数</button><button class="metric-option" data-metric="sets">组数</button><button class="metric-option" data-metric="volume">总量</button></div><div class="chart-container"><div class="chart-title" id="chart-title">趋势</div><canvas id="progress-chart-canvas"></canvas></div>';
  container.innerHTML = html;
  document.getElementById('exercise-selector').value = exercises[0];
  document.getElementById('exercise-selector').addEventListener('change', function() { updateChart(); });
  document.querySelectorAll('.metric-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
      document.querySelectorAll('.metric-option').forEach(function(o) { o.classList.remove('active'); });
      opt.classList.add('active');
      updateChart();
    });
  });
  updateChart();
}

function updateChart() {
  var exerciseName = document.getElementById('exercise-selector').value;
  var activeMetric = document.querySelector('.metric-option.active');
  var metric = activeMetric ? activeMetric.dataset.metric : 'count';
  var dataPoints = [];
  var days = Store.getTrainingDates();
  days.forEach(function(dateStr) {
    var day = Store.getDay(dateStr);
    if (!day || !day.blocks) return;
    var collecting = false;
    var count = 0, sets = 0, weightTotal = 0;
    var hasData = false;
    day.blocks.forEach(function(b) {
      var label = b.label.trim();
      if (b.type === 'exercise') { collecting = (label === exerciseName); return; }
      if (!collecting) return;
      var num;
      if (b.type === 'reps' || label.indexOf('次') !== -1) { num = extractNumber(label); if (num !== null) { count += num; hasData = true; } }
      if (b.type === 'sets' || label.indexOf('组') !== -1) { num = extractNumber(label); if (num !== null) { sets += num; hasData = true; } }
      if (b.type === 'weight' || label.indexOf('kg') !== -1 || label.indexOf('公斤') !== -1) { num = extractNumber(label); if (num !== null) { weightTotal += num; hasData = true; } }
    });
    if (!hasData) return;
    var metricValue = 0;
    if (metric === 'count') metricValue = count;
    else if (metric === 'sets') metricValue = sets;
    else if (metric === 'volume') metricValue = weightTotal;
    dataPoints.push({ date: dateStr, value: metricValue });
  });
  dataPoints.sort(function(a,b) { return a.date.localeCompare(b.date); });
  var chartTitle = document.getElementById('chart-title');
  var metricNames = { count: '次数', sets: '组数', volume: '总重量(kg)' };
  chartTitle.textContent = exerciseName + ' \u2014 ' + (metricNames[metric] || '次数') + '趋势';
  var ctx = document.getElementById('progress-chart-canvas');
  if (!ctx) return;
  if (progressChart) { progressChart.destroy(); progressChart = null; }
  if (dataPoints.length === 0) { chartTitle.textContent = exerciseName + ' \u2014 暂无数据'; return; }
  var labels = dataPoints.map(function(p) { var parts = p.date.split('-'); return parseInt(parts[1]) + '/' + parseInt(parts[2]); });
  var values = dataPoints.map(function(p) { return p.value; });
  if (typeof Chart === 'undefined') {
    chartTitle.textContent = exerciseName + ' \u2014 图表加载失败，请检查应用文件';
    return;
  }
  progressChart = new Chart(ctx, {
    type: 'line',
    data: { labels: labels, datasets: [{ label: exerciseName, data: values, borderColor: '#8B9D8B', backgroundColor: 'rgba(139,157,139,0.1)', borderWidth: 2.5, pointBackgroundColor: '#8B9D8B', pointBorderColor: '#FFFFFF', pointBorderWidth: 2, pointRadius: 5, pointHoverRadius: 7, tension: 0.3, fill: true }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(44,44,44,0.9)', titleFont: { family: 'Inter', size: 12 }, bodyFont: { family: 'Inter', size: 13 }, padding: 10, cornerRadius: 8 } }, scales: { x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 }, color: '#A0A0A0' } }, y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false }, ticks: { font: { family: 'Inter', size: 11 }, color: '#A0A0A0', precision: 0 } } }, interaction: { intersect: false, mode: 'index' } }
  });
  ctx.parentElement.style.minHeight = '250px';
  ctx.style.width = '100%';
  ctx.style.height = '250px';
}

function extractNumber(str) {
  var match = str.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}
