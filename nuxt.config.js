export default {
	// Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
	ssr: false,

	// Target: https://go.nuxtjs.dev/config-target
	// target: 'static',

	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: '_DigitalDungeonBot',
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{ hid: 'description', name: 'description', content: '' },
			{ name: 'format-detection', content: 'telephone=no' },
		],
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		'~/plugins/trivia.js',
		// '~/plugins/objectives.js',
		'~/plugins/tmi.js'
	],
	serverMiddleware: [
		// {
		// 	path: '/webhooks/objectives',
		// 	handler: '~/server-middleware/webhookObjectives',
		// },
		// {
		// 	path: '/api/objectives',
		// 	handler: '~/server-middleware/objectives',
		// },
	],
	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/typescript
		'@nuxt/typescript-build',
		// https://go.nuxtjs.dev/stylelint
		'@nuxtjs/stylelint-module',
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/buefy
		'nuxt-buefy',
		// https://go.nuxtjs.dev/axios
		'@nuxtjs/axios',
		// https://go.nuxtjs.dev/pwa
		'@nuxtjs/pwa',
		// https://go.nuxtjs.dev/content
		'@nuxt/content',
		//firebase
		'@nuxtjs/firebase',
	],

	firebase: {
		config: {
			apiKey: process.env.FIREBASE_API_KEY,
			authDomain: process.env.FIREBASE_AUTH_DOMAIN,
			projectId: process.env.FIREBASE_PROJECT_ID,
			storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
			messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
			appId: process.env.FIREBASE_APP_ID,
			measurementId: process.env.FIREBASE_MEASUREMENT_ID,
		},
		services: {
			firestore: true,
			auth: true,
			// auth: true, // Just as example. Can be any other service.
		},
	},

	// Axios module configuration: https://go.nuxtjs.dev/config-axios
	axios: {
		// Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
		baseURL: '/',
	},

	// PWA module configuration: https://go.nuxtjs.dev/pwa
	pwa: {
		manifest: {
			lang: 'en',
		},
	},

	// Content module configuration: https://go.nuxtjs.dev/config-content
	content: {},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {},

	publicRuntimeConfig: {
		twitchBotAccessToken: process.env.TWITCH_TOKEN_ACCESS_KEY,
		twitchBotUsername: process.env.TWITCH_TOKEN_USERNAME,
		CHANNEL_ID: process.env.CHANNEL_ID,
		TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
		TWITCH_APP_ACCESS_TOKEN: process.env.TWITCH_APP_ACCESS_TOKEN,
		TRIVIA_API_KEY: process.env.TRIVIA_API_KEY,
	},

	privateRuntimeConfig: {
		trelloSecretToken: process.env.TRELLO_TOKEN,
		trelloKey: process.env.TRELLO_KEY,
	},

	env: {
		debug: process.env.DEBUG || false
	}
}
