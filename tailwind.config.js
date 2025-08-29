// tailwind.config.js (ESM style)
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#1E40AF',
        'brand-secondary': '#3B82F6',
        'brand-light': '#EFF6FF',
        'brand-dark': '#111827',
        'surface': '#FFFFFF',
        'muted': '#6B7280',
        'subtle': '#F3F4F6',
      },
    },
  },
  plugins: [],
}
