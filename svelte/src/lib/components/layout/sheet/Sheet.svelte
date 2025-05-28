<script lang="ts">
	import { BxX } from 'svelte-boxicons';
	let { title, children } = $props();
	let visible = $state(false);
	export function open() {
		visible = true;
	}
	export function close() {
		visible = false;
	}
</script>

{#if visible}
	<div class="container">
		<button onclick={close} class="close-sheet" aria-label="Close Sheet"></button>
		<div class="sheet">
			<div class="exit-button-wrapper">
				<button data-variant="ghost" onclick={close}>
					<BxX color="var(--primary)" />
				</button>
			</div>
			<h3 class="title">{title}</h3>
			<div class="sheet-content">
				{@render children()}
			</div>
		</div>
	</div>
{/if}

<style>
	.container {
		overflow-y: hidden;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: var(--alpha);
		z-index: 100;
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: none;
	}
	.close-sheet {
		background: none;
		border: none;
		outline: none;
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		color: transparent;
	}
	.sheet {
		min-width: 400px;
		height: 100%;
		background-color: var(--background);
		padding: 0.5em;
	}
	.exit-button-wrapper {
		display: flex;
		justify-items: center;
		place-content: end;
		width: 100%;
	}
	.title {
		margin: 0.5;
		margin-left: 1em;
	}
	.sheet-content {
		margin-left: 1em;
	}
</style>
