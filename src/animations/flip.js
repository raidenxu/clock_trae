import { drawCardShadow, drawCardBorder, drawTopHalf, drawBottomHalf, drawMiddleAxis, drawGradientBackground } from '../modules/renderer.js';
import { lightenColor, darkenColor } from '../config/themes.js';

export const flipAnimation = {
  name: '翻页',
  duration: 300,
  draw: function(ctx, x, y, width, height, newValue, progress, oldValue, theme) {
    const radius = Math.min(width, height) * 0.1;
    
    drawCardShadow(ctx, x, y, width, height, radius);
    drawGradientBackground(ctx, x, y, width, height, radius, theme, true);
    drawCardBorder(ctx, x, y, width, height, radius, theme);
    
    if (progress === 0 || oldValue === null) {
      drawTopHalf(ctx, x, y, width, height, newValue, theme);
      drawBottomHalf(ctx, x, y, width, height, newValue, theme);
      drawMiddleAxis(ctx, x, y, width, height, theme);
      return;
    }
    
    drawTopHalf(ctx, x, y, width, height, newValue, theme);
    drawBottomHalf(ctx, x, y, width, height, oldValue, theme);
    
    if (progress < 0.5) {
      const normalizedProgress = progress * 2;
      drawFlippingTopOld(ctx, x, y, width, height, oldValue, normalizedProgress, theme);
    } else {
      const normalizedProgress = (progress - 0.5) * 2;
      drawFlippingBottomNew(ctx, x, y, width, height, newValue, normalizedProgress, theme);
    }
    
    drawMiddleAxis(ctx, x, y, width, height, theme);
  }
};

function drawFlippingTopOld(ctx, x, y, width, height, digit, progress, theme) {
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
  
  const gradient = ctx.createLinearGradient(x, y, x, y + height / 2);
  gradient.addColorStop(0, lightenColor(theme.foreground, 10));
  gradient.addColorStop(1, theme.foreground);
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height / 2);
  
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

function drawFlippingBottomNew(ctx, x, y, width, height, digit, progress, theme) {
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
  
  const gradient = ctx.createLinearGradient(x, y + height / 2, x, y + height);
  gradient.addColorStop(0, theme.foreground);
  gradient.addColorStop(1, darkenColor(theme.foreground, 10));
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y + height / 2, width, height / 2);
  
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
