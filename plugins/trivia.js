// import { Categories } from ""

export default function({store, $config}, inject) {
	// console.log($emit);
	let timerCount = 15;
	let debugTimer = 1;
	let offTimerCount = 7;
	let acceptableBufferTime = 2;
		
	const Trivia = {

		getTrivia: async () => {
			//ninja api
			//don't use because no multiple choice

			// const response = await fetch('https://api.api-ninjas.com/v1/trivia?limit=30&category=geography', {
				// 	method: 'GET',
				// 	headers: { 'X-Api-Key': $config.TRIVIA_API_KEY},
				// 	contentType: 'application/json',
			// });
			let cats = Object.entries(store.getters['trivia/categories']).join();
			const response = await fetch(`https://api.trivia.willfry.co.uk/questions?limit=10&categories=${cats}`, {
				method: 'GET',
				contentType: 'application/json',
			});
			return response.json();
		},

		prepareTrivia: async () => {
			let trivia = await Trivia.getTrivia();
			for (let triviaSingle of trivia) {
				let choices = Trivia.getChoices(triviaSingle.incorrectAnswers, triviaSingle.correctAnswer);
				triviaSingle.choices = choices;
			}
			return trivia;
		},

		startTrivia: async () => {
			if (store.state.trivia.triviaRunning) {
				return;
			}

			store.commit('trivia/removeInterval');
			if (!store.state.trivia.triviaRunning) { 
				store.commit('trivia/resetTrivia');
			}

			// interval?
			//get trivia
			await store.dispatch('trivia/setupTrivia');
			//if trivia is empty??
			if (!store.getters['trivia/trivia']) return;

			let activeQuestion = store.state.trivia.activeQuestion;

			Trivia.calculateTime();
			let timer = store.state.trivia.timer;

			
			let activeQuestionNo = 1;
			// store.commit('trivia/setActiveQuestionNo', activeQuestionNo);
			store.commit('trivia/setQuestionsRemaining', store.state.trivia.trivia.length);
			
			// loop through trivia questions
			// assign active trivia question and pass dynamically into triviaQuestion component
			let interval = setInterval(() => {
				if (store.state.trivia.questionsRemaining > 0) {
					if (store.state.trivia.timer > 0) {
						if (store.state.trivia.inBetweenQuestions && store.state.trivia.acceptableBuffer && store.state.trivia.timer <= offTimerCount - acceptableBufferTime) {
							store.commit('trivia/toggleAcceptableBuffer');
							Trivia.calcScores();
						}
						let timer = store.state.trivia.timer - 1;
						store.commit('trivia/setTimer', timer);
					} else {
						store.commit('trivia/toggleInBetweenQuestions');
						if (store.state.trivia.inBetweenQuestions) {
							//if in between questions
							store.commit('trivia/setTimer', offTimerCount);
						} else {
							store.commit('trivia/toggleAcceptableBuffer');
							let questionsRemaining = store.state.trivia.questionsRemaining - 1;
							store.commit('trivia/setQuestionsRemaining', questionsRemaining);
							if (store.state.trivia.questionsRemaining != 0) {
								// new active question
								// store.commit('trivia/setActiveQuestionNumber', activeQuestionNo++);
								let nextQuestion = store.state.trivia.trivia[store.state.trivia.trivia.length - store.state.trivia.questionsRemaining];
								store.commit('trivia/setActiveQuestion', nextQuestion);
								// check how long question is and set timer accordingly
								Trivia.calculateTime();
							} else {
								clearInterval(interval);
								console.log('interval cleared')
								store.commit('trivia/toggleTriviaState');
								store.dispatch('trivia/saveScoreBoard');
							}
						}
					}
				} else {
					clearInterval(store.state.trivia.interval);
					store.commit('trivia/storeInterval', null);
					store.commit('trivia/resetTrivia');
					store.dispatch('trivia/saveScoreBoard');
				}
				// console.log(this.timer);
			}, 1000)

			store.commit('trivia/storeInterval', interval);
		},

		runTimer() {
			
		},
		calculateTime() {
			if (process.env.debug) {
				store.commit('trivia/setTimer', debugTimer);
				return;
			}
			let wordCountQuestion = store.state.trivia.activeQuestion.question.split(' ');
			let wordCountAnswers = store.state.trivia.activeQuestion.choices.join(' ').split(' ');
			let modifiedTimerCount = timerCount;
			if ((wordCountQuestion.length + wordCountAnswers.length) > 15) { 
				modifiedTimerCount += (Math.round((wordCountQuestion.length + wordCountAnswers.length - 10) * 1.5));
				modifiedTimerCount = modifiedTimerCount > 60 ? 60 : modifiedTimerCount;
			}
			store.commit('trivia/setTimer', (modifiedTimerCount));
			return;
		},

		getChoices(incorrect, correct) {
			let choices = []
			if (incorrect.length > 3) {
				incorrect = incorrect.slice(0, 3);
			}
			choices = this.shuffle([...incorrect, correct]);
			return choices;
		},
		
		shuffle(array) {
			let currentIndex = array.length, randomIndex;

			// While there remain elements to shuffle...
			while (currentIndex != 0) {
				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex)
				currentIndex--;

				// And swap it with the current element.
				[array[currentIndex], array[randomIndex]] = [
					array[randomIndex],
					array[currentIndex],
				]
			}

			return array
		},
		async getUser(login) {
			let user = await (await fetch(`https://api.twitch.tv/helix/users?login=${login}`, {
				method: 'GET',
				headers: {
					'Client-ID': $config.TWITCH_CLIENT_ID,
					'Authorization': `Bearer ${ $config.TWITCH_APP_ACCESS_TOKEN }`
				}
			})).json();
			return user;
		},
		async calcScores() {
			// check answers and tally scores
			let answersState = store.state.trivia.answersState;
			if (Object.keys(answersState).length !== 0) {
				for (let userId in answersState) {
					let user = answersState[userId];
					let score = 0;
					if (user.answer === (store.state.trivia.activeQuestion.choices.indexOf(store.state.trivia.activeQuestion.correctAnswer) + 1)) {
						score = 1;
					}
					await store.dispatch('trivia/storeScore', { userId, score, username: user.username });

				}
			}
			store.dispatch('trivia/saveScoreBoard');
			store.commit('trivia/resetAnswersState');
		}
	}

	inject('trivia', Trivia);
}
