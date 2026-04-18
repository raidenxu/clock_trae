import { drawCardShadow, drawCardBorder, drawTopHalf, drawBottomHalf, drawMiddleAxis, drawGradientBackground, drawRoundedRect } from '../modules/renderer.js';

export const fadeAnimation = {
  name: '淡入',
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
    
    ctx.save();
    ctx.beginPath();
    drawRoundedRect(ctx, x, y, width, height, radius);
    ctx.clip();
    
    ctx.globalAlpha = 1 - progress;
    drawTopHalf(ctx, x, y, width, height, oldValue, theme);
    drawBottomHalf(ctx, x, y, width, height, oldValue, theme);
    
    ctx.globalAlpha = progress;
    drawTopHalf(ctx, x, y, width, height, newValue, theme);
    drawBottomHalf(ctx, x, y, width, height, newValue, theme);
    
    ctx.restore();
    drawMiddleAxis(ctx, x, y, width, height, theme);
  }
};
