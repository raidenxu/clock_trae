// 预定义色彩主题
const themes = {
  classic: {
    foreground: '#333333',
    background: '#1a1a1a',
    digit: '#ffffff',
    separator: '#888888'
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

// 动画模块
const animationModule = (function() {
  const animations = {
    flip: {
      name: '翻页',
      duration: 300,
      draw: drawFlipAnimation
    },
    slide: {
      name: '滑动',
      duration: 250,
      draw: drawSlideAnimation
    },
    fade: {
      name: '淡入',
      duration: 300,
      draw: drawFadeAnimation
    },
    zoom: {
      name: '缩放',
      duration: 250,
      draw: drawZoomAnimation
    },
    rotate: {
      name: '旋转',
      duration: 350,
      draw: drawRotateAnimation
    }
  };

  let currentAnimation = 'flip';

  function setAnimation(animationName) {
    if (animations[animationName]) {
      currentAnimation = animationName;
      return true;
    }
    return false;
  }

  function getCurrentAnimation() {
    return animations[currentAnimation];
  }

  function getAnimation(name) {
    return animations[name];
  }

  function getAllAnimations() {
    return Object.keys(animations);
  }

  return {
    setAnimation,
    getCurrentAnimation,
    getAnimation,
    getAllAnimations
  };
})();

// 当前主题和动画
let currentTheme = 'classic';
let customTheme = { ...themes.classic };

// 获取DOM元素
const canvas = document.getElementById('clockCanvas');
const ctx = canvas.getContext('2d');
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const customColors = document.getElementById('customColors');
const foregroundColorInput = document.getElementById('foregroundColor');
const backgroundColorInput = document.getElementById('backgroundColor');
const digitColorInput = document.getElementById('digitColor');
const separatorColorInput = document.getElementById('separatorColor');

// 动画数字
let animatingDigits = {};

// 当前显示的时间
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
  
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  
  ctx.scale(dpr, dpr);
}

// 设置事件监听器
function setupEventListeners() {
  window.addEventListener('resize', resizeCanvas);
  
  // 设置面板开关
  settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSettingsPanel();
  });
  
  // 点击面板外部关闭
  document.addEventListener('click', (e) => {
    if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
      closeSettingsPanel();
    }
  });
  
  // 主题选择
  document.querySelectorAll('.theme-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const themeName = btn.dataset.theme;
      setTheme(themeName);
      updateThemeUI(themeName);
    });
  });
  
  // 动画选择
  document.querySelectorAll('.animation-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const animationName = btn.dataset.animation;
      animationModule.setAnimation(animationName);
      updateAnimationUI(animationName);
    });
  });
  
  // 颜色选择器
  foregroundColorInput.addEventListener('input', (e) => {
    customTheme.foreground = e.target.value;
    currentTheme = 'custom';
    updateThemeUI('custom');
  });
  
  backgroundColorInput.addEventListener('input', (e) => {
    customTheme.background = e.target.value;
    currentTheme = 'custom';
    updateThemeUI('custom');
  });
  
  digitColorInput.addEventListener('input', (e) => {
    customTheme.digit = e.target.value;
    currentTheme = 'custom';
    updateThemeUI('custom');
  });
  
  separatorColorInput.addEventListener('input', (e) => {
    customTheme.separator = e.target.value;
    currentTheme = 'custom';
    updateThemeUI('custom');
  });
}

function toggleSettingsPanel() {
  settingsBtn.classList.toggle('active');
  settingsPanel.classList.toggle('open');
}

function closeSettingsPanel() {
  settingsBtn.classList.remove('active');
  settingsPanel.classList.remove('open');
}

function setTheme(themeName) {
  if (themeName === 'custom') {
    customColors.style.display = 'block';
    updateColorInputs();
  } else {
    customColors.style.display = 'none';
    if (themes[themeName]) {
      customTheme = { ...themes[themeName] };
    }
  }
  currentTheme = themeName;
}

function updateThemeUI(themeName) {
  document.querySelectorAll('.theme-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === themeName);
  });
  if (themeName === 'custom') {
    customColors.style.display = 'block';
    updateColorInputs();
  } else {
    customColors.style.display = 'none';
  }
}

function updateAnimationUI(animationName) {
  document.querySelectorAll('.animation-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.animation === animationName);
  });
}

function updateColorInputs() {
  const theme = currentTheme === 'custom' ? customTheme : themes[currentTheme];
  foregroundColorInput.value = theme.foreground;
  backgroundColorInput.value = theme.background;
  digitColorInput.value = theme.digit;
  separatorColorInput.value = theme.separator;
}

function getCurrentTheme() {
  return currentTheme === 'custom' ? customTheme : themes[currentTheme];
}

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return { hours, minutes, seconds };
}

function updateTime() {
  const newTime = getCurrentTime();
  const animation = animationModule.getCurrentAnimation();
  
  if (newTime.hours !== currentDisplayTime.hours) {
    if (newTime.hours[0] !== currentDisplayTime.hours[0]) {
      startAnimation('hour1', currentDisplayTime.hours[0], newTime.hours[0]);
    }
    if (newTime.hours[1] !== currentDisplayTime.hours[1]) {
      startAnimation('hour2', currentDisplayTime.hours[1], newTime.hours[1]);
    }
  }
  
  if (newTime.minutes !== currentDisplayTime.minutes) {
    if (newTime.minutes[0] !== currentDisplayTime.minutes[0]) {
      startAnimation('minute1', currentDisplayTime.minutes[0], newTime.minutes[0]);
    }
    if (newTime.minutes[1] !== currentDisplayTime.minutes[1]) {
      startAnimation('minute2', currentDisplayTime.minutes[1], newTime.minutes[1]);
    }
  }
  
  if (newTime.seconds !== currentDisplayTime.seconds) {
    if (newTime.seconds[0] !== currentDisplayTime.seconds[0]) {
      startAnimation('second1', currentDisplayTime.seconds[0], newTime.seconds[0]);
    }
    if (newTime.seconds[1] !== currentDisplayTime.seconds[1]) {
      startAnimation('second2', currentDisplayTime.seconds[1], newTime.seconds[1]);
    }
  }
  
  currentDisplayTime = newTime;
  setTimeout(updateTime, 1000);
}

function startAnimation(digitKey, oldValue, newValue) {
  const animation = animationModule.getCurrentAnimation();
  animatingDigits[digitKey] = {
    oldValue,
    newValue,
    startTime: Date.now(),
    duration: animation.duration
  };
}

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

function drawCardShadow(x, y, width, height, radius, intensity = 1) {
  ctx.save();
  
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 15 * intensity;
  ctx.shadowOffsetX = 5 * intensity;
  ctx.shadowOffsetY = 8 * intensity;
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  drawRoundedRect(x, y, width, height, radius);
  ctx.fill();
  
  ctx.restore();
}

function drawCardBorder(x, y, width, height, radius, theme) {
  ctx.save();
  
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 2;
  drawRoundedRect(x, y, width, height, radius);
  ctx.stroke();
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  drawRoundedRect(x + 1, y + 1, width - 2, height - 2, radius - 1);
  ctx.stroke();
  
  ctx.restore();
}

function drawGradientBackground(x, y, width, height, radius, theme, isTop = true) {
  const gradient = ctx.createLinearGradient(x, y, x, y + height);
  
  if (isTop) {
    gradient.addColorStop(0, lightenColor(theme.foreground, 10));
    gradient.addColorStop(1, theme.foreground);
  } else {
    gradient.addColorStop(0, theme.foreground);
    gradient.addColorStop(1, darkenColor(theme.foreground, 10));
  }
  
  ctx.fillStyle = gradient;
  drawRoundedRect(x, y, width, height, radius);
  ctx.fill();
}

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

function drawStaticDigit(x, y, width, height, digit, theme) {
  const radius = Math.min(width, height) * 0.1;
  
  drawCardShadow(x, y, width, height, radius);
  drawGradientBackground(x, y, width, height, radius, theme, true);
  drawCardBorder(x, y, width, height, radius, theme);
  
  drawTopHalf(x, y, width, height, digit, theme);
  drawBottomHalf(x, y, width, height, digit, theme);
  drawMiddleAxis(x, y, width, height, theme);
}

function drawTopHalf(x, y, width, height, digit, theme) {
  const radius = Math.min(width, height) * 0.1;
  
  ctx.save();
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
  
  const highlightGradient = ctx.createLinearGradient(x, y, x, y + height / 4);
  highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
  highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = highlightGradient;
  ctx.fillRect(x, y, width, height / 4);
  
  ctx.fillStyle = theme.digit;
  ctx.font = `bold ${height * 0.8}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(digit, x + width / 2, y + height / 2);
  
  ctx.restore();
}

function drawBottomHalf(x, y, width, height, digit, theme) {
  const radius = Math.min(width, height) * 0.1;
  
  ctx.save();
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
  
  const shadowGradient = ctx.createLinearGradient(x, y + height / 2, x, y + height);
  shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
  ctx.fillStyle = shadowGradient;
  ctx.fillRect(x, y + height / 2, width, height / 2);
  
  ctx.fillStyle = theme.digit;
  ctx.font = `bold ${height * 0.8}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(digit, x + width / 2, y + height / 2);
  
  ctx.restore();
}

function drawMiddleAxis(x, y, width, height, theme) {
  const centerY = y + height / 2;
  
  ctx.save();
  
  const grooveGradient = ctx.createLinearGradient(x, centerY - 3, x, centerY + 3);
  grooveGradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
  grooveGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.1)');
  grooveGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
  
  ctx.fillStyle = grooveGradient;
  ctx.fillRect(x, centerY - 3, width, 6);
  
  const highlightGradient = ctx.createLinearGradient(x, centerY - 1, x, centerY + 1);
  highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
  highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
  highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
  
  ctx.fillStyle = highlightGradient;
  ctx.fillRect(x, centerY - 1, width, 2);
  
  ctx.restore();
}

// 翻页动画
function drawFlipAnimation(x, y, width, height, newValue, progress, oldValue, theme) {
  const radius = Math.min(width, height) * 0.1;
  
  drawCardShadow(x, y, width, height, radius);
  drawGradientBackground(x, y, width, height, radius, theme, true);
  drawCardBorder(x, y, width, height, radius, theme);
  
  if (progress === 0 || oldValue === null) {
    drawTopHalf(x, y, width, height, newValue, theme);
    drawBottomHalf(x, y, width, height, newValue, theme);
    drawMiddleAxis(x, y, width, height, theme);
    return;
  }
  
  drawTopHalf(x, y, width, height, newValue, theme);
  drawBottomHalf(x, y, width, height, oldValue, theme);
  
  if (progress < 0.5) {
    const normalizedProgress = progress * 2;
    drawFlippingTopOld(x, y, width, height, oldValue, normalizedProgress, theme);
  } else {
    const normalizedProgress = (progress - 0.5) * 2;
    drawFlippingBottomNew(x, y, width, height, newValue, normalizedProgress, theme);
  }
  
  drawMiddleAxis(x, y, width, height, theme);
}

function drawFlippingTopOld(x, y, width, height, digit, progress, theme) {
  const radius = Math.min(width, height) * 0.1;
  const angle = progress * Math.PI / 2;
  const cosAngle = Math.cos(angle);
  
  if (cosAngle <= 0) return;
  
  ctx.save();
  
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  
  const perspective = height * 2;
  const scale = perspective / (perspective + height * (1 - cosAngle) * 0.5);
  
  ctx.translate(centerX, centerY);
  ctx.scale(scale, cosAngle * scale);
  ctx.translate(-centerX, -centerY);
  
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
  
  drawGradientBackground(x, y, width, height / 2, radius, theme, true);
  
  const shadowIntensity = progress * 0.6;
  const shadowGradient = ctx.createLinearGradient(x, y, x, y + height / 2);
  shadowGradient.addColorStop(0, `rgba(0, 0, 0, ${shadowIntensity})`);
  shadowGradient.addColorStop(1, `rgba(0, 0, 0, ${shadowIntensity * 0.3})`);
  ctx.fillStyle = shadowGradient;
  ctx.fillRect(x, y, width, height / 2);
  
  const edgeHighlight = ctx.createLinearGradient(x, y + height / 2 - 5, x, y + height / 2);
  edgeHighlight.addColorStop(0, 'rgba(255, 255, 255, 0)');
  edgeHighlight.addColorStop(1, `rgba(255, 255, 255, ${0.3 * (1 - progress)})`);
  ctx.fillStyle = edgeHighlight;
  ctx.fillRect(x, y + height / 2 - 5, width, 5);
  
  ctx.fillStyle = theme.digit;
  ctx.font = `bold ${height * 0.8}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(digit, centerX, centerY);
  
  ctx.restore();
}

function drawFlippingBottomNew(x, y, width, height, digit, progress, theme) {
  const radius = Math.min(width, height) * 0.1;
  const angle = progress * Math.PI / 2;
  const cosAngle = Math.cos(angle);
  const scaleY = 1 - cosAngle;
  
  if (scaleY <= 0) return;
  
  ctx.save();
  
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  
  const perspective = height * 2;
  const scale = perspective / (perspective + height * cosAngle * 0.5);
  
  ctx.translate(centerX, centerY);
  ctx.scale(scale, scaleY * scale);
  ctx.translate(-centerX, -centerY);
  
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
  
  drawGradientBackground(x, y + height / 2, width, height / 2, radius, theme, false);
  
  const shadowIntensity = (1 - progress) * 0.5;
  const shadowGradient = ctx.createLinearGradient(x, y + height / 2, x, y + height);
  shadowGradient.addColorStop(0, `rgba(0, 0, 0, ${shadowIntensity})`);
  shadowGradient.addColorStop(1, `rgba(0, 0, 0, ${shadowIntensity + 0.2})`);
  ctx.fillStyle = shadowGradient;
  ctx.fillRect(x, y + height / 2, width, height / 2);
  
  const edgeHighlight = ctx.createLinearGradient(x, y + height / 2, x, y + height / 2 + 5);
  edgeHighlight.addColorStop(0, `rgba(255, 255, 255, ${0.3 * progress})`);
  edgeHighlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = edgeHighlight;
  ctx.fillRect(x, y + height / 2, width, 5);
  
  ctx.fillStyle = theme.digit;
  ctx.font = `bold ${height * 0.8}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(digit, centerX, centerY);
  
  ctx.restore();
}

// 滑动动画
function drawSlideAnimation(x, y, width, height, newValue, progress, oldValue, theme) {
  const radius = Math.min(width, height) * 0.1;
  
  drawCardShadow(x, y, width, height, radius);
  drawGradientBackground(x, y, width, height, radius, theme, true);
  drawCardBorder(x, y, width, height, radius, theme);
  
  if (progress === 0 || oldValue === null) {
    drawTopHalf(x, y, width, height, newValue, theme);
    drawBottomHalf(x, y, width, height, newValue, theme);
    drawMiddleAxis(x, y, width, height, theme);
    return;
  }
  
  ctx.save();
  ctx.beginPath();
  drawRoundedRect(x, y, width, height, radius);
  ctx.clip();
  
  const offsetY = progress * height;
  
  ctx.save();
  ctx.translate(0, offsetY);
  drawTopHalf(x, y, width, height, oldValue, theme);
  drawBottomHalf(x, y, width, height, oldValue, theme);
  ctx.restore();
  
  ctx.save();
  ctx.translate(0, offsetY - height);
  drawTopHalf(x, y, width, height, newValue, theme);
  drawBottomHalf(x, y, width, height, newValue, theme);
  ctx.restore();
  
  ctx.restore();
  drawMiddleAxis(x, y, width, height, theme);
}

// 淡入动画
function drawFadeAnimation(x, y, width, height, newValue, progress, oldValue, theme) {
  const radius = Math.min(width, height) * 0.1;
  
  drawCardShadow(x, y, width, height, radius);
  drawGradientBackground(x, y, width, height, radius, theme, true);
  drawCardBorder(x, y, width, height, radius, theme);
  
  if (progress === 0 || oldValue === null) {
    drawTopHalf(x, y, width, height, newValue, theme);
    drawBottomHalf(x, y, width, height, newValue, theme);
    drawMiddleAxis(x, y, width, height, theme);
    return;
  }
  
  ctx.save();
  ctx.beginPath();
  drawRoundedRect(x, y, width, height, radius);
  ctx.clip();
  
  ctx.globalAlpha = 1 - progress;
  drawTopHalf(x, y, width, height, oldValue, theme);
  drawBottomHalf(x, y, width, height, oldValue, theme);
  
  ctx.globalAlpha = progress;
  drawTopHalf(x, y, width, height, newValue, theme);
  drawBottomHalf(x, y, width, height, newValue, theme);
  
  ctx.restore();
  drawMiddleAxis(x, y, width, height, theme);
}

// 缩放动画
function drawZoomAnimation(x, y, width, height, newValue, progress, oldValue, theme) {
  const radius = Math.min(width, height) * 0.1;
  
  drawCardShadow(x, y, width, height, radius);
  drawGradientBackground(x, y, width, height, radius, theme, true);
  drawCardBorder(x, y, width, height, radius, theme);
  
  if (progress === 0 || oldValue === null) {
    drawTopHalf(x, y, width, height, newValue, theme);
    drawBottomHalf(x, y, width, height, newValue, theme);
    drawMiddleAxis(x, y, width, height, theme);
    return;
  }
  
  ctx.save();
  ctx.beginPath();
  drawRoundedRect(x, y, width, height, radius);
  ctx.clip();
  
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  
  const oldScale = 1 - progress * 0.5;
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(oldScale, oldScale);
  ctx.translate(-centerX, -centerY);
  ctx.globalAlpha = 1 - progress;
  drawTopHalf(x, y, width, height, oldValue, theme);
  drawBottomHalf(x, y, width, height, oldValue, theme);
  ctx.restore();
  
  const newScale = 0.5 + progress * 0.5;
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(newScale, newScale);
  ctx.translate(-centerX, -centerY);
  ctx.globalAlpha = progress;
  drawTopHalf(x, y, width, height, newValue, theme);
  drawBottomHalf(x, y, width, height, newValue, theme);
  ctx.restore();
  
  ctx.restore();
  drawMiddleAxis(x, y, width, height, theme);
}

// 旋转动画
function drawRotateAnimation(x, y, width, height, newValue, progress, oldValue, theme) {
  const radius = Math.min(width, height) * 0.1;
  
  drawCardShadow(x, y, width, height, radius);
  drawGradientBackground(x, y, width, height, radius, theme, true);
  drawCardBorder(x, y, width, height, radius, theme);
  
  if (progress === 0 || oldValue === null) {
    drawTopHalf(x, y, width, height, newValue, theme);
    drawBottomHalf(x, y, width, height, newValue, theme);
    drawMiddleAxis(x, y, width, height, theme);
    return;
  }
  
  ctx.save();
  ctx.beginPath();
  drawRoundedRect(x, y, width, height, radius);
  ctx.clip();
  
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  
  if (progress < 0.5) {
    const angle = progress * Math.PI;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.scale(1, Math.cos(angle));
    ctx.translate(-centerX, -centerY);
    drawTopHalf(x, y, width, height, oldValue, theme);
    drawBottomHalf(x, y, width, height, oldValue, theme);
    ctx.restore();
  } else {
    const angle = (progress - 0.5) * Math.PI;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle - Math.PI);
    ctx.scale(1, -Math.cos(angle));
    ctx.translate(-centerX, -centerY);
    drawTopHalf(x, y, width, height, newValue, theme);
    drawBottomHalf(x, y, width, height, newValue, theme);
    ctx.restore();
  }
  
  ctx.restore();
  drawMiddleAxis(x, y, width, height, theme);
}

function drawDigit(x, y, width, height, digitKey) {
  const theme = getCurrentTheme();
  const animation = animationModule.getCurrentAnimation();
  const animInfo = animatingDigits[digitKey];
  
  if (animInfo) {
    const progress = Math.min(1, (Date.now() - animInfo.startTime) / animInfo.duration);
    animation.draw(x, y, width, height, animInfo.newValue, progress, animInfo.oldValue, theme);
    if (progress >= 1) {
      delete animatingDigits[digitKey];
    }
  } else {
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
    drawStaticDigit(x, y, width, height, digit, theme);
  }
}

function drawSeparator(x, y, size) {
  const theme = getCurrentTheme();
  const dotRadius = size / 4;
  const dotSpacing = size / 2.5;
  
  drawSeparatorDot(x, y - dotSpacing, dotRadius, theme);
  drawSeparatorDot(x, y + dotSpacing, dotRadius, theme);
}

function drawSeparatorDot(x, y, radius, theme) {
  ctx.save();
  
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = radius * 0.3;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = radius * 0.15;
  
  const gradient = ctx.createLinearGradient(x, y - radius, x, y + radius);
  gradient.addColorStop(0, lightenColor(theme.separator, 15));
  gradient.addColorStop(0.5, theme.separator);
  gradient.addColorStop(1, darkenColor(theme.separator, 10));
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.shadowColor = 'transparent';
  const highlightGradient = ctx.createLinearGradient(x, y - radius, x, y);
  highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
  highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = highlightGradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = radius * 0.08;
  ctx.beginPath();
  ctx.arc(x, y, radius - radius * 0.08, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.lineWidth = radius * 0.08;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.restore();
}

function render() {
  const theme = getCurrentTheme();
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);
  
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, width, height);
  
  const clockWidth = Math.min(width * 0.9, height * 0.6);
  const digitHeight = clockWidth * 0.3;
  const digitWidth = digitHeight * 0.6;
  const separatorSize = digitHeight * 0.3;
  const cardGap = 1;
  
  const totalWidth = digitWidth * 6 + separatorSize * 2 + cardGap * 4;
  const startX = (width - totalWidth) / 2;
  const startY = (height - digitHeight) / 2;
  
  drawDigit(startX, startY, digitWidth, digitHeight, 'hour1');
  drawDigit(startX + digitWidth + cardGap, startY, digitWidth, digitHeight, 'hour2');
  
  drawSeparator(startX + digitWidth * 2 + cardGap + separatorSize / 2, startY + digitHeight / 2, separatorSize);
  
  drawDigit(startX + digitWidth * 2 + cardGap + separatorSize, startY, digitWidth, digitHeight, 'minute1');
  drawDigit(startX + digitWidth * 3 + cardGap * 2 + separatorSize, startY, digitWidth, digitHeight, 'minute2');
  
  drawSeparator(startX + digitWidth * 4 + cardGap * 2 + separatorSize * 1.5, startY + digitHeight / 2, separatorSize);
  
  drawDigit(startX + digitWidth * 4 + cardGap * 2 + separatorSize * 2, startY, digitWidth, digitHeight, 'second1');
  drawDigit(startX + digitWidth * 5 + cardGap * 3 + separatorSize * 2, startY, digitWidth, digitHeight, 'second2');
  
  requestAnimationFrame(render);
}

init();
