/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily:{
			sans: ['Gotham SSm A, sans-serif']
		},
		letterSpacing: {
			tightest: '-.075em',
			tighter: '-.08em',
			tight: '-.025em',
			normal: '0',
			wide: '.025em',
			wider: '.05em',
			widest: '.1em',
			widest: '.25em',
		  },
		extend: {},
	},
	plugins: [],
}
