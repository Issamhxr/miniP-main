<script lang="ts">
	import type { PageProps } from './$types';
	import { getServiceClient } from '$lib/api/client';
	import Sheet from '$lib/components/layout/sheet/Sheet.svelte';
	import Table from './Table.svelte';
	import { Notifications, acts } from '@tadashi/svelte-notification';
	import { BxX } from 'svelte-boxicons';
	import pb from '$lib/pb';

	import { createEventDispatcher } from 'svelte';
	import ServiceSheet from './ServiceSheet.svelte';
	const dispatch = createEventDispatcher();
	// let newService = false;
	const notificationLifetime = 3;

	let sheetComponentRef: Sheet | null = null;
	let { data }: PageProps = $props();

	let service: any | { id: string } | null = $state(null);
	let componentsToRemove: string[] = [];
	let componentsToCreate: string[] = [];

	async function openSheetComponentRef(selectedService: { id: string }) {
		componentsToRemove = [];
		// service = selectedService;
		service = await getServiceClient(selectedService.id);
		//console.log(service);
		// console.log(service.expand.components);
		sheetComponentRef?.open();
	}

	function closeSheet() {
		if (sheetComponentRef) {
			sheetComponentRef.close();
		}
	}

	async function save() {
		let newService = false;
		// console.log(componentsToRemove);
		// console.log('heere');
		//__if_service_name_is_emty_abort
		if (service.name === '') {
			acts.add({
				mode: 'danger',
				message: 'you can not leave service name empty',
				lifetime: notificationLifetime
			});
			closeSheet();
			return;
		}

		//___TODO___Im_here_need_an_ID_to_save_the_components_to_the_service
		//___create_a_new_service
		if (service.id === '') {
			let components = service.expand.components;
			newService = true;
			console.log('creating a new service');
			try {
				service = await pb.collection('services').create({ name: service.name });
				acts.add({
					mode: 'success',
					message: '✓ new service created successfuly!',
					lifetime: notificationLifetime
				});
			} catch {
				acts.add({
					mode: 'danger',
					message: 'failed to create a new service!',
					lifetime: notificationLifetime
				});
				closeSheet();
				return;
			}

			console.log('here...........', components.length);
			for (let i = 0; i < components.length; i++) {
				console.log(components[i].name);
				try {
					const newComponent = await pb
						.collection('serviceComponents')
						.create({ name: components[i].name, service: service.id });
					acts.add({
						mode: 'success',
						message: '✓ created component successfuly!',
						lifetime: notificationLifetime
					});
					// await pb.collection('services').update(service.id, {append})
					await pb.collection('services').update(service.id, {
						components: [...(service.components || []), newComponent.id]
					});
				} catch {
					acts.add({
						mode: 'danger',
						message: 'failed to create component!',
						lifetime: notificationLifetime
					});
				}
			}
		}

		if (newService) {
			// closeSheet();
			// location.reload();
			return;
		}
		console.log('should not be here');

		//__update_service_name
		try {
			await pb.collection('services').update(service.id, { name: service.name });
			acts.add({
				mode: 'success',
				message: '✓ updated service successfuly!',
				lifetime: notificationLifetime
			});
		} catch {
			acts.add({
				mode: 'danger',
				message: 'failed to change service name!',
				lifetime: notificationLifetime
			});
		}

		//__add_new_components
		for (let i = 0; i < service.expand.components.length; i++) {
			if (service.expand.components[i].id === '') {
				try {
					const newComponent = await pb
						.collection('serviceComponents')
						.create({ name: service.expand.components[i].name, service: service.id });
					acts.add({
						mode: 'success',
						message: '✓ created component successfuly!',
						lifetime: notificationLifetime
					});
					// await pb.collection('services').update(service.id, {append})
					await pb.collection('services').update(service.id, {
						components: [...(service.components || []), newComponent.id]
					});
				} catch {
					acts.add({
						mode: 'danger',
						message: 'failed to create component!',
						lifetime: notificationLifetime
					});
				}
			}
		}

		//__delete_service_components
		if (componentsToRemove.length > 0) {
			for (let i = 0; i < componentsToRemove.length; i++) {
				try {
					await pb.collection('serviceComponents').delete(componentsToRemove[i]);
					acts.add({
						mode: 'success',
						message: '✓ deleted component successfuly!',
						lifetime: notificationLifetime
					});
				} catch {
					acts.add({
						mode: 'danger',
						message: 'failed to delete component!',
						lifetime: notificationLifetime
					});
				}
			}
		}
	}

	async function createNewService() {
		service = {
			id: '',
			name: '',
			collectionName: 'services',
			expand: {
				components: []
			}
		};
		sheetComponentRef?.open();
	}

	function addComponent() {
		service.expand.components = [
			...(service.expand.components ?? []),
			{ id: '', name: '', service: service.name }
		];
		// components = [...components, { id: '', name: '' }];
	}

	function removeComponent(idx: number) {
		const componentId = service.expand.components.filter((_: any, i: number) => i == idx)[0].id;
		componentId != '' && componentsToRemove.push(componentId);
		service.expand.components = service.expand.components.filter((_: any, i: number) => i !== idx);
	}
</script>

<!--
<button onclick={openSheetComponentRef}>open</button>
-->
<Sheet bind:this={sheetComponentRef} title={'Edit Service'}>
	<div class="sheet-container">
		<div class="sheet">
			<input type="text" bind:value={service.name} />
			<p>Components:</p>
			{#if service?.expand.components}
				{#each service?.expand.components as component, i}
					<div id={component.id} class="component-filed">
						<input type="text" placeholder="component" bind:value={component.name} />
						<button
							data-variant="ghost"
							onclick={() => {
								removeComponent(i);
							}}><BxX /></button
						>
					</div>
				{/each}
			{/if}
			<button data-variant="outline" onclick={addComponent}>Add Component</button>
			<!--
		{#if service?.expand.components}
			<div>{service?.expand.components.length}</div>
		{/if}
		-->
		</div>
		<div class="action-container">
			<div></div>
			<button data-variant="outline" onclick={closeSheet}>Cancel</button>
			<button data-variant="primary" onclick={save}>Save</button>
		</div>
	</div>
</Sheet>

<div class="header">
	<h1>Services</h1>
	<div></div>
	<button data-variant="primary" onclick={createNewService}>+ New service</button>
</div>

<Table services={data.services} on:open-sheet={(e) => openSheetComponentRef(e.detail.service)} />
<Notifications />

<style>
	.header {
		place-items: center;
		width: 100%;
		max-width: 1500px;
		display: grid;
		grid-template-columns: 1fr 10fr 1fr;
	}

	.sheet-container {
		min-height: 80%;
		height: 100%;
		display: grid;
		gap: 2em;
	}
	.action-container {
		padding: 1em;
		display: grid;
		grid-template-columns: 2fr 1fr 1fr;
		gap: 1em;
	}
	.sheet {
		display: grid;
		gap: 1em;
		overflow-y: scroll;
		max-height: 75vh;
	}
	.sheet p {
		font-weight: bold;
	}
	.sheet button {
		max-width: 10em;
	}
	.component-filed {
		display: flex;
		gap: 0.5em;
	}
</style>
