export const state = () => ({
	interval: {},
	timer: {}
});

export const mutations = {

	setInterval(state, {command, interval}) {
		if (!state.interval[command]) {
			state.interval[command] = interval;
		}
	},
	resetInterval(state, command) {
		delete state.interval[command];
		delete state.timer[command];
	},

	setTimer(state, {command, timer}) {
		state.timer[command] = timer;
	},

}

// export const getters = {
// 	categories: (state) => {
// 		return state.categories;
// 	},

// }

// export const actions = {
// 	toggleCategory({ state, getters, commit}, category) {
// 		if (!category) return;
// 		if (state.categories.length && state.categories[category]) {
// 			console.log("call removeCategory");
// 			commit('removeCategory', category);
// 		} else {
// 			console.log("call addCategory");
// 			commit('addCategory', category);
// 		}
// 		return state.categories;
// 	},
// }
