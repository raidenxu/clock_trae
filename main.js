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

// 当前显示的时间（统一管理）
let currentDisplayTime = getCurrentTime();

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

// 统一更新时间显示的方法
function updateTime() {
  const newTime = getCurrentTime();
  
  // 检查哪些数字需要翻页
  if (newTime.hours !== currentDisplayTime.hours) {
    if (newTime.hours[0] !== currentDisplayTime.hours[0]) {
      startFlip('hour1', currentDisplayTime.hours[0], newTime.hours[0]);
    }
    if (newTime.hours[1] !== currentDisplayTime.hours[1]) {
      startFlip('hour2', currentDisplayTime.hours[1], newTime.hours[1]);
    }
  }
  
  if (newTime.minutes !== currentDisplayTime.minutes) {
    if (newTime.minutes[0] !== currentDisplayTime.minutes[0]) {
      startFlip('minute1', currentDisplayTime.minutes[0], newTime.minutes[0]);
    }
    if (newTime.minutes[1] !== currentDisplayTime.minutes[1]) {
      startFlip('minute2', currentDisplayTime.minutes[1], newTime.minutes[1]);
    }
  }
  
  if (newTime.seconds !== currentDisplayTime.seconds) {
    if (newTime.seconds[0] !== currentDisplayTime.seconds[0]) {
      startFlip('second1', currentDisplayTime.seconds[0], newTime.seconds[0]);
    }
    if (newTime.seconds[1] !== currentDisplayTime.seconds[1]) {
      startFlip('second2', currentDisplayTime.seconds[1], newTime.seconds[1]);
    }
  }
  
  // 更新当前显示的时间
  currentDisplayTime = newTime;
  
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

// 绘制带圆角的矩形
function drawRoundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// 绘制卡片阴影效果
function drawCardShadow(x, y, width, height, radius, intensity = 1) {
  ctx.save();
  
  // 外层阴影
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 15 * intensity;
  ctx.shadowOffsetX = 5 * intensity;
  ctx.shadowOffsetY = 8 * intensity;
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  drawRoundedRect(x, y, width, height, radius);
  ctx.fill();
  
  ctx.restore();
}

// 绘制卡片立体边框
function drawCardBorder(x, y, width, height, radius, theme) {
  ctx.save();
  
  // 外边框
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 2;
  drawRoundedRect(x, y, width, height, radius);
  ctx.stroke();
  
  // 内高光边框
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  drawRoundedRect(x + 1, y + 1, width - 2, height - 2, radius - 1);
  ctx.stroke();
  
  ctx.restore();
}

// 绘制渐变背景
function drawGradientBackground(x, y, width, height, radius, theme, isTop = true) {
  const gradient = ctx.createLinearGradient(x, y, x, y + height);
  
  if (isTop) {
    // 上半部分：稍微亮一点
    gradient.addColorStop(0, lightenColor(theme.foreground, 10));
    gradient.addColorStop(1, theme.foreground);
  } else {
    // 下半部分：稍微暗一点
    gradient.addColorStop(0, theme.foreground);
    gradient.addColorStop(1, darkenColor(theme.foreground, 10));
  }
  
  ctx.fillStyle = gradient;
  drawRoundedRect(x, y, width, height, radius);
  ctx.fill();
}

// 颜色辅助函数
function lightenColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

function darkenColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

// 绘制数字的上半部分
function drawTopHalf(x, y, width, height, digit, theme) {
  const radius = Math.min(width, height) * 0.1;
  
  ctx.save();
  ctx.beginPath();
  // 上半部分：顶部有圆角，底部（靠近转轴）没有圆角
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height / 2);
  ctx.lineTo(x, y + height / 2);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.clip();
  
  // 绘制渐变背景（使用顶部圆角，底部直角）
  // 直接绘制而不是调用drawGradientBackground，因为底部需要直角
  const gradient = ctx.createLinearGradient(x, y, x, y + height / 2);
  gradient.addColorStop(0, lightenColor(theme.foreground, 10));
  gradient.addColorStop(1, theme.foreground);
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height / 2);
  ctx.lineTo(x, y + height / 2);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
  
  // 添加高光效果
  const highlightGradient = ctx.createLinearGradient(x, y, x, y + height / 4);
  highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
  highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = highlightGradient;
  ctx.fillRect(x, y, width, height / 4);
  
  // 绘制数字
  ctx.fillStyle = theme.digit;
  ctx.font = `bold ${height * 0.8}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(digit, x + width / 2, y + height / 2);
  
  ctx.restore();
}

// 绘制数字的下半部分
function drawBottomHalf(x, y, width, height, digit, theme) {
  const radius = Math.min(width, height) * 0.1;
  
  ctx.save();
  ctx.beginPath();
  // 下半部分：底部有圆角，顶部（靠近转轴）没有圆角
  ctx.moveTo(x, y + height / 2);
  ctx.lineTo(x + width, y + height / 2);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + height / 2);
  ctx.closePath();
  ctx.clip();
  
  // 绘制渐变背景（使用底部圆角，顶部直角）
  // 直接绘制而不是调用drawGradientBackground，因为顶部需要直角
  const gradient = ctx.createLinearGradient(x, y + height / 2, x, y + height);
  gradient.addColorStop(0, theme.foreground);
  gradient.addColorStop(1, darkenColor(theme.foreground, 10));
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(x, y + height / 2);
  ctx.lineTo(x + width, y + height / 2);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + height / 2);
  ctx.closePath();
  ctx.fill();
  
  // 添加阴影效果
  const shadowGradient = ctx.createLinearGradient(x, y + height / 2, x, y + height);
  shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
  ctx.fillStyle = shadowGradient;
  ctx.fillRect(x, y + height / 2, width, height / 2);
  
  // 绘制数字
  ctx.fillStyle = theme.digit;
  ctx.font = `bold ${height * 0.8}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(digit, x + width / 2, y + height / 2);
  
  ctx.restore();
}

// 绘制中间转轴效果（更真实的卡片转轴）
function drawMiddleAxis(x, y, width, height, theme) {
  const centerY = y + height / 2;
  
  ctx.save();
  
  // 转轴凹槽效果
  const grooveGradient = ctx.createLinearGradient(x, centerY - 3, x, centerY + 3);
  grooveGradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
  grooveGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.1)');
  grooveGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
  
  ctx.fillStyle = grooveGradient;
  ctx.fillRect(x, centerY - 3, width, 6);
  
  // 转轴高光
  const highlightGradient = ctx.createLinearGradient(x, centerY - 1, x, centerY + 1);
  highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
  highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
  highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
  
  ctx.fillStyle = highlightGradient;
  ctx.fillRect(x, centerY - 1, width, 2);
  
  ctx.restore();
}

// 绘制翻页动画的上半部分（旧数字向下翻）
// 这是前半段动画：旧数字的上半部分沿中轴线下翻，逐渐消失
function drawFlippingTopOld(x, y, width, height, digit, progress, theme) {
  const radius = Math.min(width, height) * 0.1;
  const angle = progress * Math.PI / 2; // 0 -> 90度
  const cosAngle = Math.cos(angle);
  
  // 当角度超过90度时，不再显示
  if (cosAngle <= 0) return;
  
  ctx.save();
  
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  
  // 透视参数
  const perspective = height * 2;
  const scale = perspective / (perspective + height * (1 - cosAngle) * 0.5);
  
  // 以中间轴线为中心进行3D旋转效果
  ctx.translate(centerX, centerY);
  ctx.scale(scale, cosAngle * scale);
  ctx.translate(-centerX, -centerY);
  
  // 只绘制上半部分（带圆角）
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height / 2);
  ctx.lineTo(x, y + height / 2);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.clip();
  
  // 绘制渐变背景
  drawGradientBackground(x, y, width, height / 2, radius, theme, true);
  
  // 添加动态阴影效果，模拟3D翻页时的光照变化
  const shadowIntensity = progress * 0.6;
  const shadowGradient = ctx.createLinearGradient(x, y, x, y + height / 2);
  shadowGradient.addColorStop(0, `rgba(0, 0, 0, ${shadowIntensity})`);
  shadowGradient.addColorStop(1, `rgba(0, 0, 0, ${shadowIntensity * 0.3})`);
  ctx.fillStyle = shadowGradient;
  ctx.fillRect(x, y, width, height / 2);
  
  // 添加边缘高光（模拟翻页时的边缘反光）
  const edgeHighlight = ctx.createLinearGradient(x, y + height / 2 - 5, x, y + height / 2);
  edgeHighlight.addColorStop(0, 'rgba(255, 255, 255, 0)');
  edgeHighlight.addColorStop(1, `rgba(255, 255, 255, ${0.3 * (1 - progress)})`);
  ctx.fillStyle = edgeHighlight;
  ctx.fillRect(x, y + height / 2 - 5, width, 5);
  
  // 绘制数字
  ctx.fillStyle = theme.digit;
  ctx.font = `bold ${height * 0.8}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(digit, centerX, centerY);
  
  ctx.restore();
}

// 绘制翻页动画的下半部分（新数字向下翻）
// 这是后半段动画：新数字的下半部分沿中轴线下翻，逐渐显示
function drawFlippingBottomNew(x, y, width, height, digit, progress, theme) {
  const radius = Math.min(width, height) * 0.1;
  const angle = progress * Math.PI / 2; // 0 -> 90度
  const cosAngle = Math.cos(angle);
  const scaleY = 1 - cosAngle; // 从0到1
  
  // 当进度为0时，不显示
  if (scaleY <= 0) return;
  
  ctx.save();
  
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  
  // 透视参数
  const perspective = height * 2;
  const scale = perspective / (perspective + height * cosAngle * 0.5);
  
  // 以中间轴线为中心进行3D旋转效果
  ctx.translate(centerX, centerY);
  ctx.scale(scale, scaleY * scale);
  ctx.translate(-centerX, -centerY);
  
  // 只绘制下半部分（带圆角）
  ctx.beginPath();
  ctx.moveTo(x, y + height / 2);
  ctx.lineTo(x + width, y + height / 2);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + height / 2);
  ctx.closePath();
  ctx.clip();
  
  // 绘制渐变背景
  drawGradientBackground(x, y + height / 2, width, height / 2, radius, theme, false);
  
  // 添加动态阴影效果，模拟3D翻页时的光照变化
  const shadowIntensity = (1 - progress) * 0.5;
  const shadowGradient = ctx.createLinearGradient(x, y + height / 2, x, y + height);
  shadowGradient.addColorStop(0, `rgba(0, 0, 0, ${shadowIntensity})`);
  shadowGradient.addColorStop(1, `rgba(0, 0, 0, ${shadowIntensity + 0.2})`);
  ctx.fillStyle = shadowGradient;
  ctx.fillRect(x, y + height / 2, width, height / 2);
  
  // 添加边缘高光（模拟翻页时的边缘反光）
  const edgeHighlight = ctx.createLinearGradient(x, y + height / 2, x, y + height / 2 + 5);
  edgeHighlight.addColorStop(0, `rgba(255, 255, 255, ${0.3 * progress})`);
  edgeHighlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = edgeHighlight;
  ctx.fillRect(x, y + height / 2, width, 5);
  
  // 绘制数字
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
  const radius = Math.min(width, height) * 0.1;
  
  // 绘制卡片阴影（立体效果）
  drawCardShadow(x, y, width, height, radius);
  
  // 绘制背景（带圆角和渐变）
  drawGradientBackground(x, y, width, height, radius, theme, true);
  
  // 绘制立体边框
  drawCardBorder(x, y, width, height, radius, theme);
  
  // 如果没有翻页动画，直接绘制数字
  if (flipProgress === 0 || oldDigit === null) {
    drawTopHalf(x, y, width, height, digit, theme);
    drawBottomHalf(x, y, width, height, digit, theme);
    drawMiddleAxis(x, y, width, height, theme);
    return;
  }
  
  // 真实卡片下翻效果逻辑：
  // 1. 起始状态：显示完整的旧数字
  // 2. 前半段（0-50%）：
  //    - 底层：新数字的上半部分（静态，逐渐露出）
  //    - 底层：旧数字的下半部分（静态，逐渐被遮盖）
  //    - 翻页层：旧数字的上半部分沿中轴线下翻，逐渐消失
  // 3. 后半段（50-100%）：
  //    - 底层：新数字的上半部分（完全显示）
  //    - 翻页层：新数字的下半部分沿中轴线下翻，逐渐显示
  //    - 底层：旧数字的下半部分（逐渐被遮盖）
  // 4. 结束状态：显示完整的新数字
  
  // 绘制底层：新数字的上半部分（始终在底层，前半段逐渐露出）
  drawTopHalf(x, y, width, height, digit, theme);
  
  // 绘制底层：旧数字的下半部分（始终在底层，后半段逐渐被遮盖）
  drawBottomHalf(x, y, width, height, oldDigit, theme);
  
  // 绘制翻页动画
  if (flipProgress < 0.5) {
    // 前半段（0-50%）：旧数字的上半部分向下翻，逐渐消失
    const progress = flipProgress * 2; // 0 -> 1
    
    // 绘制旧数字的上半部分（向下翻，逐渐消失）
    drawFlippingTopOld(x, y, width, height, oldDigit, progress, theme);
  } else {
    // 后半段（50-100%）：新数字的下半部分向下翻，逐渐显示
    const progress = (flipProgress - 0.5) * 2; // 0 -> 1
    
    // 绘制新数字的下半部分（向下翻，逐渐显示）
    drawFlippingBottomNew(x, y, width, height, digit, progress, theme);
  }
  
  // 绘制中间转轴（始终在最上层）
  drawMiddleAxis(x, y, width, height, theme);
}

// 绘制分隔符
function drawSeparator(x, y, size) {
  const theme = getCurrentTheme();
  const dotRadius = size / 4;
  const dotSpacing = size / 2.5;
  
  // 绘制上圆点
  drawSeparatorDot(x, y - dotSpacing, dotRadius, theme);
  
  // 绘制下圆点
  drawSeparatorDot(x, y + dotSpacing, dotRadius, theme);
}

// 绘制单个分隔符圆点（扁平凸起效果）
function drawSeparatorDot(x, y, radius, theme) {
  ctx.save();
  
  // 绘制底部阴影（模拟厚度）
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = radius * 0.3;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = radius * 0.15;
  
  // 绘制扁平凸起的主体
  const gradient = ctx.createLinearGradient(x, y - radius, x, y + radius);
  gradient.addColorStop(0, lightenColor(theme.separator, 15));
  gradient.addColorStop(0.5, theme.separator);
  gradient.addColorStop(1, darkenColor(theme.separator, 10));
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // 绘制顶部高光（扁平效果）
  ctx.shadowColor = 'transparent';
  const highlightGradient = ctx.createLinearGradient(x, y - radius, x, y);
  highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
  highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = highlightGradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // 绘制内边框（增强扁平感）
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = radius * 0.08;
  ctx.beginPath();
  ctx.arc(x, y, radius - radius * 0.08, 0, Math.PI * 2);
  ctx.stroke();
  
  // 绘制外边框
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.lineWidth = radius * 0.08;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.restore();
}

// 统一绘制数字的方法
function drawDigit(x, y, width, height, digitKey) {
  const flipInfo = flippingDigits[digitKey];
  
  if (flipInfo) {
    const progress = Math.min(1, (Date.now() - flipInfo.startTime) / flipDuration);
    drawFlipDigit(x, y, width, height, flipInfo.newValue, progress, flipInfo.oldValue);
    if (progress >= 1) {
      delete flippingDigits[digitKey];
    }
  } else {
    // 根据digitKey获取当前显示的数字
    let digit;
    switch (digitKey) {
      case 'hour1':
        digit = currentDisplayTime.hours[0];
        break;
      case 'hour2':
        digit = currentDisplayTime.hours[1];
        break;
      case 'minute1':
        digit = currentDisplayTime.minutes[0];
        break;
      case 'minute2':
        digit = currentDisplayTime.minutes[1];
        break;
      case 'second1':
        digit = currentDisplayTime.seconds[0];
        break;
      case 'second2':
        digit = currentDisplayTime.seconds[1];
        break;
      default:
        digit = '0';
    }
    drawFlipDigit(x, y, width, height, digit);
  }
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
  const cardGap = 1; // 两张卡片之间的间距
  
  // 计算位置
  const totalWidth = digitWidth * 6 + separatorSize * 2 + cardGap * 4;
  const startX = (width - totalWidth) / 2;
  const startY = (height - digitHeight) / 2;
  
  // 使用统一的方法绘制所有数字
  // 绘制小时
  drawDigit(startX, startY, digitWidth, digitHeight, 'hour1');
  drawDigit(startX + digitWidth + cardGap, startY, digitWidth, digitHeight, 'hour2');
  
  // 绘制分隔符
  drawSeparator(startX + digitWidth * 2 + cardGap + separatorSize / 2, startY + digitHeight / 2, separatorSize);
  
  // 绘制分钟
  drawDigit(startX + digitWidth * 2 + cardGap + separatorSize, startY, digitWidth, digitHeight, 'minute1');
  drawDigit(startX + digitWidth * 3 + cardGap * 2 + separatorSize, startY, digitWidth, digitHeight, 'minute2');
  
  // 绘制分隔符
  drawSeparator(startX + digitWidth * 4 + cardGap * 2 + separatorSize * 1.5, startY + digitHeight / 2, separatorSize);
  
  // 绘制秒钟
  drawDigit(startX + digitWidth * 4 + cardGap * 2 + separatorSize * 2, startY, digitWidth, digitHeight, 'second1');
  drawDigit(startX + digitWidth * 5 + cardGap * 3 + separatorSize * 2, startY, digitWidth, digitHeight, 'second2');
  
  // 继续渲染
  requestAnimationFrame(render);
}

// 启动应用
init();
