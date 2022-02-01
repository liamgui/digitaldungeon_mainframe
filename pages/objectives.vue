<template>
	<div class="window">
		<div class="objectives" v-if="list.length">
			<h1 class="title is-5 has-text-centered is-uppercase">
				Stream Objectives
			</h1>
			<ul v-if="list.length">
				<li v-for="li in list" :key="li.id">
					<div v-if="li.labels.length" class="labels">
						<div class="objective-label" v-for="label in li.labels" :key="label.id" :class="[label.color]">{{label.name}}</div>
					</div>
					<h2>{{ li.name }}</h2>
					<!-- <ul v-if="li.checkItems">
						<li v-for="sub in li.check">item</li>
					</ul> -->
				</li>
				<!-- {{list}} -->
			</ul>
		</div>
	</div>
</template>

<script>
export default {
	name: 'ObjectivesPage',
	layout: 'blank',
	middleware: ['objectives'],
	data: () => {
		return {
		}
	},

	computed: {
		list() {
			return this.$store.state.objectives.list;
		},
		labels() {
			return this.$store.state.objectives.labels;
		}
	},
}
</script>

<style lang="scss">
$opacity: 0.9;
$background: #05090d;
$color: #b5ffff;
.window {
	width: 100vw;
}

.objectives {
	// opacity: 0.75;
	background: rgba($background, 0.5);
	width: 350px;
	padding: 2rem;
	box-shadow: 0 3px 5px rgba(0, 0, 0, 0.5);

}

.title,
li {
	background: rgba($background, $opacity);
	color: white;
	border: 3px solid rgba(lightgray, 0.5);
	border-radius: 5px;
	box-shadow: 0 3px 5px rgba(0, 0, 0, 0.5);
	padding: 1rem;
	margin-bottom: 1rem !important;

}

.title {
	text-shadow: 0 0 7px rgba($color, 0.8);
	// background: transparent;
	color: $color;
}

.objective-label {
	color: white;
	margin-bottom: 0.75rem;
	padding: 0.1rem 0.5rem;
	font-weight: bold;
	font-size: 0.8rem;
	border-radius: 5px;
	display: inline;
}


//colors
.sky {
	background: #469DB1;
}
.red {
	background: #911C13;
}
.blue {
	background: #316595;
}


</style>
