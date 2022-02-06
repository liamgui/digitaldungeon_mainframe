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

const regExpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
const answerRegExp = new RegExp(/^([0-9]+)/);
const commands = {
	hello: {
		response: 'Hello from the other side',
	},
	answer: {
		run: () => {

		},

		// 1. check if answer is correct,
		// 2. check if user has already answered - overwrite if so
		// 3. else and store answer
		multipleChoice: ({client, channel, tags, message}) => {
			//check if trivia is running
			if (!$nuxt.$store.state.trivia.triviaRunning || $nuxt.$store.state.trivia.inBetweenQuestions) return;
			//if message isn't 1-4
			let userAnswer = parseInt(message);
			console.log(userAnswer, ' ', typeof userAnswer);
			let numberOfAnswers = $nuxt.$store.state.trivia.activeQuestion.choices.length;
			if (message > numberOfAnswers || message < 1) {
				client.say(channel, `@${tags['display-name']} please enter your choice as a number between 1 and 4;`);
                return;
			}
			
			if ($nuxt.$store.state.trivia.answersState[tags['user-id']]) {
				//if user has already answered
				client.say(channel, `@${tags['display-name']} you have already answered`);
                // updating answer for user??
                return;
			}

            // add users answer to answerState
            $nuxt.$store.commit('trivia/setAnswer', {userId: tags['user-id'], answer: parseInt(message), username: tags['username']});
			// console.log($nuxt.$store.state.trivia.answersState);
		},
	},
	trivia: {
		mod: true,
		response: async () => {
			// $nuxt.$emit('startTrivia');

			//actually call the trivia start function in trivia.js
			$nuxt.$trivia.startTrivia();
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
	},
	scores: {
		mod: true,
		coolDown: 10,
		response: ({ client, channel, tags, command }) => {
			let scores = $nuxt.$store.getters["trivia/scores"];
			let scoresArray = Object.values(scores);
			//FIXME - output scores in order greatest to least
			// client.say(channel, `Current Scores: ${scoresArray.join(' | ')}`);
		}
	},
	myscore: {

	}
}

function coolDownTimer({command, client, channel, tags}) {
	//FIXME undefined seconds if no scoreboard??
	let timer = commands[command].coolDown;
	if ($nuxt.$store.state.tmi.interval[command]) {
		client.say(channel, `@${tags['display-name']} please wait ${$nuxt.$store.state.tmi.timer[command]} seconds before using this command again`);
		return;
	} else {
		let interval = setInterval(() => {
			if (timer > 0) {
				timer--;
				$nuxt.$store.commit('tmi/setTimer', {command, timer});
			} else {
				clearInterval(interval);
				$nuxt.$store.commit('tmi/resetInterval', command);
			}
		}, 1000);
		$nuxt.$store.commit('tmi/setInterval', {command, interval});
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
			// debug: true,
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
	});
	client.connect().catch(console.error);
	client.on('message', (channel, tags, message, self) => {

		const isNotBot =
			tags.username.toLowerCase() !== $config.twitchBotUsername
		if (self || !isNotBot) return

		if (store.state.trivia.triviaRunning && message.match(answerRegExp)) {
			commands['answer'].multipleChoice({ tags, message, client, channel });
		}

		if (message.match(regExpCommand)) {
			const [raw, command, argument] = message.match(regExpCommand);
			if (commands[command]) {
				if (commands[command].coolDown) {
					coolDownTimer({command, client, channel, tags});
				}
				if (commands[command].mod && !(tags.badges.moderator || tags.badges.broadcaster)) {
					console.warn(`Non-moderator tried to access moderator command: ${command}`);
					return;
				}
				const { response } = commands[command]
				if (typeof response == 'function') {
					response({ tags, argument, client, channel, command })
				} else if (typeof response == 'string') {
					client.say(channel, response)
				}
			}
		}
	})

}
