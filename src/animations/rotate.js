import { drawCardShadow, drawCardBorder, drawTopHalf, drawBottomHalf, drawMiddleAxis, drawGradientBackground, drawRoundedRect } from '../modules/renderer.js';

export const rotateAnimation = {
  name: '旋转',
  duration: 350,
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
    
    if (progress < 0.5) {
      const angle = progress * Math.PI;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.scale(1, Math.cos(angle));
      ctx.translate(-centerX, -centerY);
      drawTopHalf(ctx, x, y, width, height, oldValue, theme);
      drawBottomHalf(ctx, x, y, width, height, oldValue, theme);
      ctx.restore();
    } else {
      const angle = (progress - 0.5) * Math.PI;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle - Math.PI);
      ctx.scale(1, -Math.cos(angle));
      ctx.translate(-centerX, -centerY);
      drawTopHalf(ctx, x, y, width, height, newValue, theme);
      drawBottomHalf(ctx, x, y, width, height, newValue, theme);
      ctx.restore();
    }
    
    ctx.restore();
    drawMiddleAxis(ctx, x, y, width, height, theme);
  }
};
