<script lang="ts">
  import { dateFromPocketbaseToReadableFormat } from "$lib/utils/date";
  import { BxEdit, BxShow, BxTrash } from "svelte-boxicons";
  import { createEventDispatcher } from "svelte";
  import pb from "$lib/pb";
  import { Notifications, acts } from "@tadashi/svelte-notification";
  const dispatch = createEventDispatcher();
  let showBulkActions = $state(false);
  let { services } = $props();

  async function handleEdit(serviceId: string) {
    let service = { id: serviceId };
    dispatch("open-sheet", { service });
  }

  async function deleteService(serviceId: string) {
    try {
      // Fetch all components for the service
      const resultList = await pb.collection("serviceComponents").getFullList({
        filter: `service = "${serviceId}"`,
      });

      // Delete each component
      for (const component of resultList) {
        await pb.collection("serviceComponents").delete(component.id);
      }

      await pb.collection("services").delete(serviceId);
      acts.add({
        mode: "success",
        message: "✓ deleted service successfuly!",
        lifetime: 2,
      });
      location.reload();
    } catch {
      acts.add({
        mode: "danger",
        message: "failed to delete service!",
        lifetime: 2,
      });
    }
  }

  let showModal = false;
  let modalComponents = [];

  async function showComponentsModal(service) {
    try {
      // Try both possible collection names for compatibility
      let result = await pb.collection("components").getFullList({
        filter: `service = \"${service.id}\"`,
        sort: "-updated",
      });
      if (!result.length) {
        result = await pb.collection("serviceComponents").getFullList({
          filter: `service = \"${service.id}\"`,
          sort: "-updated",
        });
      }
      modalComponents = [...result];
    } catch (e) {
      modalComponents = [];
    }
    showModal = true;
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
            {#if service.expand?.components?.length}
              <span class="badge-outline"
                >{service.expand?.components?.length} components</span
              >
              <table
                style="width:100%;border-collapse:collapse;margin-top:0.5em;"
              >
                <thead>
                  <tr>
                    <th
                      style="padding:0.5em;text-align:left;background:#f5f5f5;"
                      >Nom</th
                    >
                    <th
                      style="padding:0.5em;text-align:left;background:#f5f5f5;"
                      >ID</th
                    >
                    <th
                      style="padding:0.5em;text-align:left;background:#f5f5f5;"
                      >Service</th
                    >
                    <th
                      style="padding:0.5em;text-align:left;background:#f5f5f5;"
                      >Updated</th
                    >
                  </tr>
                </thead>
                <tbody>
                  {#each service.expand.components as comp}
                    <tr style="border-bottom:1px solid #eee;">
                      <td style="padding:0.5em;">{comp.name}</td>
                      <td style="padding:0.5em;color:#888;font-size:0.95em;"
                        >{comp.id}</td
                      >
                      <td style="padding:0.5em;color:#888;font-size:0.95em;"
                        >{comp.service}</td
                      >
                      <td style="padding:0.5em;color:#888;font-size:0.95em;"
                        >{comp.updated
                          ? new Date(comp.updated).toLocaleString()
                          : ""}</td
                      >
                    </tr>
                  {/each}
                </tbody>
              </table>
            {/if}
            {#if !service.expand?.components?.length}
              <span class="badge-outline">no components</span>
            {/if}
          </td>
          <td class="td-action">
            <div class="row-action-wrapper">
              <button data-variant="ghost">
                <BxShow size="18" color="var(--primary)" />
              </button>
              <button
                data-variant="ghost"
                onclick={() => deleteService(service.id)}
              >
                <BxTrash size="18" color="var(--primary)" />
              </button>
              <button
                data-variant="ghost"
                onclick={() => handleEdit(service.id)}
              >
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

{#if showModal}
  <div
    style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 1000;"
  >
    <div
      style="background: white; padding: 2em 2em 1.5em 2em; border-radius: 0.5em; min-width: 350px; min-height: 120px; box-shadow: 0 2px 16px rgba(0,0,0,0.2); max-width: 90vw; max-height: 80vh; overflow-y: auto; position: relative;"
    >
      <div
        style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1em;"
      >
        <h2 style="margin:0;">Composants du service</h2>
        <button
          style="background: none; border: none; font-size: 2rem; color: #888; cursor: pointer; line-height: 1; padding: 0 0.25em; transition: color 0.2s;"
          onclick={() => (showModal = false)}
          title="Fermer">&times;</button
        >
      </div>
      {#if modalComponents.length > 0}
        <table style="width:100%;border-collapse:collapse;margin-bottom:1em;">
          <thead>
            <tr>
              <th style="padding:0.75em;text-align:left;background:#f5f5f5;"
                >Nom</th
              >
              <th style="padding:0.75em;text-align:left;background:#f5f5f5;"
                >ID</th
              >
              <th style="padding:0.75em;text-align:left;background:#f5f5f5;"
                >Service</th
              >
              <th style="padding:0.75em;text-align:left;background:#f5f5f5;"
                >Updated</th
              >
            </tr>
          </thead>
          <tbody>
            {#each modalComponents as comp}
              <tr style="border-bottom:1px solid #eee;">
                <td style="padding:0.75em;">{comp.name}</td>
                <td style="padding:0.75em;color:#888;font-size:0.95em;"
                  >{comp.id}</td
                >
                <td style="padding:0.75em;color:#888;font-size:0.95em;"
                  >{comp.service}</td
                >
                <td style="padding:0.75em;color:#888;font-size:0.95em;"
                  >{new Date(comp.updated).toLocaleString()}</td
                >
              </tr>
            {/each}
          </tbody>
        </table>
      {:else}
        <p style="color:#888;text-align:center;margin:2em 0;">
          Aucun composant trouvé.
        </p>
      {/if}
    </div>
  </div>
{/if}

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
