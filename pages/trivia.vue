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
					<button
						class="button has-background-white is-hidden"
						@click="startTrivia"
					>
						Start Trivia!!!
					</button>
				</div>
			</div>
		</section>
		<section class="trivia-box" :class="{active: (triviaActive && trivia.length)}">
			<div class="trivia-container">
				<h1 class="question-number">
					Question {{ activeQuestionNumber }}
				</h1>
				<!-- <TriviaQuestion v-if="activeQuestion" class="has-background-light p-5" :trivia="activeQuestion" :showAnswer="inBetweenQuestions"></TriviaQuestion> -->
				<!-- set also based on acceptableBuffer -->
				<div :class="{ 'visible-answer': inBetweenQuestions && !acceptableBuffer }">
					<h2 class="category">{{ activeQuestion.category }}</h2>
					<p class="question">{{ activeQuestion.question }}</p>
					<ol class="choices">
						<li
							v-for="choice in activeQuestion.choices"
							class="choice"
							:class="{
								answer: activeQuestion.correctAnswer == choice,
							}"
						>
							{{ choice }}
						</li>
					</ol>
				</div>
			</div>

			<!-- TIMER -->
			<div class="timer" v-if="activeQuestion">
				<p v-if="inBetweenQuestions && activeQuestionNumber < trivia.length">next question in:</p>
				<p v-else>time left:</p>
				<p class="count">{{ timer }}</p>
				<p class="help is-size-5">Need help? !help trivia</p>
			</div>

			<!-- SCORES -->
			<div class="scores" v-if="scores.length">
				<h2 class="title">Score Board Leaders:</h2>
				<div class="columns is-vcentered legend">
					<div class="column is-narrow">
						<div class="logo">
						</div>
					</div>
					<div class="column">
						<div class="username">
							User:
						</div>
					</div>
					<div class="column">
						<div class="score">
							Score:
						</div>
					</div>
				</div>
				<div class="leaderboard">
					<div class="leader" v-for="score of scores">
						<div class="columns is-vcentered">
							<div class="column is-narrow">
								<div class="logo">
									<img :src="score.logo" alt="">
								</div>
							</div>
							<div class="column">
								<div class="username">
									{{score.username}}
								</div>
							</div>
							<div class="column">
								<div class="score">
									{{score.score}}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
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

		trivia() {
			return this.$store.state.trivia.trivia
		},

		timer() {
			return this.$store.state.trivia.timer
		},

		activeQuestion() {
			return this.$store.state.trivia.activeQuestion
		},

		interval() {
			return this.$store.state.trivia.interval
		},

		questionsRemaining() {
			return this.$store.state.trivia.questionsRemaining
		},

		inBetweenQuestions() {
			return this.$store.state.trivia.inBetweenQuestions
		},

		acceptableBuffer() {
			return this.$store.state.trivia.acceptableBuffer
		},

		triviaActive() {
			return this.$store.state.trivia.triviaRunning
		},

		scores() {
			let leaderBoard = this.$store.getters['trivia/leaderBoard'];			
			console.log(leaderBoard);
			return leaderBoard;
			// console.log(this.$store.state.trivia.scoreBoard);
			// return this.$store.state.trivia.scoreBoard;
		},
	},
	async mounted() {
		// this.trivia = await this.$trivia.prepareTrivia();
		// console.log(this.trivia);
		this.allCategories = (
			await this.$content('categories').fetch()
		).categories;

		this.$store.dispatch('trivia/loadScoreBoard');


		// console.log((await this.$fire.firestore.collection('users').get()).docs.map(doc => doc.data()));
		// this.$nuxt.$on('startTrivia', await $trivia.startTrivia);
	},

	methods: {
		startTrivia() {
			// this.$store.dispatch('trivia/setupTrivia');
			this.$trivia.startTrivia();
			console.log(this.$store.state.trivia.scoreBoard);
		},
	},
}

// fix timer issue
// fix mounted trivia error
</script>

<style lang="scss">
@import url('https://use.typekit.net/mnr3qiz.css');

$dungeon-color: #36f8ff;

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
	background: rgb(12, 12, 12);
	background: linear-gradient(
		45deg,
		rgba(12, 12, 12, 1) 48%,
		rgba(5, 13, 14, 1) 48%
	);
	width: 450px;
	// min-height: 650px;
	height: 100vh;
	position: absolute;
	transform: translateX(-112.5%);
	transition: transform 0.5s ease-in-out;
	.question-number {
		opacity: 0;
		transition: opacity 0.5s ease-in-out;
	}
	&.active {
		transform: translateX(0);
		.question-number {
			opacity: 1;
		}
	}
}
.trivia-container {
	padding: 3rem;
}

.question-number {
	color: $dungeon-color;
	display: inline;
	position: absolute;
	width: 100%;
	top: -25px;
	right: -480px;
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

.scores {
	position: absolute;
    left: calc(100% + 4rem);
    top: 1rem;
    margin-left: 1rem;
    color: #36f8ff;
	padding: 1.5rem;
	background: rgba(darken($dungeon-color, 75%), 0.5);

	.title {
		color: $dungeon-color;
	}
	.legend {
		margin-bottom: 0;
		display: none;
	}
	.leaderboard {
		margin-top: 1rem;
	}
	.leader {
		// background: gray;
		border-top: 1px solid $dungeon-color;
		border-bottom: 1px solid $dungeon-color;
		padding: 1rem;
	}
	.logo {
		width: 3rem;
		height: 3rem;
		border-radius: 100%;
		overflow: hidden;
	}
	.username,
	.score {
		font-weight: bold;
		font-size: 1.5rem;
		text-align: center;
	}
	.leader {
		.username,
		.score {
			margin-bottom: 0.5rem;
		}
	}
}
</style>
