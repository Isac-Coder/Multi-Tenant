/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#185fa5',
          mid:     '#378add',
          light:   '#e6f1fb',
        },
        surface: {
          0: '#f5f5f3',   // page bg
          1: '#f9f9f8',   // metric cards, subtle bg
          2: '#ffffff',   // cards, panels
        },
        brand: {
          text:   '#1a1a18',
          muted:  '#6b6b68',
          hint:   '#a0a09c',
          border: '#e4e4e1',
          'border-strong': '#c8c8c4',
        },
        success: '#3b6d11',
        'success-bg': '#eaf3de',
        danger: '#a32d2d',
        'danger-bg': '#fcebeb',
        warning: '#854f0b',
        'warning-bg': '#faeeda',
        purple: '#534ab7',
        'purple-bg': '#eeedfe',
        teal: '#0f6e56',
        'teal-bg': '#e1f5ee',
      },
      borderRadius: {
        card: '12px',
      },
    }
  },
  plugins: [],
}
