export const state = () => ({
	categories: {},
})

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
}

export const getters = {
	categories: (state) => {
		return state.categories;
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
	}
}
