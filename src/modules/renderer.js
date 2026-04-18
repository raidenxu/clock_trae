import { lightenColor, darkenColor, getCurrentTheme } from '../config/themes.js';

export function drawRoundedRect(ctx, x, y, width, height, radius) {
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

export function drawCardShadow(ctx, x, y, width, height, radius, intensity = 1) {
  ctx.save();
  
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 15 * intensity;
  ctx.shadowOffsetX = 5 * intensity;
  ctx.shadowOffsetY = 8 * intensity;
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  drawRoundedRect(ctx, x, y, width, height, radius);
  ctx.fill();
  
  ctx.restore();
}

export function drawCardBorder(ctx, x, y, width, height, radius, theme) {
  ctx.save();
  
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, x, y, width, height, radius);
  ctx.stroke();
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, x + 1, y + 1, width - 2, height - 2, radius - 1);
  ctx.stroke();
  
  ctx.restore();
}

export function drawGradientBackground(ctx, x, y, width, height, radius, theme, isTop = true) {
  const gradient = ctx.createLinearGradient(x, y, x, y + height);
  
  if (isTop) {
    gradient.addColorStop(0, lightenColor(theme.foreground, 10));
    gradient.addColorStop(1, theme.foreground);
  } else {
    gradient.addColorStop(0, theme.foreground);
    gradient.addColorStop(1, darkenColor(theme.foreground, 10));
  }
  
  ctx.fillStyle = gradient;
  drawRoundedRect(ctx, x, y, width, height, radius);
  ctx.fill();
}

export function drawTopHalf(ctx, x, y, width, height, digit, theme) {
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

export function drawBottomHalf(ctx, x, y, width, height, digit, theme) {
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

export function drawMiddleAxis(ctx, x, y, width, height, theme) {
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

export function drawStaticDigit(ctx, x, y, width, height, digit, theme) {
  const radius = Math.min(width, height) * 0.1;
  
  drawCardShadow(ctx, x, y, width, height, radius);
  drawGradientBackground(ctx, x, y, width, height, radius, theme, true);
  drawCardBorder(ctx, x, y, width, height, radius, theme);
  
  drawTopHalf(ctx, x, y, width, height, digit, theme);
  drawBottomHalf(ctx, x, y, width, height, digit, theme);
  drawMiddleAxis(ctx, x, y, width, height, theme);
}

export function drawSeparator(ctx, x, y, size) {
  const theme = getCurrentTheme();
  const dotRadius = size / 4;
  const dotSpacing = size / 2.5;
  
  drawSeparatorDot(ctx, x, y - dotSpacing, dotRadius, theme);
  drawSeparatorDot(ctx, x, y + dotSpacing, dotRadius, theme);
}

function drawSeparatorDot(ctx, x, y, radius, theme) {
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
