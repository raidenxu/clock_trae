let currentAnimation = 'flip';
const animations = {};

export function registerAnimation(name, config) {
  animations[name] = {
    name: config.name || name,
    duration: config.duration || 300,
    draw: config.draw
  };
}

export function setAnimation(animationName) {
  if (animations[animationName]) {
    currentAnimation = animationName;
    return true;
  }
  return false;
}

export function getCurrentAnimation() {
  return animations[currentAnimation];
}

export function getAnimation(name) {
  return animations[name];
}

export function getAllAnimations() {
  return Object.keys(animations);
}

export function getCurrentAnimationName() {
  return currentAnimation;
}
