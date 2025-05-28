<script lang="ts">
  import pb from "$lib/pb";
  import { onMount } from "svelte";

  interface Client {
    id: string;
    name: string;
    email: string;
    created: string;
  }

  let clients: Client[] = [];
  let filter = "";
  let loading = true;
  let error = "";

  async function fetchClients() {
    loading = true;
    error = "";
    try {
      // Fetch only users with userType 'client' from PocketBase
      const result = await pb
        .collection("users")
        .getFullList({ filter: 'userType="client"', sort: "-created" });
      clients = result.map((c: any) => ({
        id: c.id,
        name: c.name ?? "",
        email: c.email ?? "",
        created: c.created ?? "",
      }));
    } catch (e) {
      error = "Failed to fetch clients.";
      clients = [];
    } finally {
      loading = false;
    }
  }

  onMount(fetchClients);

  function filteredClients() {
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(filter.toLowerCase()) ||
        client.email.toLowerCase().includes(filter.toLowerCase())
    );
  }

  async function deleteClient(id: string) {
    if (
      !confirm(
        "Are you sure you want to delete this client? This action cannot be undone."
      )
    )
      return;
    try {
      await pb.collection("users").delete(id);
      clients = clients.filter((c) => c.id !== id);
    } catch (e) {
      alert("Failed to delete client.");
    }
  }
</script>

<div style="margin-bottom: 1em; display: flex; gap: 1em; align-items: center;">
  <input
    type="text"
    placeholder="Search clients..."
    bind:value={filter}
    style="padding: 0.5em; border-radius: 0.25em; border: 1px solid #ccc;"
  />
  <button
    disabled
    style="padding: 0.5em 1em; border-radius: 0.25em; background: var(--primary); color: var(--primary-foreground); border: none; opacity: 0.5; cursor: not-allowed;"
  >
    + Add Client
  </button>
</div>

{#if loading}
  <p>Loading clients...</p>
{:else if error}
  <p style="color: red">{error}</p>
{:else}
  <table
    style="width: 100%; border-collapse: collapse; background: var(--card); border-radius: var(--radius); box-shadow: var(--shadow);"
  >
    <thead style="background: var(--muted);">
      <tr>
        <th style="padding: 0.75em;">Name</th>
        <th style="padding: 0.75em;">Email</th>
        <th style="padding: 0.75em;">Created</th>
        <th style="padding: 0.75em;">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#if filteredClients().length === 0}
        <tr>
          <td colspan="4" style="text-align: center; padding: 1em;">
            No clients found.
          </td>
        </tr>
      {:else}
        {#each filteredClients() as client}
          <tr style="border-bottom: 1px solid var(--muted);">
            <td style="padding: 0.75em;">{client.name}</td>
            <td style="padding: 0.75em;">{client.email}</td>
            <td style="padding: 0.75em;">
              {new Date(client.created).toLocaleDateString()}
            </td>
            <td style="padding: 0.75em;">
              <button
                on:click={() => deleteClient(client.id)}
                style="color: #fff; background: #e74c3c; border: none; border-radius: 0.25em; padding: 0.4em 0.8em; cursor: pointer;"
              >
                Delete
              </button>
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
{/if}
