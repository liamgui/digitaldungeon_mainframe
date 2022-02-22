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
const answerRegExp = new RegExp(/^([0-9]+)$/);
const commands = {
	hello: {
		response: ({client, channel, tags}) => {
			client.say(channel, `@${tags['display-name']}!! Hello from the other side!`);
		},
	},
	so: {
		response: ({client, channel, tags, argument}) => {
			client.say(channel, `Shout out to ${argument}!! Everyone go check out https://twitch.tv/${argument.replace('@', '')}`);
		}
	},
	answer: {
		run: () => {

		},

		// 1. check if answer is correct,
		// 2. check if user has already answered - overwrite if so
		// 3. else and store answer
		multipleChoice: ({client, channel, tags, message}) => {
			//check if trivia is running
			if (!$nuxt.$store.state.trivia.triviaRunning) return;
			if ($nuxt.$store.state.trivia.inBetweenQuestions && !$nuxt.$store.state.trivia.acceptableBuffer) {
				client.say(channel, `@${tags['display-name']} please wait until the next question.`);
				return;
			}
			//if message isn't 1-4
			let numberOfAnswers = $nuxt.$store.state.trivia.activeQuestion.choices.length;
			if (message > numberOfAnswers || message < 1) {
				client.say(channel, `@${tags['display-name']} please enter your choice as a number between 1 and 4;`);
                return;
			}
			if ($nuxt.$store.state.trivia.answersState[tags['user-id']]) {
				//if user has already answered
				client.say(channel, `@${tags['display-name']} you have already answered ${$nuxt.$store.state.trivia.answersState[tags['user-id']].answer}`);
                // updating answer for user??
                return;
			}

            // add users answer to answerState
            $nuxt.$store.commit('trivia/setAnswer', {userId: tags['user-id'], answer: parseInt(message), username: tags['display-name']});
		},
	},
	trivia: {
		// mod: true,
		response: async () => {
			// $nuxt.$emit('startTrivia');

			//actually call the trivia start function in trivia.js
			$nuxt.$trivia.startTrivia();
		},
	},
	category: {
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
		coolDown: 15,
		// disabled: true,
		response: () => {
			$nuxt.$store.commit('trivia/showScores');
			setTimeout(() => {
				$nuxt.$store.commit('trivia/hideScores');
			}, commands.scores.coolDown * 1000);
		}
	},
	myscore: {
		coolDown: 10,
        response: ({ client, channel, tags }) => {
			let score = 0;
			if ($nuxt.$store.getters["trivia/scores"][tags['user-id']]) {			
				score = $nuxt.$store.getters["trivia/scores"][tags['user-id']].score;
			}
			
			client.say(channel, `Current Score for @${tags['display-name']}: ${score}`);
        }
	},
	help: {
		response: ({ client, channel, tags, argument }) => {
			if (!argument) {
				client.say(channel, `Hey @${tags['display-name']}! I'm a trivia bot. I can do a lot of things. Here are some commands:`);
				// client.say(channel, `!trivia - starts a trivia game.`);
				client.say(channel, `!help trivia - shows trivia instructions.`);
				return;
			}
			switch (argument) {
				case 'trivia':
					client.say(channel, `How to play: Chat the number of the answer you think is correct. Scores will be tallied at the end of the question time.`);
					client.say(channel, `!trivia - starts a trivia game.`);
					client.say(channel, `!myscore - shows your score.`);
					break;
			
				default:
					break;
			}
		}	
	}
}

function coolDownTimer({command, client, channel, tags}) {
	let timer = commands[command].coolDown;
	if ($nuxt.$store.state.tmi.interval[command]) {
		client.say(channel, `@${tags['display-name']} please wait ${$nuxt.$store.state.tmi.timer[command]} seconds before using this command again`);
		return true;
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
		return false;
	}
}

export default async function ({ store, redirect, $config, $trivia }) {

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
					if (coolDownTimer({command, client, channel, tags})) return;
				} else if (commands[command].disabled) {
					return;
				} else if (commands[command].mod && !(tags.badges.moderator || tags.badges.broadcaster)) {
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
