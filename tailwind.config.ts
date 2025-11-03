// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './resources/**/*.{js,ts,jsx,tsx,edge}',
    './inertia/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#5A45FF',
        sand: {
          1: '#fdfdfc',
          2: '#f9f9f8',
          3: '#f1f0ef',
          4: '#e9e8e6',
          5: '#e2e1de',
          6: '#dad9d6',
          7: '#cfceca',
          8: '#bcbbb5',
          9: '#8d8d86',
          10: '#82827c',
          11: '#63635e',
          12: '#21201c',
        },
        crextio: {
          yellow: '#FBBF24',
          amber: '#ffebb4',
          blue: '#E6F0FF',
        },
      },
      backgroundImage: {
        'crextio-gradient': 'linear-gradient(to bottom right, #FBBF24, #ffebb4 30%, #E6F0FF 90%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

export default config
