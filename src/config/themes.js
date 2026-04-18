export const themes = {
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

export function lightenColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

export function darkenColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

let currentTheme = 'classic';
let customTheme = { ...themes.classic };

export function setTheme(themeName) {
  currentTheme = themeName;
}

export function setCustomTheme(theme) {
  customTheme = { ...theme };
}

export function getCurrentTheme() {
  return currentTheme === 'custom' ? customTheme : themes[currentTheme];
}

export function getCurrentThemeName() {
  return currentTheme;
}

export function getCustomTheme() {
  return customTheme;
}
