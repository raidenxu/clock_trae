// 预定义色彩主题
const themes = {
  classic: {
    foreground: '#2d2d44',
    background: '#1a1a2e',
    digit: '#ffffff',
    separator: '#ff6b6b'
  },
  dark: {
    foreground: '#1e1e1e',
    background: '#121212',
    digit: '#e0e0e0',
    separator: '#bb86fc'
  },
  light: {
    foreground: '#ffffff',
    background: '#f5f5f5',
    digit: '#333333',
    separator: '#ff5722'
  },
  ocean: {
    foreground: '#00796b',
    background: '#006064',
    digit: '#e0f7fa',
    separator: '#00bcd4'
  },
  sunset: {
    foreground: '#ff8a65',
    background: '#e65100',
    digit: '#fff3e0',
    separator: '#ffcc02'
  }
};

// 当前主题
let currentTheme = 'classic';
let customTheme = { ...themes.classic };

// 获取DOM元素
const canvas = document.getElementById('clockCanvas');
const ctx = canvas.getContext('2d');
const themeSelect = document.getElementById('themeSelect');
const colorPicker = document.getElementById('colorPicker');
const foregroundColorInput = document.getElementById('foregroundColor');
const backgroundColorInput = document.getElementById('backgroundColor');
const digitColorInput = document.getElementById('digitColor');
const separatorColorInput = document.getElementById('separatorColor');

// 翻页动画参数
const flipDuration = 300; // 翻页动画持续时间（毫秒）
let flippingDigits = {}; // 正在翻页的数字

// 初始化
function init() {
  resizeCanvas();
  setupEventListeners();
  updateTime();
  requestAnimationFrame(render);
}

// 调整Canvas大小
function resizeCanvas() {
  const container = canvas.parentElement;
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  // 设置Canvas的实际像素尺寸（考虑设备像素比）
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  
  // 设置Canvas的显示尺寸
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  
  // 缩放上下文以匹配设备像素比
  ctx.scale(dpr, dpr);
}

// 设置事件监听器
function setupEventListeners() {
  // 窗口大小变化
  window.addEventListener('resize', resizeCanvas);
  
  // 主题选择
  themeSelect.addEventListener('change', (e) => {
    currentTheme = e.target.value;
    if (currentTheme === 'custom') {
      colorPicker.classList.add('active');
      updateColorInputs();
    } else {
      colorPicker.classList.remove('active');
    }
  });
  
  // 颜色选择器
  foregroundColorInput.addEventListener('input', (e) => {
    customTheme.foreground = e.target.value;
    currentTheme = 'custom';
    themeSelect.value = 'custom';
    colorPicker.classList.add('active');
  });
  
  backgroundColorInput.addEventListener('input', (e) => {
    customTheme.background = e.target.value;
    currentTheme = 'custom';
    themeSelect.value = 'custom';
    colorPicker.classList.add('active');
  });
  
  digitColorInput.addEventListener('input', (e) => {
    customTheme.digit = e.target.value;
    currentTheme = 'custom';
    themeSelect.value = 'custom';
    colorPicker.classList.add('active');
  });
  
  separatorColorInput.addEventListener('input', (e) => {
    customTheme.separator = e.target.value;
    currentTheme = 'custom';
    themeSelect.value = 'custom';
    colorPicker.classList.add('active');
  });
}

// 更新颜色输入框的值
function updateColorInputs() {
  const theme = currentTheme === 'custom' ? customTheme : themes[currentTheme];
  foregroundColorInput.value = theme.foreground;
  backgroundColorInput.value = theme.background;
  digitColorInput.value = theme.digit;
  separatorColorInput.value = theme.separator;
}

// 获取当前主题
function getCurrentTheme() {
  return currentTheme === 'custom' ? customTheme : themes[currentTheme];
}

// 获取当前时间
function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return { hours, minutes, seconds };
}

// 上一次的时间
let lastTime = getCurrentTime();

// 更新时间
function updateTime() {
  const currentTime = getCurrentTime();
  
  // 检查哪些数字需要翻页
  if (currentTime.hours !== lastTime.hours) {
    if (currentTime.hours[0] !== lastTime.hours[0]) {
      startFlip('hour1', lastTime.hours[0], currentTime.hours[0]);
    }
    if (currentTime.hours[1] !== lastTime.hours[1]) {
      startFlip('hour2', lastTime.hours[1], currentTime.hours[1]);
    }
  }
  
  if (currentTime.minutes !== lastTime.minutes) {
    if (currentTime.minutes[0] !== lastTime.minutes[0]) {
      startFlip('minute1', lastTime.minutes[0], currentTime.minutes[0]);
    }
    if (currentTime.minutes[1] !== lastTime.minutes[1]) {
      startFlip('minute2', lastTime.minutes[1], currentTime.minutes[1]);
    }
  }
  
  if (currentTime.seconds !== lastTime.seconds) {
    if (currentTime.seconds[0] !== lastTime.seconds[0]) {
      startFlip('second1', lastTime.seconds[0], currentTime.seconds[0]);
    }
    if (currentTime.seconds[1] !== lastTime.seconds[1]) {
      startFlip('second2', lastTime.seconds[1], currentTime.seconds[1]);
    }
  }
  
  lastTime = currentTime;
  
  // 每秒更新一次时间
  setTimeout(updateTime, 1000);
}

// 开始翻页动画
function startFlip(digitKey, oldValue, newValue) {
  flippingDigits[digitKey] = {
    oldValue,
    newValue,
    startTime: Date.now()
  };
}

// 绘制数字的上半部分
function drawTopHalf(x, y, width, height, digit, theme) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height / 2);
  ctx.clip();
  
  ctx.fillStyle = theme.foreground;
  ctx.fillRect(x, y, width, height / 2);
  
  ctx.fillStyle = theme.digit;
  ctx.font = `bold ${height * 0.8}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(digit, x + width / 2, y + height / 2);
  
  ctx.restore();
}

// 绘制数字的下半部分
function drawBottomHalf(x, y, width, height, digit, theme) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y + height / 2, width, height / 2);
  ctx.clip();
  
  ctx.fillStyle = theme.foreground;
  ctx.fillRect(x, y + height / 2, width, height / 2);
  
  ctx.fillStyle = theme.digit;
  ctx.font = `bold ${height * 0.8}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(digit, x + width / 2, y + height / 2);
  
  ctx.restore();
}

// 绘制翻页动画的上半部分（旧数字向下翻）
function drawFlippingTop(x, y, width, height, digit, progress, theme) {
  const angle = progress * Math.PI;
  const cosAngle = Math.cos(angle);
  
  if (cosAngle <= 0) return;
  
  ctx.save();
  
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  
  ctx.translate(centerX, centerY);
  ctx.scale(1, cosAngle);
  ctx.translate(-centerX, -centerY);
  
  ctx.beginPath();
  ctx.rect(x, y, width, height / 2);
  ctx.clip();
  
  ctx.fillStyle = theme.foreground;
  ctx.fillRect(x, y, width, height / 2);
  
  const gradient = ctx.createLinearGradient(x, y, x, y + height / 2);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height / 2);
  
  ctx.fillStyle = theme.digit;
  ctx.font = `bold ${height * 0.8}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(digit, centerX, centerY);
  
  ctx.restore();
}

// 绘制翻页动画的下半部分（新数字向下翻）
function drawFlippingBottom(x, y, width, height, digit, progress, theme) {
  const angle = progress * Math.PI;
  const cosAngle = Math.cos(angle);
  
  if (cosAngle >= 0) return;
  
  ctx.save();
  
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  
  ctx.translate(centerX, centerY);
  ctx.scale(1, -cosAngle);
  ctx.translate(-centerX, -centerY);
  
  ctx.beginPath();
  ctx.rect(x, y + height / 2, width, height / 2);
  ctx.clip();
  
  ctx.fillStyle = theme.foreground;
  ctx.fillRect(x, y + height / 2, width, height / 2);
  
  const gradient = ctx.createLinearGradient(x, y + height / 2, x, y + height);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y + height / 2, width, height / 2);
  
  ctx.fillStyle = theme.digit;
  ctx.font = `bold ${height * 0.8}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(digit, centerX, centerY);
  
  ctx.restore();
}

// 绘制翻页数字
function drawFlipDigit(x, y, width, height, digit, flipProgress = 0, oldDigit = null) {
  const theme = getCurrentTheme();
  
  // 绘制背景
  ctx.fillStyle = theme.foreground;
  ctx.fillRect(x, y, width, height);
  
  // 绘制边框
  ctx.strokeStyle = theme.background;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
  
  // 绘制中间分隔线
  ctx.beginPath();
  ctx.moveTo(x, y + height / 2);
  ctx.lineTo(x + width, y + height / 2);
  ctx.strokeStyle = theme.background;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // 如果没有翻页动画，直接绘制数字
  if (flipProgress === 0 || oldDigit === null) {
    drawTopHalf(x, y, width, height, digit, theme);
    drawBottomHalf(x, y, width, height, digit, theme);
    return;
  }
  
  // 翻页动画逻辑：
  // 1. 上半部分：显示新数字的上半部分（静态）
  // 2. 下半部分：显示旧数字的下半部分（静态）
  // 3. 翻页效果：
  //    - 前半段：旧数字的上半部分向下翻
  //    - 后半段：新数字的下半部分向下翻
  
  // 绘制静态的新数字上半部分
  drawTopHalf(x, y, width, height, digit, theme);
  
  // 绘制静态的旧数字下半部分
  drawBottomHalf(x, y, width, height, oldDigit, theme);
  
  // 绘制翻页动画
  if (flipProgress < 0.5) {
    // 前半段：旧数字的上半部分向下翻
    const progress = flipProgress * 2;
    drawFlippingTop(x, y, width, height, oldDigit, progress, theme);
  } else {
    // 后半段：新数字的下半部分向下翻
    const progress = (flipProgress - 0.5) * 2;
    drawFlippingBottom(x, y, width, height, digit, progress, theme);
  }
}

// 绘制分隔符
function drawSeparator(x, y, size) {
  const theme = getCurrentTheme();
  
  ctx.fillStyle = theme.separator;
  
  // 上圆点
  ctx.beginPath();
  ctx.arc(x, y - size / 3, size / 4, 0, Math.PI * 2);
  ctx.fill();
  
  // 下圆点
  ctx.beginPath();
  ctx.arc(x, y + size / 3, size / 4, 0, Math.PI * 2);
  ctx.fill();
}

// 渲染函数
function render() {
  const theme = getCurrentTheme();
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);
  
  // 清空画布
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, width, height);
  
  // 计算时钟尺寸
  const clockWidth = Math.min(width * 0.9, height * 0.6);
  const digitHeight = clockWidth * 0.3;
  const digitWidth = digitHeight * 0.6;
  const separatorSize = digitHeight * 0.3;
  
  // 计算位置
  const totalWidth = digitWidth * 6 + separatorSize * 2;
  const startX = (width - totalWidth) / 2;
  const startY = (height - digitHeight) / 2;
  
  // 获取当前时间
  const currentTime = getCurrentTime();
  
  // 绘制小时
  const hour1Flip = flippingDigits.hour1;
  const hour2Flip = flippingDigits.hour2;
  
  if (hour1Flip) {
    const progress = Math.min(1, (Date.now() - hour1Flip.startTime) / flipDuration);
    drawFlipDigit(startX, startY, digitWidth, digitHeight, currentTime.hours[0], progress, hour1Flip.oldValue);
    if (progress >= 1) {
      delete flippingDigits.hour1;
    }
  } else {
    drawFlipDigit(startX, startY, digitWidth, digitHeight, currentTime.hours[0]);
  }
  
  if (hour2Flip) {
    const progress = Math.min(1, (Date.now() - hour2Flip.startTime) / flipDuration);
    drawFlipDigit(startX + digitWidth, startY, digitWidth, digitHeight, currentTime.hours[1], progress, hour2Flip.oldValue);
    if (progress >= 1) {
      delete flippingDigits.hour2;
    }
  } else {
    drawFlipDigit(startX + digitWidth, startY, digitWidth, digitHeight, currentTime.hours[1]);
  }
  
  // 绘制分隔符
  drawSeparator(startX + digitWidth * 2 + separatorSize / 2, startY + digitHeight / 2, separatorSize);
  
  // 绘制分钟
  const minute1Flip = flippingDigits.minute1;
  const minute2Flip = flippingDigits.minute2;
  
  if (minute1Flip) {
    const progress = Math.min(1, (Date.now() - minute1Flip.startTime) / flipDuration);
    drawFlipDigit(startX + digitWidth * 2 + separatorSize, startY, digitWidth, digitHeight, currentTime.minutes[0], progress, minute1Flip.oldValue);
    if (progress >= 1) {
      delete flippingDigits.minute1;
    }
  } else {
    drawFlipDigit(startX + digitWidth * 2 + separatorSize, startY, digitWidth, digitHeight, currentTime.minutes[0]);
  }
  
  if (minute2Flip) {
    const progress = Math.min(1, (Date.now() - minute2Flip.startTime) / flipDuration);
    drawFlipDigit(startX + digitWidth * 3 + separatorSize, startY, digitWidth, digitHeight, currentTime.minutes[1], progress, minute2Flip.oldValue);
    if (progress >= 1) {
      delete flippingDigits.minute2;
    }
  } else {
    drawFlipDigit(startX + digitWidth * 3 + separatorSize, startY, digitWidth, digitHeight, currentTime.minutes[1]);
  }
  
  // 绘制分隔符
  drawSeparator(startX + digitWidth * 4 + separatorSize * 1.5, startY + digitHeight / 2, separatorSize);
  
  // 绘制秒钟
  const second1Flip = flippingDigits.second1;
  const second2Flip = flippingDigits.second2;
  
  if (second1Flip) {
    const progress = Math.min(1, (Date.now() - second1Flip.startTime) / flipDuration);
    drawFlipDigit(startX + digitWidth * 4 + separatorSize * 2, startY, digitWidth, digitHeight, currentTime.seconds[0], progress, second1Flip.oldValue);
    if (progress >= 1) {
      delete flippingDigits.second1;
    }
  } else {
    drawFlipDigit(startX + digitWidth * 4 + separatorSize * 2, startY, digitWidth, digitHeight, currentTime.seconds[0]);
  }
  
  if (second2Flip) {
    const progress = Math.min(1, (Date.now() - second2Flip.startTime) / flipDuration);
    drawFlipDigit(startX + digitWidth * 5 + separatorSize * 2, startY, digitWidth, digitHeight, currentTime.seconds[1], progress, second2Flip.oldValue);
    if (progress >= 1) {
      delete flippingDigits.second2;
    }
  } else {
    drawFlipDigit(startX + digitWidth * 5 + separatorSize * 2, startY, digitWidth, digitHeight, currentTime.seconds[1]);
  }
  
  // 继续渲染
  requestAnimationFrame(render);
}

// 启动应用
init();
