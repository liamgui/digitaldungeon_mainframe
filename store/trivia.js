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
	acceptableBuffer: true,
	questionsRemaining: null,
	scoreBoardVisible: false
});

export const mutations = {

	addCategory(state, category) {
		console.log(category);
		if (!state.categories[category]) {
			state.categories = {
				...state.categories,
				...category
			}
		}
	},

	removeCategory(state, category) {
		if (state.categories[category]) {
			//find index of category in categories
			delete state.categories[category];
		}
	},

	clearScoreBoard(state) {
		state.scoreBoard = {};
	},

	setScore(state, { userId, score, username, logo }) {
		let newScore = score;
		if (state.scoreBoard[userId]?.score) { 
			newScore += state.scoreBoard[userId].score;
		}
		state.scoreBoard = {
			...state.scoreBoard,
			[userId]: {score: newScore, username, logo}
		};
	},

	setScoreBoard(state, scoreBoard) {
		for (let userId in scoreBoard) {
			state.scoreBoard[userId] = scoreBoard[userId];
		}
		// state.scoreBoard = scoreBoard;
	},

	showScores(state) {
		state.scoreBoardVisible = true;
	},
	hideScores(state) {
		state.scoreBoardVisible = false;
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

	toggleAcceptableBuffer(state) {
		state.acceptableBuffer = !state.acceptableBuffer;
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
	categories(state) {
		return state.categories;
	},
	trivia(state) {
		return state.trivia;
	},
	scores(state) {
		return state.scoreBoard;
	},

	leaderBoard(state) {
		console.log(state.scoreBoard);
		let leaders = Object.values(state.scoreBoard).sort((a,b) => {
			return a.score > b.score;
		}).slice(0,4);
		let leaderBoard = [];
		for (let leader of leaders) {
			leaderBoard.push(leader);
		}
		return leaderBoard;
	},
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
	async setupTrivia({ commit, state, getters, dispatch }) {
		if (state.triviaRunning) return;
		commit('toggleTriviaState');
		
		let trivia = await $nuxt.$trivia.prepareTrivia(getters.categories, trivia);
		commit('setTrivia', trivia);
		commit('setActiveQuestion', getters.trivia[0]);

	},
	saveScoreBoard({ commit, state, getters }) {
		if (!state.scoreBoard) return;
		window.localStorage.setItem('trivia', JSON.stringify(getters.scores));
	},

	async loadScoreBoard({ dispatch }) {
		console.log("loadScoreBoard");
		let scoreBoard = window.localStorage.getItem('trivia');
		if (scoreBoard) {
			scoreBoard = JSON.parse(scoreBoard);
			console.log(scoreBoard);
			// commit('setScoreBoard', scoreBoard);
			for (let user in scoreBoard) {
				dispatch('storeScore', {userId: user, score: scoreBoard[user].score, username: scoreBoard[user].username});
			}
		}
	},

	async storeScore({commit}, {userId, score, username, logo}) {
		if (!logo || !state.scoreBoard[userId]?.logo) {
			logo = (await $nuxt.$trivia.getUser(username)).data[0].profile_image_url;
		} else {
			logo = state.scoreBoard[userId].logo;
		}
		commit('setScore', {userId, score, username, logo});
	}
}
