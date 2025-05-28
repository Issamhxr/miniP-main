<script lang="ts">
	import Sidebar from '$lib/components/layout/sidebar/Sidebar.svelte';

	let { children } = $props();
</script>

<div class="container">
	<Sidebar />
	<div class="main">
		{@render children()}
	</div>
</div>

<style>
	.container {
		display: flex;
		width: 100%;
	}
	.main {
		width: 100%;
		padding: 0.5em 2em;
	}
</style>
