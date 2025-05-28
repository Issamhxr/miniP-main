<script lang="ts">
	import Sheet from '$lib/components/layout/sheet/Sheet.svelte';
	import { BxX } from 'svelte-boxicons';
	import { createEventDispatcher } from 'svelte';

	// Minimal interfaces — replace/import your own as needed
	export interface ServiceComponent {
		id: string;
		name: string;
		[key: string]: any;
	}

	export interface Service {
		id: string;
		name: string;
		updated: string;
		expand?: {
			components?: ServiceComponent[];
		};
		[key: string]: any;
	}

	// Props
	export let service: Service | null = null;

	// Local editable state
	let name = '';
	let components: ServiceComponent[] = [];

	// Whenever `service` changes, seed our local form fields
	$: if (service) {
		name = service.name;
		components = service.expand?.components ? [...service.expand.components] : [];
	}

	const dispatch = createEventDispatcher();
	let sheet: Sheet;

	/** Parent can call this to open the sheet */
	export function open() {
		sheet.open();
	}

	/** Parent can call this to close the sheet */
	export function close() {
		sheet.close();
	}

	function addComponent() {
		components = [...components, { id: '', name: '' }];
	}

	function removeComponent(idx: number) {
		components = components.filter((_, i) => i !== idx);
	}

	function save() {
		if (!service) return;
		const updated: Service = {
			...service,
			name,
			expand: { components }
		};
		dispatch('save', updated);
		sheet.close();
	}
</script>

<Sheet bind:this={sheet} title="Edit Service">
	<div class="sheet">
		<label>
			Service Name
			<input type="text" bind:value={name} />
		</label>

		<p>Components:</p>
		{#each components as comp, i}
			<div class="component-field">
				<input type="text" placeholder="Component name" bind:value={comp.name} />
				<button type="button" aria-label="Remove component" on:click={() => removeComponent(i)}>
					<BxX />
				</button>
			</div>
		{/each}

		<button type="button" data-variant="outline" on:click={addComponent}> Add component </button>

		<div class="actions">
			<button type="button" data-variant="outline" on:click={close}> Cancel </button>
			<button type="button" on:click={save}> Save </button>
		</div>
	</div>
</Sheet>

<style>
	.sheet {
		display: grid;
		gap: 1em;
	}
	label {
		display: flex;
		flex-direction: column;
		font-weight: bold;
	}
	.component-field {
		display: flex;
		gap: 0.5em;
		align-items: center;
	}
	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5em;
		margin-top: 1em;
	}
	.actions button {
		min-width: 5em;
	}
</style>
