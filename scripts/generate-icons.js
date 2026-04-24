import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [32, 128, 256];

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  const padding = size * 0.1;
  const innerSize = size - padding * 2;
  const radius = innerSize * 0.15;
  
  ctx.fillStyle = '#1a1a1a';
  roundRect(ctx, padding, padding, innerSize, innerSize, radius);
  ctx.fill();
  
  const digitWidth = innerSize * 0.4;
  const digitHeight = innerSize * 0.8;
  const gap = innerSize * 0.05;
  const totalWidth = digitWidth * 2 + gap;
  const startX = padding + (innerSize - totalWidth) / 2;
  const startY = padding + (innerSize - digitHeight) / 2;
  
  drawDigit(ctx, startX, startY, digitWidth, digitHeight, '1');
  drawDigit(ctx, startX + digitWidth + gap, startY, digitWidth, digitHeight, '2');
  
  const filename = size === 256 ? '128x128@2x.png' : `${size}x${size}.png`;
  const buffer = canvas.toBuffer('image/png');
  writeFileSync(join(__dirname, '..', 'src-tauri', 'icons', filename), buffer);
  console.log(`Generated: ${filename} (${size}x${size})`);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawDigit(ctx, x, y, width, height, digit) {
  const radius = width * 0.12;
  const lineWidth = height * 0.08;
  
  ctx.fillStyle = '#333333';
  roundRect(ctx, x, y, width, height, radius);
  ctx.fill();
  
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  const cx = x + width / 2;
  const cy = y + height / 2;
  const segmentWidth = width * 0.65;
  const segmentHeight = height * 0.22;
  const gap = height * 0.04;
  
  const topY = cy - segmentHeight - gap;
  const middleY = cy;
  const bottomY = cy + segmentHeight + gap;
  
  const segments = {
    top: digit !== '1' && digit !== '4',
    topRight: digit !== '5' && digit !== '6',
    bottomRight: digit !== '2',
    bottom: digit !== '1' && digit !== '4' && digit !== '7',
    bottomLeft: digit === '2' || digit === '6' || digit === '8' || digit === '0',
    topLeft: digit !== '1' && digit !== '2' && digit !== '3' && digit !== '7',
    middle: digit !== '1' && digit !== '7' && digit !== '0'
  };
  
  if (segments.top) drawHorizontalSegment(ctx, cx, topY, segmentWidth, segmentHeight);
  if (segments.middle) drawHorizontalSegment(ctx, cx, middleY, segmentWidth, segmentHeight);
  if (segments.bottom) drawHorizontalSegment(ctx, cx, bottomY, segmentWidth, segmentHeight);
  
  const verticalTopY = cy - segmentHeight / 2 - gap / 2;
  const verticalBottomY = cy + segmentHeight / 2 + gap / 2;
  const verticalHeight = segmentHeight + gap;
  const leftX = cx - segmentWidth / 2;
  const rightX = cx + segmentWidth / 2;
  
  if (segments.topLeft) drawVerticalSegment(ctx, leftX, verticalTopY, lineWidth, verticalHeight);
  if (segments.bottomLeft) drawVerticalSegment(ctx, leftX, verticalBottomY, lineWidth, verticalHeight);
  if (segments.topRight) drawVerticalSegment(ctx, rightX, verticalTopY, lineWidth, verticalHeight);
  if (segments.bottomRight) drawVerticalSegment(ctx, rightX, verticalBottomY, lineWidth, verticalHeight);
}

function drawHorizontalSegment(ctx, cx, cy, width, height) {
  ctx.beginPath();
  ctx.moveTo(cx - width / 2, cy);
  ctx.lineTo(cx - width / 2 + height / 2, cy - height / 2);
  ctx.lineTo(cx + width / 2 - height / 2, cy - height / 2);
  ctx.lineTo(cx + width / 2, cy);
  ctx.lineTo(cx + width / 2 - height / 2, cy + height / 2);
  ctx.lineTo(cx - width / 2 + height / 2, cy + height / 2);
  ctx.closePath();
  ctx.fill();
}

function drawVerticalSegment(ctx, cx, cy, width, height) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - height / 2);
  ctx.lineTo(cx + width / 2, cy - height / 2 + width / 2);
  ctx.lineTo(cx + width / 2, cy + height / 2 - width / 2);
  ctx.lineTo(cx, cy + height / 2);
  ctx.lineTo(cx - width / 2, cy + height / 2 - width / 2);
  ctx.lineTo(cx - width / 2, cy - height / 2 + width / 2);
  ctx.closePath();
  ctx.fill();
}

sizes.forEach(size => generateIcon(size));
console.log('\nPNG icons generated successfully!');
console.log('\nNote: For production, you may also need:');
console.log('- icon.icns (macOS) - can be generated from PNG using iconutil or online tools');
console.log('- icon.ico (Windows) - can be generated from PNG using online converters');
