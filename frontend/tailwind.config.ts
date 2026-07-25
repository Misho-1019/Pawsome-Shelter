/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9E4203',
        'primary-container': '#E97A3D',
        'on-primary': '#FFFFFF',
        secondary: '#2A9D8F',
        'secondary-container': '#8CF5E4',
        tertiary: '#00687C',
        'tertiary-container': '#00A7C6',
        background: '#FFF8F0',
        surface: '#FFF8F0',
        'surface-bright': '#FFF8F6',
        'surface-container': '#FEEAE2',
        'surface-container-low': '#FFF1EB',
        'surface-container-high': '#F8E4DC',
        'surface-container-highest': '#F2DED6',
        'on-background': '#231915',
        'on-surface': '#231915',
        'on-surface-variant': '#564239',
        outline: '#8A7268',
        'outline-variant': '#DDC1B4',
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      maxWidth: {
        'container': '1280px',
      },
      spacing: {
        'mobile': '16px',
        'desktop': '48px',
        'gutter': '24px',
      },
      boxShadow: {
        'premium': '0px 4px 20px rgba(26, 26, 46, 0.05)',
        'premium-hover': '0px 12px 32px rgba(26, 26, 46, 0.12)',
      },
    },
  },
  plugins: [],
}
