<template>
	<main>
		<section class="section start-button">
			<!-- <h1>Trivia</h1> -->
			<div class="columns is-mobile">
				<div class="column">
					<!-- <h2>Active Categories:</h2>
					<ul class="active-categories">
						<li
							v-for="(category, index) in categories"
							:key="index"
						>
							{{ category }}
						</li>
					</ul> -->
					<button class="button has-background-white" @click="startTrivia">
						Start Trivia!!!
					</button>
				</div>
			</div>
		</section>
		<section class="trivia-box" v-if="trivia.length">
			<div class="trivia-container">
				<h1 class="question-number">Question {{ activeQuestionNumber }}</h1>
				<!-- <TriviaQuestion v-if="activeQuestion" class="has-background-light p-5" :trivia="activeQuestion" :showAnswer="inBetweenQuestions"></TriviaQuestion> -->
				<div :class="{ 'visible-answer': inBetweenQuestions }">
					<h2 class="category">{{ activeQuestion.category }}</h2>
					<p class="question">{{ activeQuestion.question }}</p>
					<ol class="choices">
						<li v-for="choice in activeQuestion.choices" class="choice" :class="{answer: activeQuestion.correctAnswer == choice}">{{ choice }}
						</li>
					</ol>
				</div>
			</div>
			<!-- TIMER -->
			<div
				class="timer"
				v-if="activeQuestion"
			>
				<p v-if="inBetweenQuestions"
					>next question in:</p
				>
				<p v-else>time left:</p>
				<p class="count">{{ timer }}</p>
			</div>
		</section>
		<div class="trivia-json" v-if="trivia.length" >{{ trivia }}</div>
	</main>
</template>

<script>


export default {
	name: 'Trivia',
	layout: 'blank',
	middleware: ['tmi'],
	data: () => {
		return {
			// trivia: [],
			// categories: {},
			allCategories: {},
			// timer: timer,
			// activeQuestion: null,
			// interval: null,
			// questionsRemaining: null,
			// inBetweenQuestions: false,

		}
	},
	computed: {
		categories() {
			console.log(this.$store)
			let categories = Object.keys(
				this.$store.getters['trivia/categories']
			).length
				? this.$store.getters.getters['trivia/categories']
				: this.allCategories
			return categories
		},

		activeQuestionNumber() {
			if (this.$store.state.trivia.length) {
				return $store.state.trivia.length - this.$store.state.trivia.questionsRemaining + 1
			} else {
				return null
			}
		},

		trivia() {
			return this.$store.state.trivia.trivia;
		},

		timer() {
			return this.$store.state.trivia.timer;
		},

		activeQuestion() {
			return this.$store.state.trivia.activeQuestion;
		},

		interval() {
			return this.$store.state.trivia.interval;
		},

		questionsRemaining() {
			return this.$store.state.trivia.questionsRemaining;
		},

		inBetweenQuestions() {
			return this.$store.state.trivia.inBetweenQuestions;
		},
		


	},
	async mounted() {
		// this.trivia = await this.$trivia.prepareTrivia();
		// console.log(this.trivia);
		this.allCategories = (
			await this.$content('categories').fetch()
		).categories;

		// this.$nuxt.$on('startTrivia', await $trivia.startTrivia);
	},

	methods: {

		startTrivia() {
			this.$store.dispatch('trivia/setupTrivia');
		}
		// async startTrivia(event) {
		// 	console.log("Start Trivia");
		// 	if (this.$store.state.trivia.triviaRunning) return;
		// 	if (this.interval) {
		// 		clearInterval(this.interval);
		// 	}
		// 	if (!this.trivia.length) {
		// 		this.trivia = await this.$trivia.prepareTrivia()
		// 	}
		// 	this.activeQuestion = this.trivia[0];
		// 	console.log(this.$store);
		// 	this.$store.commit('trivia/toggleTriviaState');
		// 	this.$store.commit('trivia/setActiveQuestion', this.activeQuestion);
		// 	this.activeQuestionNo = 1
		// 	this.questionsRemaining = this.trivia.length
		// 	// loop through trivia questions
		// 	// assign active trivia question and pass dynamically into triviaQuestion component
		// 	this.interval = setInterval(() => {
		// 		if (this.questionsRemaining > 0) {
		// 			if (this.timer > 0) {
		// 				this.timer--
		// 			} else {
		// 				this.inBetweenQuestions = !this.inBetweenQuestions
		// 				if (this.inBetweenQuestions) {
		// 					//if in between questions
		// 					//show answer
		// 					if (this.timer == 5) {
		// 					}
		// 					this.timer = offTimer
		// 				} else {
		// 					this.questionsRemaining--
		// 					if (this.questionsRemaining != 0) {
								
		// 						// new active question
		// 						this.activeQuestionNo++
		// 						this.activeQuestion = this.trivia[this.trivia.length - this.questionsRemaining];
		// 						this.$store.commit('trivia/setActiveQuestion', this.activeQuestion);
		// 						// check how long question is and set timer accordingly
		// 						let wordCount = this.activeQuestion.question.split(' ');
		// 						if (wordCount.length > 10) { 
		// 							this.timer = timer + ((wordCount.length - 10) * 2);
		// 						} else {
		// 							this.timer = timer;
		// 						}
								
		// 					} else {
		// 						this.trivia = []
		// 					}
		// 				}
		// 			}
		// 		} else {
		// 			this.trivia = []
		// 			clearInterval(this.interval)
		// 			console.log('interval cleared')
		// 		}
		// 		// console.log(this.timer);
		// 	}, 1000)
		// },
	},
}

// fix timer issue
// fix mounted trivia error
</script>

<style lang="scss">
@import url('https://use.typekit.net/mnr3qiz.css');

$dungeon-color: #36F8FF;

body {
	font-family: 'futura-pt';
	color: white;
	// background: $dungeon-color;
}

.title:not(:last-child) {
	margin-bottom: 0;
}
	// .active-categories li {
	// 	margin-bottom: 0;
	// }
main {
	position: relative;
	// margin-top: 5rem;
}

.start-button {
	position: absolute;
}
ul {
	li {
		margin-bottom: 1rem;
		font-weight: bold;
		font-size: 2rem;
	}
}
ol {
	li {
		list-style: decimal inside none;
	}
}
.trivia-box {
	background: rgb(12,12,12);
	background: linear-gradient(45deg, rgba(12,12,12,1) 48%, rgba(5,13,14,1) 48%);
	width: 450px;
	// min-height: 650px;
	height:100vh;
	position: absolute;
}
.trivia-container {
	padding: 3rem;
}

.question-number {
	color: $dungeon-color;
	display: inline;
	position: absolute;
	// left: -280px;
	top: -45px;
	right: -280px;
	// padding-left: 2rem;
	// padding-right: 2rem;
	transform: rotate(90deg);
	transform-origin: left;
	font-size: 3.5rem;
	font-weight: 500;
	// background-color: rgba(0,0,0,0.5);
	// background-color: rgba(5,13,14, 0.75);
}

.category {
	font-size: 1rem;
	font-weight: bold;
	color: $dungeon-color;
	text-transform: uppercase;
	margin: 0;
}

.question {
	font-weight: 500;
	font-size: 1.5rem;
	// margin-top: -0.5rem;
	margin-bottom: 2rem;
	line-height: 1.35;
}

.choices {
	font-weight: 500;
	font-size: 1.5rem;
	.choice {
		margin-bottom: 0.75rem;
	}
}

.visible-answer {
	.answer {
		color: green;
	}
	li {
		color: red;
		transition: 2s color ease-out;
	}
}
.timer {
	// @extends .title .has-text-weight-bold .is-1;
	font-weight: bold;
	text-align: center;
	position: absolute;
	width: 100%;
	bottom: 1rem;
	font-size: 1.5rem;
	color: white;
	.count {
		font-size: 4.5rem;
		display: block;
		color: $dungeon-color;
	}
}
</style>
