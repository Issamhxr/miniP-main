<script>
	import { fade } from 'svelte/transition';
	export let selected = false;
	export let closed = false;
	export let label;
	export let link;
</script>

<a class="sidebar-item" class:selected href={link}>
	<slot />
	{#if !closed}
		<span transition:fade={{ duration: 100 }}>{label}</span>
	{/if}
</a>

<style>
	.sidebar-item {
		cursor: pointer;
		color: var(--sidebar-accent-foreground);
		padding: 0.5em;
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		gap: 0.5em;
	}
	.sidebar-item:hover {
		background-color: var(--sidebar-accent);
	}

	.selected {
		background-color: var(--sidebar-accent);
	}
</style>
