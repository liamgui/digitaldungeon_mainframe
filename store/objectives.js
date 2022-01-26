export const state = () => ({
	list: [],
	labels: []
})

export const mutations = {
	setList(state, objectives) {
		state.list = objectives;
	},
	setLabels(state, labels) {
		state.labels = labels;
	},
}
