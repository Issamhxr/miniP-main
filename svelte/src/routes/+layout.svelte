<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="container">
	{@render children()}
</div>

<style>
	.container {
		width: 100%;
	}
</style>
