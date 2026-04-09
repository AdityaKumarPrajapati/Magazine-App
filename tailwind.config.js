/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]', '.dark'],
  theme: {
    extend: {
      colors: {
        // Design System - Backgrounds
        'ds-bg': {
          app: 'var(--ds-bg-app)',
          panel: 'var(--ds-bg-panel)',
          elevated: 'var(--ds-bg-elevated)',
          canvas: 'var(--ds-bg-canvas)',
          input: 'var(--ds-bg-input)',
          hover: 'var(--ds-bg-hover)',
        },
        // Design System - Borders
        'ds-border': {
          subtle: 'var(--ds-border-subtle)',
          default: 'var(--ds-border-default)',
          strong: 'var(--ds-border-strong)',
          focus: 'var(--ds-border-focus)',
        },
        // Design System - Text
        'ds-text': {
          primary: 'var(--ds-text-primary)',
          secondary: 'var(--ds-text-secondary)',
          tertiary: 'var(--ds-text-tertiary)',
          disabled: 'var(--ds-text-disabled)',
          inverse: 'var(--ds-text-inverse)',
          'on-accent': 'var(--ds-text-on-accent)',
        },
        // Design System - Accent (Blue)
        'ds-accent': {
          DEFAULT: 'var(--ds-accent)',
          hover: 'var(--ds-accent-hover)',
          active: 'var(--ds-accent-active)',
          subtle: 'var(--ds-accent-subtle)',
          muted: 'var(--ds-accent-muted)',
        },
        // Design System - Semantic Colors
        'ds-success': {
          DEFAULT: 'var(--ds-success)',
          subtle: 'var(--ds-success-subtle)',
        },
        'ds-warning': {
          DEFAULT: 'var(--ds-warning)',
          subtle: 'var(--ds-warning-subtle)',
        },
        'ds-error': {
          DEFAULT: 'var(--ds-error)',
          subtle: 'var(--ds-error-subtle)',
        },
        'ds-info': {
          DEFAULT: 'var(--ds-info)',
          subtle: 'var(--ds-info-subtle)',
        },
      },
      spacing: {
        // Design System - Radius values for padding consistency
      },
      borderRadius: {
        'ds-sm': 'var(--ds-radius-sm)',
        'ds-md': 'var(--ds-radius-md)',
        'ds-lg': 'var(--ds-radius-lg)',
        'ds-xl': 'var(--ds-radius-xl)',
      },
      boxShadow: {
        'ds-sm': 'var(--ds-shadow-sm)',
        'ds-md': 'var(--ds-shadow-md)',
        'ds-lg': 'var(--ds-shadow-lg)',
      },
      fontFamily: {
        'ds-sans': 'var(--ds-font-sans)',
        'ds-mono': 'var(--ds-font-mono)',
      },
    },
  },
  plugins: [],
};
