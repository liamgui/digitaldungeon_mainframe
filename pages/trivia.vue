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
		<!-- <div class="trivia-json" v-if="trivia.length" >{{ trivia }}</div> -->
	</main>
</template>

<script>

let timer = 10
let offTimer = 7

export default {
	name: 'Trivia',
	layout: 'blank',
	middleware: ['tmi'],
	data: () => {
		return {
			trivia: [],
			// categories: {},
			allCategories: {},
			timer: timer,
			activeQuestion: null,
			interval: null,
			questionsRemaining: null,

			inBetweenQuestions: false,
			activeQuestionNo: null,
			activeQuestion: null,
			
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
			if (this.trivia.length) {
				return this.trivia.length - this.questionsRemaining + 1
			} else {
				return null
			}
		},
	},
	async mounted() {
		// this.trivia = await this.$trivia.prepareTrivia();
		// console.log(this.trivia);
		this.allCategories = (
			await this.$content('categories').fetch()
		).categories;
		let start = this.startTrivia;
		this.$nuxt.$on('startTrivia', await this.startTrivia);
	},

	watch: {
		// '$store.state.trivia.triviaRunning': function(state) {
		// 	console.log(state);
		// }
	},

	methods: {
		async startTrivia(event) {
			console.log("Start Trivia");
			if (this.interval) {
				clearInterval(this.interval);
			}
			if (!this.trivia.length) {
				this.trivia = await this.$trivia.prepareTrivia()
			}
			this.activeQuestion = this.trivia[0]
			this.activeQuestionNo = 1
			this.questionsRemaining = this.trivia.length
			// loop through trivia questions
			// assign active trivia question and pass dynamically into triviaQuestion component
			this.interval = setInterval(() => {
				if (this.questionsRemaining > 0) {
					if (this.timer > 0) {
						this.timer--
					} else {
						this.inBetweenQuestions = !this.inBetweenQuestions
						if (this.inBetweenQuestions) {
							//if in between questions
							//show answer
							if (this.timer == 5) {
							}
							this.timer = offTimer
						} else {
							this.questionsRemaining--
							if (this.questionsRemaining != 0) {
								this.timer = timer
								// new active question
								this.activeQuestionNo++
								this.activeQuestion =
									this.trivia[
										this.trivia.length -
											this.questionsRemaining
									]
							} else {
								this.trivia = []
							}
						}
					}
				} else {
					this.trivia = []
					clearInterval(this.interval)
					console.log('interval cleared')
				}
				// console.log(this.timer);
			}, 1000)
		},
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
	margin-top: 5rem;
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
	width: 400px;
	height: 650px;
	position: absolute;
	right: 1rem;
}
.trivia-container {
	padding: 3rem;
}

.question-number {
	color: $dungeon-color;
	display: inline;
	position: absolute;
	left: -280px;
	top: -45px;
	transform: rotate(-90deg);
	transform-origin: right;
	font-size: 3.5rem;
	font-weight: 500;
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
