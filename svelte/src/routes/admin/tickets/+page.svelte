<script lang="ts">
  import pb from "$lib/pb";
  import { onMount } from "svelte";

  interface Ticket {
    id: string;
    title: string;
    status: "Open" | "In Progress" | "Closed";
    created: string;
    updated: string;
    assignedTo: string;
    niveau?: string;
  }

  interface Employee {
    id: string;
    name: string;
  }

  let tickets: Ticket[] = [];
  let employees: Employee[] = [];
  let filter: string = "";
  let loading = true;
  let error = "";

  async function fetchTickets() {
    loading = true;
    error = "";
    try {
      const result = await pb
        .collection("Tickets")
        .getFullList({ sort: "-created" });
      tickets = result.map((t: any) => ({
        id: t.id,
        title: t.title ?? "",
        status: t.status ?? "Open",
        created: t.created ?? "",
        updated: t.updated ?? t.created ?? "",
        assignedTo: t.assignedTo ?? "Unassigned",
        niveau: t.niveau,
      }));
    } catch (e) {
      error = "Failed to fetch tickets.";
      tickets = [];
    } finally {
      loading = false;
    }
  }

  async function fetchEmployees() {
    try {
      const result = await pb.collection("users").getFullList({
        filter: 'userType="employee" || userType="emp"',
        sort: "name",
      });
      employees = result.map((u: any) => ({
        id: u.id,
        name: u.name ?? u.email ?? u.id,
      }));
    } catch (e) {
      employees = [];
    }
  }

  onMount(() => {
    fetchTickets();
    fetchEmployees();
  });

  function filteredTickets() {
    return tickets.filter(
      (ticket) =>
        ticket.title.toLowerCase().includes(filter.toLowerCase()) ||
        ticket.status.toLowerCase().includes(filter.toLowerCase()) ||
        ticket.assignedTo.toLowerCase().includes(filter.toLowerCase())
    );
  }

  async function deleteTicket(id: string) {
    if (
      !confirm(
        "Are you sure you want to delete this ticket? This action cannot be undone."
      )
    )
      return;
    try {
      await pb.collection("Tickets").delete(id);
      tickets = tickets.filter((t) => t.id !== id);
    } catch (e) {
      alert("Failed to delete ticket.");
    }
  }

  async function updateAssignedTo(ticketId: string, employeeId: string) {
    try {
      await pb.collection("Tickets").update(ticketId, {
        assignedTo: employeeId,
      });
      tickets = tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              assignedTo:
                employees.find((e) => e.id === employeeId)?.name ??
                "Unassigned",
            }
          : t
      );
    } catch (e) {
      alert("Failed to update assignment.");
    }
  }

  async function updateStatus(ticketId: string, status: string) {
    try {
      await pb.collection("Tickets").update(ticketId, { status });
      tickets = tickets.map((t) => (t.id === ticketId ? { ...t, status } : t));
    } catch (e) {
      alert("Failed to update status.");
    }
  }
</script>

<h1>Tickets</h1>

<div style="margin-bottom: 1em; display: flex; gap: 1em; align-items: center;">
  <input
    type="text"
    placeholder="Search tickets..."
    bind:value={filter}
    style="flex: 1; max-width: 300px;"
  />
</div>

<table
  style="width: 100%; border-collapse: collapse; background: var(--card); border-radius: var(--radius); box-shadow: var(--shadow);"
>
  <thead style="background: var(--muted);">
    <tr>
      <th style="padding: 0.75em; text-align: left;">Title</th>
      <th style="padding: 0.75em; text-align: left;">Status</th>
      <th style="padding: 0.75em; text-align: left;">Assigned To</th>
      <th style="padding: 0.75em; text-align: left;">Niveau</th>
      <th style="padding: 0.75em; text-align: left;">Created</th>
      <th style="padding: 0.75em; text-align: left;">Updated</th>
      <th style="padding: 0.75em; text-align: left;">Actions</th>
    </tr>
  </thead>
  <tbody>
    {#if loading}
      <tr
        ><td colspan="7" style="padding: 1em; text-align: center;"
          >Loading tickets...</td
        ></tr
      >
    {:else if error}
      <tr
        ><td colspan="7" style="padding: 1em; text-align: center; color: red;"
          >{error}</td
        ></tr
      >
    {:else if filteredTickets().length === 0}
      <tr>
        <td
          colspan="7"
          style="padding: 1em; text-align: center; color: var(--muted-foreground);"
          >No tickets found.</td
        >
      </tr>
    {:else}
      {#each filteredTickets() as ticket}
        <tr style="border-bottom: 1px solid var(--border);">
          <td style="padding: 0.75em;">{ticket.title}</td>
          <td style="padding: 0.75em;">
            <select
              value={ticket.status}
              on:change={(e) => updateStatus(ticket.id, e.target.value)}
              style="padding: 0.25em 0.5em; border-radius: 0.25em;"
            >
              <option value="Ouvert">Ouvert</option>
              <option value="Assigné">Assigné</option>
              <option value="En cours de résolution"
                >En cours de résolution</option
              >
              <option value="Résolu">Résolu</option>
              <option value="Réouvert">Réouvert</option>
              <option value="Vérifié">Vérifié</option>
              <option value="Fermé">Fermé</option>
              <option value="Ne peut être reproduit"
                >Ne peut être reproduit</option
              >
            </select>
          </td>
          <td style="padding: 0.75em;">
            <select
              value={employees.find((e) => e.name === ticket.assignedTo)?.id ||
                ""}
              on:change={(e) => updateAssignedTo(ticket.id, e.target.value)}
              style="padding: 0.25em 0.5em; border-radius: 0.25em;"
            >
              <option value="">Unassigned</option>
              {#each employees as emp}
                <option value={emp.id}>{emp.name}</option>
              {/each}
            </select>
          </td>
          <td style="padding: 0.75em;">
            {ticket.niveau
              ? ticket.niveau.charAt(0).toUpperCase() + ticket.niveau.slice(1)
              : "Non spécifié"}
          </td>
          <td style="padding: 0.75em;"
            >{new Date(ticket.created).toLocaleDateString()}</td
          >
          <td style="padding: 0.75em;"
            >{new Date(ticket.updated).toLocaleDateString()}</td
          >
          <td style="padding: 0.75em;">
            <button
              data-variant="destructive"
              on:click={() => deleteTicket(ticket.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      {/each}
    {/if}
  </tbody>
</table>

<style>
  table th,
  table td {
    font-size: 0.95em;
  }
  .badge-primary {
    background: var(--primary);
    color: var(--primary-foreground);
    padding: 0.25em 0.75em;
    border-radius: 0.5em;
  }
  .badge-secondary {
    background: var(--secondary);
    color: var(--secondary-foreground);
    padding: 0.25em 0.75em;
    border-radius: 0.5em;
  }
  .badge-outline {
    border: 1px solid var(--border);
    color: var(--primary);
    padding: 0.25em 0.75em;
    border-radius: 0.5em;
    background: transparent;
  }
</style>
