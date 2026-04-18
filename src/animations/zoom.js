import { drawCardShadow, drawCardBorder, drawTopHalf, drawBottomHalf, drawMiddleAxis, drawGradientBackground, drawRoundedRect } from '../modules/renderer.js';

export const zoomAnimation = {
  name: '缩放',
  duration: 250,
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
    
    ctx.save();
    ctx.beginPath();
    drawRoundedRect(ctx, x, y, width, height, radius);
    ctx.clip();
    
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    
    const oldScale = 1 - progress * 0.5;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(oldScale, oldScale);
    ctx.translate(-centerX, -centerY);
    ctx.globalAlpha = 1 - progress;
    drawTopHalf(ctx, x, y, width, height, oldValue, theme);
    drawBottomHalf(ctx, x, y, width, height, oldValue, theme);
    ctx.restore();
    
    const newScale = 0.5 + progress * 0.5;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(newScale, newScale);
    ctx.translate(-centerX, -centerY);
    ctx.globalAlpha = progress;
    drawTopHalf(ctx, x, y, width, height, newValue, theme);
    drawBottomHalf(ctx, x, y, width, height, newValue, theme);
    ctx.restore();
    
    ctx.restore();
    drawMiddleAxis(ctx, x, y, width, height, theme);
  }
};
