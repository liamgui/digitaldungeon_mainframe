export const state = () => ({
	categories: {},
	triviaRunning: false,
	scoreBoard: {},
	answersState: {},
	activeQuestion: {
		question: '',
		choices: [],
		correctAnswer: '',
		category: '',
		id: '',
		type: '',
		incorrectAnswers: [],
	},
	trivia: [null],
	interval: null,
	timer: 10,
	inBetweenQuestions: false,
	questionsRemaining: null,
});

export const mutations = {

	addCategory(state, category) {
		if (!state.categories[category]) {
			state.categories[category] = Object.values(category);
		}
	},

	removeCategory(state, category) {
		if (state.categories[category]) {
			//find index of category in categories
			//slice from that index, 1
			delete state.categories[category];
		}
	},

	addScore(state, { user, score, username }) {
		// add score to user in scoreBoard
		if (!state.scoreBoard[user]) {
			state.scoreBoard[user] = 0;
		}
		state.scoreBoard[user] += score;
	},

	clearScoreBoard(state) {
		state.scoreBoard = {};
	},

	setScore(state, { userId, score, username }) {
		let newScore = score;
		if (state.scoreBoard[userId] && state.scoreBoard[userId].score) {
			newScore += state.scoreBoard[userId].score;
		}
		state.scoreBoard[userId] = {score: newScore, username};
	},

	setAnswer(state, { userId, answer, username }) {
		state.answersState[userId] = {answer, username};
	},

	resetAnswersState(state) {
		state.answersState = {};
	},

	setActiveQuestion(state, question) {
		state.activeQuestion = question;
	},

	toggleTriviaState(state) {
		state.triviaRunning = !state.triviaRunning;
	},

	setTrivia(state, trivia) {
		state.trivia = trivia;
	},

	storeInterval(state, interval) {
		if (state.interval) {
			clearInterval(state.interval);
		}
		state.interval = interval;
	},

	removeInterval(state) {
		if (!state.interval) return;
		clearInterval(state.trivia.interval);
		state.interval = null;
	},

	setTimer(state, timer) {
		state.timer = timer;
	},
	toggleInBetweenQuestions(state) {
		state.inBetweenQuestions = !state.inBetweenQuestions;
	},

	setQuestionsRemaining(state, questionsRemaining) {
		state.questionsRemaining = questionsRemaining;
	},

	resetTrivia(state) {	
		state.triviaRunning = false;
		state.answersState = {};
		state.activeQuestion = {
			question: '',
			choices: [],
			correctAnswer: '',
			category: '',
			id: '',
			type: '',
			incorrectAnswers: [],
		},
		state.trivia = [];
		state.interval = null;
		state.timer = 10;
		state.inBetweenQuestions = false;
		state.questionsRemaining = null;
	}

}

export const getters = {
	categories: (state) => {
		return state.categories;
	},
	trivia: (state) => {
		return state.trivia;
	},
	scores: (state) => {
		return state.scoreBoard;
	}
}

export const actions = {
	toggleCategory({ state, getters, commit}, category) {
		if (!category) return;
		if (state.categories.length && state.categories[category]) {
			console.log("call removeCategory");
			commit('removeCategory', category);
		} else {
			console.log("call addCategory");
			commit('addCategory', category);
		}
		return state.categories;
	},
	async setupTrivia({ commit, state, getters }) {
		if (state.triviaRunning) return;
		commit('toggleTriviaState');
		
		let trivia = await $nuxt.$trivia.prepareTrivia(getters.categories, trivia);
		console.log(trivia);
		commit('setTrivia', trivia);
		commit('setActiveQuestion', getters.trivia[0]);
	}
}
