import { Injectable, signal } from '@angular/core';

export type ThemeColor = 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'teal';

export interface ThemeConfig {
  name: string;
  primary: string;
  secondary: string;
  gradient: string;
  light: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme-color';
  
  // Available themes
  readonly themes: Record<ThemeColor, ThemeConfig> = {
    purple: {
      name: 'Purple',
      primary: '#667eea',
      secondary: '#764ba2',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      light: '#f0f7ff',
      icon: 'palette'
    },
    blue: {
      name: 'Blue',
      primary: '#2196F3',
      secondary: '#1976D2',
      gradient: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
      light: '#E3F2FD',
      icon: 'water'
    },
    green: {
      name: 'Green',
      primary: '#4CAF50',
      secondary: '#388E3C',
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
      light: '#E8F5E9',
      icon: 'eco'
    },
    orange: {
      name: 'Orange',
      primary: '#FF9800',
      secondary: '#F57C00',
      gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
      light: '#FFF3E0',
      icon: 'brightness_high'
    },
    red: {
      name: 'Red',
      primary: '#F44336',
      secondary: '#D32F2F',
      gradient: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
      light: '#FFEBEE',
      icon: 'favorite'
    },
    teal: {
      name: 'Teal',
      primary: '#009688',
      secondary: '#00796B',
      gradient: 'linear-gradient(135deg, #009688 0%, #00796B 100%)',
      light: '#E0F2F1',
      icon: 'opacity'
    }
  };

  // Signal for current theme
  private themeSignal = signal<ThemeColor>(this.getInitialTheme());
  readonly theme = this.themeSignal.asReadonly();
  readonly currentTheme = this.themes[this.themeSignal()];

  constructor() {
    this.applyTheme(this.themeSignal());
  }

  private getInitialTheme(): ThemeColor {
    const stored = localStorage.getItem(this.THEME_KEY) as ThemeColor | null;
    if (stored && this.themes[stored]) {
      return stored;
    }
    return 'purple'; // Default theme
  }

  setTheme(theme: ThemeColor): void {
    if (this.themeSignal() === theme) return;
    
    this.themeSignal.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }

  toggleNextTheme(): void {
    const themes = Object.keys(this.themes) as ThemeColor[];
    const currentIndex = themes.indexOf(this.themeSignal());
    const nextIndex = (currentIndex + 1) % themes.length;
    this.setTheme(themes[nextIndex]);
  }

  private applyTheme(theme: ThemeColor): void {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const config = this.themes[theme];
      
      // Set CSS custom properties
      root.style.setProperty('--theme-primary', config.primary);
      root.style.setProperty('--theme-secondary', config.secondary);
      root.style.setProperty('--theme-gradient', config.gradient);
      root.style.setProperty('--theme-light', config.light);
      
      // Set theme class
      root.setAttribute('data-theme-color', theme);
    }
  }
}
