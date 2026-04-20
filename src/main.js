import { themes, setTheme, setCustomTheme, getCurrentTheme, getCurrentThemeName, getCustomTheme } from './config/themes.js';
import { drawStaticDigit, drawSeparator, drawRoundedRect } from './modules/renderer.js';
import { registerAnimation, setAnimation, getCurrentAnimation, getCurrentAnimationName } from './modules/animation.js';

import { flipAnimation } from './animations/flip.js';
import { slideAnimation } from './animations/slide.js';
import { fadeAnimation } from './animations/fade.js';
import { zoomAnimation } from './animations/zoom.js';
import { rotateAnimation } from './animations/rotate.js';

registerAnimation('flip', flipAnimation);
registerAnimation('slide', slideAnimation);
registerAnimation('fade', fadeAnimation);
registerAnimation('zoom', zoomAnimation);
registerAnimation('rotate', rotateAnimation);

const canvas = document.getElementById('clockCanvas');
const ctx = canvas.getContext('2d');
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const customColors = document.getElementById('customColors');
const foregroundColorInput = document.getElementById('foregroundColor');
const backgroundColorInput = document.getElementById('backgroundColor');
const digitColorInput = document.getElementById('digitColor');
const separatorColorInput = document.getElementById('separatorColor');

let animatingDigits = {};
let currentDisplayTime = getCurrentTime();
let settingsBtnTimeout = null;
const SETTINGS_BTN_TIMEOUT = 3000;

function init() {
  resizeCanvas();
  setupEventListeners();
  setupAutoHideSettingsBtn();
  updateTime();
  requestAnimationFrame(render);
}

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

function setupEventListeners() {
  window.addEventListener('resize', resizeCanvas);
  
  settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSettingsPanel();
  });
  
  document.addEventListener('click', (e) => {
    if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
      closeSettingsPanel();
    }
  });
  
  document.querySelectorAll('.theme-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const themeName = btn.dataset.theme;
      handleThemeChange(themeName);
    });
  });
  
  document.querySelectorAll('.animation-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const animationName = btn.dataset.animation;
      handleAnimationChange(animationName);
    });
  });
  
  foregroundColorInput.addEventListener('input', (e) => {
    handleCustomColorChange('foreground', e.target.value);
  });
  
  backgroundColorInput.addEventListener('input', (e) => {
    handleCustomColorChange('background', e.target.value);
  });
  
  digitColorInput.addEventListener('input', (e) => {
    handleCustomColorChange('digit', e.target.value);
  });
  
  separatorColorInput.addEventListener('input', (e) => {
    handleCustomColorChange('separator', e.target.value);
  });
}

function handleThemeChange(themeName) {
  if (themeName === 'custom') {
    customColors.style.display = 'block';
    updateColorInputs();
  } else {
    customColors.style.display = 'none';
    if (themes[themeName]) {
      setCustomTheme({ ...themes[themeName] });
    }
  }
  setTheme(themeName);
  updateThemeUI(themeName);
}

function handleAnimationChange(animationName) {
  setAnimation(animationName);
  updateAnimationUI(animationName);
}

function handleCustomColorChange(colorType, value) {
  const customTheme = getCustomTheme();
  customTheme[colorType] = value;
  setCustomTheme(customTheme);
  setTheme('custom');
  updateThemeUI('custom');
}

function toggleSettingsPanel() {
  settingsBtn.classList.toggle('active');
  settingsPanel.classList.toggle('open');
  
  if (settingsPanel.classList.contains('open')) {
    showSettingsBtn();
    if (settingsBtnTimeout) {
      clearTimeout(settingsBtnTimeout);
    }
  } else {
    showSettingsBtn();
  }
}

function setupAutoHideSettingsBtn() {
  hideSettingsBtn();
  
  const showEvents = ['mousemove', 'click', 'touchstart'];
  
  showEvents.forEach(eventType => {
    document.addEventListener(eventType, showSettingsBtn);
  });
}

function showSettingsBtn() {
  settingsBtn.style.opacity = '1';
  settingsBtn.style.pointerEvents = 'auto';
  
  if (settingsBtnTimeout) {
    clearTimeout(settingsBtnTimeout);
  }
  
  if (!settingsPanel.classList.contains('open')) {
    settingsBtnTimeout = setTimeout(hideSettingsBtn, SETTINGS_BTN_TIMEOUT);
  }
}

function hideSettingsBtn() {
  if (settingsPanel.classList.contains('open')) {
    return;
  }
  
  settingsBtn.style.opacity = '0';
  settingsBtn.style.pointerEvents = 'none';
}

function closeSettingsPanel() {
  settingsBtn.classList.remove('active');
  settingsPanel.classList.remove('open');
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
  const theme = getCurrentThemeName() === 'custom' ? getCustomTheme() : themes[getCurrentThemeName()];
  foregroundColorInput.value = theme.foreground;
  backgroundColorInput.value = theme.background;
  digitColorInput.value = theme.digit;
  separatorColorInput.value = theme.separator;
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
  const animation = getCurrentAnimation();
  
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
  const animation = getCurrentAnimation();
  animatingDigits[digitKey] = {
    oldValue,
    newValue,
    startTime: Date.now(),
    duration: animation.duration
  };
}

function drawDigit(x, y, width, height, digitKey) {
  const theme = getCurrentTheme();
  const animation = getCurrentAnimation();
  const animInfo = animatingDigits[digitKey];
  
  if (animInfo) {
    const progress = Math.min(1, (Date.now() - animInfo.startTime) / animInfo.duration);
    animation.draw(ctx, x, y, width, height, animInfo.newValue, progress, animInfo.oldValue, theme);
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
    drawStaticDigit(ctx, x, y, width, height, digit, theme);
  }
}

function drawRowSeparator(ctx, x, y, width, height, theme) {
  ctx.save();
  
  const gradient = ctx.createLinearGradient(x, y - height / 2, x, y + height / 2);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.3, theme.separator);
  gradient.addColorStop(0.5, theme.separator);
  gradient.addColorStop(0.7, theme.separator);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y - height / 2, width, height);
  
  ctx.restore();
}

function render() {
  const theme = getCurrentTheme();
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);
  
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, width, height);
  
  const isLandscape = width > height;
  let digitHeight, digitWidth, separatorSize;
  
  const singleDigitAspectRatio = 0.6;
  const cardGap = 2;
  
  if (isLandscape) {
    const maxWidthForHeight = (height * 0.9) * ((6 * singleDigitAspectRatio) + 0.3 * 2) / 1;
    if (maxWidthForHeight <= width * 0.9) {
      digitHeight = height * 0.9;
    } else {
      const totalWidthRatio = 6 * singleDigitAspectRatio + 0.3 * 2 + cardGap * 4 / 100;
      const maxDigitHeightByWidth = (width * 0.9) / totalWidthRatio;
      digitHeight = Math.min(height * 0.9, maxDigitHeightByWidth);
    }
    
    digitWidth = digitHeight * singleDigitAspectRatio;
    separatorSize = digitHeight * 0.3;
    
    const totalWidth = digitWidth * 6 + separatorSize * 2 + cardGap * 4;
    const totalHeight = digitHeight;
    
    const startX = (width - totalWidth) / 2;
    const startY = (height - totalHeight) / 2;
    
    drawDigit(startX, startY, digitWidth, digitHeight, 'hour1');
    drawDigit(startX + digitWidth + cardGap, startY, digitWidth, digitHeight, 'hour2');
    
    drawSeparator(ctx, startX + digitWidth * 2 + cardGap + separatorSize / 2, startY + digitHeight / 2, separatorSize);
    
    drawDigit(startX + digitWidth * 2 + cardGap + separatorSize, startY, digitWidth, digitHeight, 'minute1');
    drawDigit(startX + digitWidth * 3 + cardGap * 2 + separatorSize, startY, digitWidth, digitHeight, 'minute2');
    
    drawSeparator(ctx, startX + digitWidth * 4 + cardGap * 2 + separatorSize * 1.5, startY + digitHeight / 2, separatorSize);
    
    drawDigit(startX + digitWidth * 4 + cardGap * 2 + separatorSize * 2, startY, digitWidth, digitHeight, 'second1');
    drawDigit(startX + digitWidth * 5 + cardGap * 3 + separatorSize * 2, startY, digitWidth, digitHeight, 'second2');
  } else {
    const singleRowHeightRatio = 3;
    const separatorRatio = 0.15;
    const marginRatio = 1.4;
    
    const totalRowsRatio = singleRowHeightRatio * 3 + separatorRatio * 2 + marginRatio * 2;
    
    const maxDigitHeightByHeight = (height * 0.98) / totalRowsRatio * singleRowHeightRatio;
    
    const twoDigitWidthRatio = 2 * singleDigitAspectRatio + 0.3;
    const maxDigitHeightByWidth = (width * 0.95) / twoDigitWidthRatio;
    
    digitHeight = Math.min(maxDigitHeightByHeight, maxDigitHeightByWidth);
    digitWidth = digitHeight * singleDigitAspectRatio;
    separatorSize = digitHeight * 0.3;
    
    const singleRowHeight = digitHeight;
    const rowSeparatorHeight = digitHeight * separatorRatio;
    const marginHeight = digitHeight * marginRatio;
    
    const totalContentHeight = singleRowHeight * 3 + rowSeparatorHeight * 2 + marginHeight * 2;
    const startY = (height - totalContentHeight) / 2 + marginHeight;
    
    const hourStartY = startY;
    const minuteStartY = startY + singleRowHeight + rowSeparatorHeight;
    const secondStartY = startY + (singleRowHeight + rowSeparatorHeight) * 2;
    
    const twoDigitTotalWidth = digitWidth * 2 + separatorSize;
    const hourStartX = (width - twoDigitTotalWidth) / 2;
    const minuteStartX = hourStartX;
    const secondStartX = hourStartX;
    
    const separatorLineWidth = Math.min(width * 0.4, twoDigitTotalWidth * 1.2);
    const separatorLineX = (width - separatorLineWidth) / 2;
    
    drawDigit(hourStartX, hourStartY, digitWidth, digitHeight, 'hour1');
    drawDigit(hourStartX + digitWidth + cardGap, hourStartY, digitWidth, digitHeight, 'hour2');
    
    drawRowSeparator(ctx, separatorLineX, hourStartY + singleRowHeight + rowSeparatorHeight / 2, separatorLineWidth, rowSeparatorHeight, theme);
    
    drawDigit(minuteStartX, minuteStartY, digitWidth, digitHeight, 'minute1');
    drawDigit(minuteStartX + digitWidth + cardGap, minuteStartY, digitWidth, digitHeight, 'minute2');
    
    drawRowSeparator(ctx, separatorLineX, minuteStartY + singleRowHeight + rowSeparatorHeight / 2, separatorLineWidth, rowSeparatorHeight, theme);
    
    drawDigit(secondStartX, secondStartY, digitWidth, digitHeight, 'second1');
    drawDigit(secondStartX + digitWidth + cardGap, secondStartY, digitWidth, digitHeight, 'second2');
  }
  
  requestAnimationFrame(render);
}

init();
