<template>
	<div>
		<section class="section">
			<h1>Trivia</h1>
			<div class="columns is-mobile">
				<div class="column">
					<h2>Active Categories:</h2>
					<ul class="active-categories">
						<li
							v-for="(category, index) in categories"
							:key="index"
						>
							{{ category }}
						</li>
					</ul>
					<button class="button" @click="startTrivia">
						Start Trivia!!!
					</button>
				</div>
				<div class="column">
					<div class="trivia-cards" v-if="trivia.length">
                    {{timer}}
						<div
							v-for="triviaSingle in trivia"
							:key="triviaSingle.id"
						>
							<TriviaQuestion
								class="has-background-light p-5"
								:trivia="triviaSingle"
							></TriviaQuestion>
						</div>
					</div>
				</div>
			</div>
		</section>
		{{ trivia }}
	</div>
</template>

<script>
import TriviaQuestion from '~/components/TriviaQuestion.vue'

export default {
	name: 'Trivia',
	components: {
		TriviaQuestion,
	},
	middleware: ['tmi'],
	data: () => {
		return {
			trivia: [],
			// categories: {},
			allCategories: {},
			timer: null,
            activeQuestion: null,
            interval: false
		}
	},
	computed: {
		categories() {
			console.log(this.$store);
			let categories = Object.keys(this.$store.getters["trivia/categories"]).length
				? this.$store.getters.getters["trivia/categories"]
				: this.allCategories
			return categories
		},
	},
	async mounted() {
		this.allCategories = (
			await this.$content('categories').fetch()
		).categories
	},

	methods: {
		async startTrivia(event) {
			this.trivia = await this.$trivia.prepareTrivia()
            this.timer = 10;
			// loop through trivia questions
			// assign active trivia question and pass dynamically into triviaQuestion component
			let questionNo = 0

		},
	},
	watch: {
		timer: {
			handler(value) {
                if (!this.interval) {
                    //this means question is active
                    if (value > 0) {
                        setTimeout(() => {
                            this.timer--;
                            console.log(this.timer);
                        }, 1000)
                    } else {
                        this.interval = true;
                    }
                } else {
                    // this means answer is being shown and scores tallied
                    this.timer = 5
                    if (value > 0) {
                        setTimeout(() => {
                            this.timer--;
                            console.log(this.timer);
                        }, 1000)
                    } else {
                        this.interval = false;
                    }
                }
			},
			// immediate: true, // This ensures the watcher is triggered upon creation
		},
	},
}
</script>

<style>
.title:not(:last-child) {
	margin-bottom: 0;
}

ul > li {
	margin-bottom: 1rem;
}
.active-categories li {
	margin-bottom: 0;
}
</style>
