// import { Categories } from ""

export default function({store}, inject) {
	// console.log($emit);
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
			let timerCount = 10;
			let offTimerCount = 7;
			let timer = store.state.trivia.timer;

			// interval?
			store.commit('trivia/removeInterval');
			//get trivia
			store.dispatch('trivia/setupTrivia');
			//if trivia is empty??
			if (!store.getters['trivia/trivia']) return;

			let activeQuestion = store.state.trivia.activeQuestion;
			
			let activeQuestionNo = 1;
			store.commit('trivia/setActiveQuestionNo', activeQuestionNo);
			let questionsRemaining = trivia.length;
			
			// loop through trivia questions
			// assign active trivia question and pass dynamically into triviaQuestion component
			let interval = setInterval(() => {
				if (questionsRemaining > 0) {
					if (store.state.trivia.timer > 0) {
						store.commit('trivia/setTimer', store.state.trivia.timer--);
					} else {
						store.commit('trivia/toggleInBetweenQuestions');
						if (store.state.trivia.inBetweenQuestions) {
							//if in between questions
							//show answer
							if (store.commit('trivia/setTimer', 5)) {
							}
							store.commit('trivia/setTimer', offTimer);
						} else {
							questionsRemaining--;
							if (questionsRemaining != 0) {
								// new active question
								store.commit('trivia/setActiveQuestionNumber', activeQuestionNo++);
								store.commit('trivia/setActiveQuestion', trivia[trivia.length - questionsRemaining]);
								// check how long question is and set timer accordingly
								let wordCount = store.state.trivia.activeQuestion.question.split(' ');
								if (wordCount.length > 10) { 
									store.commit('trivia/setTimer', (timer + ((wordCount.length - 10) * 2)));
								} else {
									store.commit('trivia/setTimer', timer);
								}
								
							} else {
								store.commit('trivia/setTrivia', []);
							}
						}
					}
				} else {
					store.commit('trivia/setTrivia', []);
					clearInterval(store.state.trivia.interval);
					state.commit('trivia/storeInterval', null);
					console.log('interval cleared')
				}
				// console.log(this.timer);
			}, 1000)

			store.commit('trivia/storeInterval', interval);



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
	}

	inject('trivia', Trivia);
}