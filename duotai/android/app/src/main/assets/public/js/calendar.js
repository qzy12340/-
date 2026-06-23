/* ========================================
   多肽 App — 日历组件
   ======================================== */

// currentDate: 当前正在查看的年月（用于日历渲染）
let calendarViewDate = new Date();
// selectedDate: 当前选中的日期字符串
let selectedDateStr = todayStr();

function renderCalendar() {
  const container = document.getElementById('calendar-content');
  const year = calendarViewDate.getFullYear();
  const month = calendarViewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'];

  let html = `
    <div class="calendar-container">
      <div class="calendar-header">
        <div class="calendar-month-year">${year}年 ${monthNames[month]}</div>
        <div class="calendar-nav-btns">
          <button class="calendar-nav-btn" onclick="calendarPrevMonth()">‹</button>
          <button class="calendar-nav-btn calendar-today-btn" onclick="calendarGoToday()">•</button>
          <button class="calendar-nav-btn" onclick="calendarNextMonth()">›</button>
        </div>
      </div>
      <div class="calendar-weekdays">
        <span class="calendar-weekday">日</span>
        <span class="calendar-weekday">一</span>
        <span class="calendar-weekday">二</span>
        <span class="calendar-weekday">三</span>
        <span class="calendar-weekday">四</span>
        <span class="calendar-weekday">五</span>
        <span class="calendar-weekday">六</span>
      </div>
      <div class="calendar-days">
  `;

  // 上月末尾
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    html += `<div class="calendar-day other-month" data-date="${dateStr}">${d}</div>`;
  }

  // 本月
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = dateStr === todayStr();
    const isSelected = dateStr === selectedDateStr;
    const hasTraining = Store.hasTraining(dateStr);

    let cls = 'calendar-day';
    if (isToday) cls += ' today';
    if (isSelected) cls += ' selected';
    if (hasTraining) cls += ' has-training';

    html += `<div class="${cls}" data-date="${dateStr}">${d}</div>`;
  }

  // 下月开头
  const totalCells = firstDay + daysInMonth;
  const remaining = (7 - (totalCells % 7)) % 7;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  for (let d = 1; d <= remaining; d++) {
    const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    html += `<div class="calendar-day other-month" data-date="${dateStr}">${d}</div>`;
  }

  // 底部统计
  const trainingCount = Store.getTrainingCount();

  html += `
      </div>
      <div class="calendar-stats">
        <div class="calendar-stat">
          <div class="calendar-stat-num">${trainingCount}</div>
          <div class="calendar-stat-label">训练天数</div>
        </div>
        <div class="calendar-stat">
          <div class="calendar-stat-num">${year}</div>
          <div class="calendar-stat-label">当前年份</div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // 绑定日期点击事件
  const dayEls = container.querySelectorAll('.calendar-day:not(.other-month)');
  dayEls.forEach(el => {
    el.addEventListener('click', () => {
      const dateStr = el.dataset.date;
      selectedDateStr = dateStr;
      navigateToRecord(dateStr);
    });
  });
}

function calendarPrevMonth() {
  calendarViewDate.setMonth(calendarViewDate.getMonth() - 1);
  renderCalendar();
}

function calendarNextMonth() {
  calendarViewDate.setMonth(calendarViewDate.getMonth() + 1);
  renderCalendar();
}

function calendarGoToday() {
  calendarViewDate = new Date();
  selectedDateStr = todayStr();
  renderCalendar();
  navigateToRecord(selectedDateStr);
}
