<script lang="ts">
  import pb from "$lib/pb";
  import { onMount } from "svelte";

  interface Employee {
    id: string;
    name: string;
    email: string;
    userType?: string;
    created: string;
  }

  let employees: Employee[] = [];
  let filter = "";
  let loading = true;
  let error = "";

  async function fetchEmployees() {
    loading = true;
    error = "";
    try {
      // Use the correct API endpoint for PocketBase users collection
      const result = await pb
        .collection("users")
        .getFullList({ sort: "-created" });
      // TEMP: Show all users for testing
      console.log("Fetched users:", result); // Debug log
      // Only show users with userType 'employee' or 'emp'
      employees = result
        .filter((u: any) => {
          if (!u.userType) return false;
          const type = u.userType.toLowerCase();
          return type === "employee" || type === "emp";
        })
        .map((u: any) => ({
          id: u.id,
          name: u.name ?? "",
          email: u.emailVisibility === false ? "Hidden" : (u.email ?? ""),
          userType: u.userType ?? "",
          created: u.created ?? "",
        }));
    } catch (e) {
      error = "Failed to fetch employees.";
      employees = [];
    } finally {
      loading = false;
    }
  }

  onMount(fetchEmployees);

  function filteredEmployees() {
    return employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(filter.toLowerCase()) ||
        employee.email.toLowerCase().includes(filter.toLowerCase()) ||
        (employee.userType &&
          employee.userType.toLowerCase().includes(filter.toLowerCase()))
    );
  }
</script>

<div style="margin-bottom: 1em; display: flex; gap: 1em; align-items: center;">
  <input
    type="text"
    placeholder="Search employees..."
    bind:value={filter}
    style="padding: 0.5em; border-radius: 0.25em; border: 1px solid #ccc;"
  />
</div>

{#if loading}
  <p>Loading employees...</p>
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
        <th style="padding: 0.75em;">Type</th>
        <th style="padding: 0.75em;">Created</th>
      </tr>
    </thead>
    <tbody>
      {#if filteredEmployees().length === 0}
        <tr>
          <td colspan="4" style="text-align: center; padding: 1em;"
            >No employees found.</td
          >
        </tr>
      {:else}
        {#each filteredEmployees() as employee}
          <tr style="border-bottom: 1px solid var(--muted);">
            <td style="padding: 0.75em;">{employee.name}</td>
            <td style="padding: 0.75em;">{employee.email}</td>
            <td style="padding: 0.75em;">{employee.userType}</td>
            <td style="padding: 0.75em;"
              >{new Date(employee.created).toLocaleDateString()}</td
            >
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
{/if}
