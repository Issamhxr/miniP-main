<script lang="ts">
	import type { PageProps } from './$types';
	import { getServiceClient } from '$lib/api/client';
	import ServiceSheet, { type Service } from './ServiceSheet.svelte';
	import Table from './Table.svelte';

	let { data }: PageProps = $props();

	// Will hold the service we want to edit
	let selectedService: Service | null = null;

	// Reference to our sheet instance
	let sheetRef: ServiceSheet | null = null;

	/** Called when the "Edit" button in Table.svelte is clicked */
	async function openSheet({ detail }: CustomEvent<{ service: { id: string } }>) {
		// fetch full service record
		selectedService = await getServiceClient(detail.service.id);
		// open the sheet via the exposed method
		sheetRef?.open();
	}

	/** Handle save from ServiceSheet */
	function onSave(event: CustomEvent<Service>) {
		const updated: Service = event.detail;
		// TODO: call your API/client to persist `updated`
		console.log('Saving service:', updated);
		// Optionally refresh your table data here...
	}
</script>

<Table services={data.services} on:open-sheet={openSheet} />

<!-- place at root so the sheet floats above -->
<ServiceSheet bind:this={sheetRef} service={selectedService} on:save={onSave} />
