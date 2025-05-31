<script lang="ts">
  import pb from "$lib/pb";
  import { onMount } from "svelte";

  interface Client {
    id: string;
    name: string;
    email: string;
    created: string;
    verify?: string;
  }

  let clients: Client[] = [];
  let filter = "";
  let loading = true;
  let error = "";
  let showAddModal = false;

  let newClient = { name: "", email: "", password: "", confirmPassword: "" };
  let addError = "";

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
        verify: c.verify ?? "non verified",
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

  async function addClient() {
    addError = "";
    if (newClient.password !== newClient.confirmPassword) {
      addError = "Passwords do not match.";
      return;
    }
    try {
      await pb.collection("users").create({
        name: newClient.name,
        email: newClient.email,
        password: newClient.password,
        passwordConfirm: newClient.confirmPassword, // <-- required by PocketBase
        userType: "client",
        emailVisibility: true,
      });
      showAddModal = false;
      newClient = { name: "", email: "", password: "", confirmPassword: "" };
      await fetchClients();
    } catch (e: any) {
      console.error("Add client error:", e);
      addError =
        (e?.data && JSON.stringify(e.data)) ||
        e?.message ||
        "Failed to add client.";
    }
  }
</script>

<h1>Clients</h1>

<div style="margin-bottom: 1em; display: flex; gap: 1em; align-items: center;">
  <input
    type="text"
    placeholder="Search clients..."
    bind:value={filter}
    style="padding: 0.5em; border-radius: 0.25em; border: 1px solid #ccc;"
  />
  <button
    on:click={() => (showAddModal = true)}
    style="padding: 0.5em 1em; border-radius: 0.25em; background: var(--primary); color: var(--primary-foreground); border: none; cursor: pointer;"
  >
    + Add Client
  </button>
</div>

{#if showAddModal}
  <div
    style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 1000;"
  >
    <form
      on:submit|preventDefault={addClient}
      style="background: white; padding: 2em; border-radius: 0.5em; min-width: 300px; display: flex; flex-direction: column; gap: 1em;"
    >
      <h2>Add Client</h2>
      <input
        type="text"
        placeholder="Name"
        bind:value={newClient.name}
        required
      />
      <input
        type="email"
        placeholder="Email"
        bind:value={newClient.email}
        required
      />
      <input
        type="password"
        placeholder="Password"
        bind:value={newClient.password}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        bind:value={newClient.confirmPassword}
        required
      />
      {#if addError}
        <div style="color: red">{addError}</div>
      {/if}
      <div style="display: flex; gap: 1em; justify-content: flex-end;">
        <button type="button" on:click={() => (showAddModal = false)}>
          Cancel
        </button>
        <button
          type="submit"
          style="background: var(--primary); color: var(--primary-foreground); border: none; padding: 0.5em 1em; border-radius: 0.25em;"
        >
          Add
        </button>
      </div>
    </form>
  </div>
{/if}

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
        <th style="padding: 0.75em;">Email</th>
        <th style="padding: 0.75em;">Name</th>
        <th style="padding: 0.75em;">Verified</th>
        <th style="padding: 0.75em;">Created</th>
        <th style="padding: 0.75em;">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#if filteredClients().length === 0}
        <tr>
          <td colspan="5" style="text-align: center; padding: 1em;">
            No clients found.
          </td>
        </tr>
      {:else}
        {#each filteredClients() as client}
          <tr style="border-bottom: 1px solid var(--muted);">
            <td
              style="padding: 0.75em; vertical-align: middle; text-align: center;"
              >{client.email}</td
            >
            <td
              style="padding: 0.75em; vertical-align: middle; text-align: center;"
              >{client.name}</td
            >
            <td
              style="padding: 0.75em; vertical-align: middle; text-align: center;"
            >
              <button
              style="background: {client.verify === 'non verified' ? '#2ecc71' : '#e67e22'}; color: white; border: none; border-radius: 0.25em; padding: 0.25em 0.75em; cursor: pointer;"
              on:click={async () => {
                try {
                const newVerify = client.verify === "non verified" ? "verified" : "non verified";
                await pb.collection("users").update(client.id, { verify: newVerify });
                await fetchClients();
                } catch (e) {
                alert("Failed to update verify status.");
                }
              }}
              >
              {client.verify === "non verified" ? "Verified" : "Non Verified"}
              </button>
            </td>
            <td
              style="padding: 0.75em; vertical-align: middle; text-align: center;"
              >{new Date(client.created).toLocaleDateString()}</td
            >
            <td
              style="padding: 0.75em; vertical-align: middle; text-align: center;"
            >
              <button
                on:click={() => deleteClient(client.id)}
                style="color: #fff; background: #e74c3c; border: none; border-radius: 0.25em; padding: 0.4em 0.8em; cursor: pointer; margin-right: 0.5em;"
              >
                Delete
              </button>
              {#if client.email && client.email !== "Hidden"}
                <button
                  on:click={() => window.open(`mailto:${client.email}`)}
                  style="background: #3498db; color: white; border: none; border-radius: 0.25em; padding: 0.25em 0.75em; cursor: pointer;"
                >
                  Send Mail
                </button>
              {/if}
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
{/if}
