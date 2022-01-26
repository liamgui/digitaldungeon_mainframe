// import { Categories } from ""

export default function({ store }, inject) {
	
	const Trivia = {

		getTrivia: async () => {
			//ninja api
			//don't use because no multiple choice

			// const response = await fetch('https://api.api-ninjas.com/v1/trivia?limit=30&category=geography', {
				// 	method: 'GET',
				// 	headers: { 'X-Api-Key': $config.TRIVIA_API_KEY},
				// 	contentType: 'application/json',
			// });
			let cats = Object.entries(store.getters.categories).join();
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