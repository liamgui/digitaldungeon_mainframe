import { filterByValue } from "~/utility";
const tmi = require('tmi.js')

const categoryTypes = [
	'food_and_drink',
	'geography',
	'sport_and_leisure',
	'general_knowledge',
	'history',
	'literature',
	'movies',
	'music',
	'science',
	'society_and_culture'
]

const regExpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/)

const commands = {
	hello: {
		response: 'Hello from the other side',
	},
	answer: {
		response: ({client, channel, tags, argument}) => {
			client.say(channel, `${tags.username}'s answer is this: ${argument}`)
		},
	},
	trivia: {
		mod: true,
		response: async () => {
			let trivia = await $nuxt.$trivia.startTrivia();
		},
	},
	category: {
		// mod: true,
		response: async ({ client, channel, argument }) => {
			// let argument = "food";
			let categoryTypes = (await $nuxt.$content('categories').fetch()).categories;
			let categoryTypesArray = Object.values(categoryTypes);
			//CHECK category strings from json
			if (argument && (categoryTypes[argument] || filterByValue(categoryTypes, argument)) ) {
				let category = filterByValue(categoryTypes, argument);
				$nuxt.$store.dispatch('trivia/toggleCategory', category);
				client.say(channel, `Current Categories: ${Object.values($nuxt.$store.getters["trivia/categories"]).join(' | ')}`)
				client.say(channel, `Available Categories: ${categoryTypesArray.join(' | ')}`)
			} else if (!argument) {
				client.say(channel, `Current Categories: ${Object.values($nuxt.$store.getters["trivia/categories"]).join(' | ')}`)
				client.say(channel, `Available Categories: ${categoryTypesArray.join(' | ')}`)
			}
			 else {
				client.say(channel, `"${argument}" is not an valid category. Please refer to this list for valid categories. || ${categoryTypesArray.join(' | ')}`);
			}
		}
	},

	categories: {
		mod: true,
		response: async ({ client, channel, argument }) => {
			// let argument = "food";
			let categoryTypes = (await $nuxt.$content('categories').fetch()).categories;
			let categoryTypesArray = Object.values(categoryTypes);
			//CHECK category strings from json
			if (argument && (categoryTypes[argument] || filterByValue(categoryTypes, argument)) ) {
				let category = filterByValue(categoryTypes, argument);
				$nuxt.$store.dispatch('trivia/toggleCategory', category);
				client.say(channel, `Current Categories: ${Object.values($nuxt.$store.getters["trivia/categories"]).join(' | ')}`)
				client.say(channel, `Available Categories: ${categoryTypesArray.join(' | ')}`)
			} else if (!argument) {
				client.say(channel, `Current Categories: ${Object.values($nuxt.$store.getters["trivia/categories"]).join(' | ')}`)
				client.say(channel, `Available Categories: ${categoryTypesArray.join(' | ')}`)
			}
			 else {
				client.say(channel, `"${argument}" is not an valid category. Please refer to this list for valid categories. || ${categoryTypesArray.join(' | ')}`);
			}
		}
	}
}

export default async function ({ store, redirect, $config, $trivia }) {
	//follower code

	const followersResponse = await fetch(`https://api.twitch.tv/helix/users/follows?to_id=${ $config.CHANNEL_ID }`, {
		// credentials: 'same-origin',
		method: 'GET',
		// mode: 'no-cors',
		headers: {
			'Client-ID': $config.TWITCH_CLIENT_ID,
			'Authorization': `Bearer ${ $config.TWITCH_APP_ACCESS_TOKEN }`
		}
	});

	const followers = await followersResponse.json();

	// trigger this as a subscription


	const client = new tmi.Client({
		options: {
			debug: true,
			messagesLogLevel: 'info',
		},
		connection: {
			reconnect: true,
			secure: true,
		},
		identity: {
			username: $config.twitchBotUsername,
			password: `oauth:${$config.twitchBotAccessToken}`,
		},
		channels: ['digital_fortress'],
	})
	client.connect().catch(console.error)
	client.on('message', (channel, tags, message, self) => {

		const isNotBot =
			tags.username.toLowerCase() !== $config.twitchBotUsername
		if (self || !isNotBot) return

		if (message.match(regExpCommand)) {
			const [raw, command, argument] = message.match(regExpCommand);

			if (commands[command]) {
				if (commands[command].mod && !(tags.badges.moderator || tags.badges.broadcaster)) {
					console.warn(`Non-moderator tried to access moderator command: ${command}`);
					return;
				}
				const { response } = commands[command]
				if (typeof response == 'function') {
					response({ tags, argument, client, channel })
				} else if (typeof response == 'string') {
					client.say(channel, response)
				}
			}
		}
	})

}
