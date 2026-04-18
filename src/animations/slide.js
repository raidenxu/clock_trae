import { drawCardShadow, drawCardBorder, drawTopHalf, drawBottomHalf, drawMiddleAxis, drawGradientBackground, drawRoundedRect } from '../modules/renderer.js';

export const slideAnimation = {
  name: '滑动',
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
    
    const offsetY = progress * height;
    
    ctx.save();
    ctx.translate(0, offsetY);
    drawTopHalf(ctx, x, y, width, height, oldValue, theme);
    drawBottomHalf(ctx, x, y, width, height, oldValue, theme);
    ctx.restore();
    
    ctx.save();
    ctx.translate(0, offsetY - height);
    drawTopHalf(ctx, x, y, width, height, newValue, theme);
    drawBottomHalf(ctx, x, y, width, height, newValue, theme);
    ctx.restore();
    
    ctx.restore();
    drawMiddleAxis(ctx, x, y, width, height, theme);
  }
};
