<script lang="ts">
	import { dateFromPocketbaseToReadableFormat } from '$lib/utils/date';
	import { BxEdit, BxShow, BxTrash } from 'svelte-boxicons';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	let showBulkActions = $state(false);
	let { services } = $props();

	async function handleEdit(serviceId: string) {
		let service = { id: serviceId };
		dispatch('open-sheet', { service });
	}
</script>

<table>
	<thead>
		<tr>
			<th><input type="checkbox" /></th>
			<th class="th-name">Service</th>
			<th class="th-created">Updated</th>
			<th>Components</th>
			<th>
				{#if showBulkActions}
					<button data-variant="ghost">
						<BxTrash size="18" color="var(--primary)" />
					</button>
				{/if}
			</th>
		</tr>
	</thead>
	<tbody>
		{#if services.length}
			{#each services as service}
				<tr>
					<td class="td-action"><input type="checkbox" /></td>
					<td>{service.name}</td>
					<td>{dateFromPocketbaseToReadableFormat(service.updated)}</td>
					<td>
						<!--
						-->
						{#if service.expand?.components?.length}
							<span class="badge-outline">{service.expand?.components?.length} components</span>
						{:else}
							<span class="badge-outline">no components</span>
						{/if}
					</td>
					<td class="td-action">
						<div class="row-action-wrapper">
							<button data-variant="ghost">
								<BxShow size="18" color="var(--primary)" />
							</button>
							<button data-variant="ghost">
								<BxTrash size="18" color="var(--primary)" />
							</button>
							<button data-variant="ghost" onclick={() => handleEdit(service.id)}>
								<BxEdit size="18" color="var(--primary)" />
							</button>
						</div>
					</td>
				</tr>
			{/each}
		{:else}
			<tr>
				<td>No available data!!</td>
			</tr>
		{/if}
	</tbody>
</table>

<style>
	table {
		border-collapse: separate;
		width: 100%;
		max-width: 1500px;
		border: 1px solid var(--input);
		border-radius: 5px;
	}
	thead {
		color: var(--muted-foreground);
		text-align: start;
	}

	th {
		text-align: start;
		padding: 0.5em;
	}

	td {
		border-top: 1px solid var(--input);
		text-align: start;
		padding: 0.5em;
	}

	.td-action {
		width: 2em;
	}

	.th-name {
		max-width: 10px;
	}

	.th-created {
		width: 8em;
	}

	.row-action-wrapper {
		display: flex;
		flex-direction: row;
		gap: 0.5em;
	}
</style>
