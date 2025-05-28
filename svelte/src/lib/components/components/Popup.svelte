<script>
	import { onMount } from 'svelte';

	// Popup state using runes
	let visible = $state(false);
	let message = $state('');
	let type = $state('info');
	let timeout;

	// Expose globally available controller
	export const pop = {
		showMessage(msg, msgType = 'info', duration = 3000) {
			message = msg;
			type = msgType;
			visible = true;

			clearTimeout(timeout);
			timeout = setTimeout(() => {
				visible = false;
			}, duration);
		}
	};

	const colors = {
		success: 'bg-green-500',
		error: 'bg-red-500',
		info: 'bg-blue-500'
	};
</script>

{#if visible}
	<div
		class={`fixed bottom-4 left-4 rounded px-4 py-3 text-white shadow-lg transition-all duration-300 ${colors[type]}`}
	>
		{message}
	</div>
{/if}
