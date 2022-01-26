<template>
	<!-- <div class="column">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title has-text-grey">
          {{ title }}
        </p>
      </header>
      <div class="card-content">
        <div class="content has-text-centered">
          <b-icon :icon="icon" size="is-large" type="is-primary" />
        </div>
      </div>
      <footer class="card-footer">
        <div class="card-footer-item">
          <span>
            <slot />
          </span>
        </div>
      </footer>
    </div>
  </div> -->
	<div>
		<h3 class="title is-7 has-text-weight-bold has-text-grey-light is-uppercase">{{ trivia.category }}</h3>
		{{ trivia.question }}
		<ol>
			<li v-for="choice in trivia.choices">{{ choice }}</li>
		</ol>
	</div>
</template>

<script>
export default {
	name: 'TriviaQuestion',
	props: {
		trivia: {
			type: Object,
			required: true,
		},
	},
}
</script>
