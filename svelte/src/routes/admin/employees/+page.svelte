<script lang="ts">
  import pb from "$lib/pb";
  import { onMount } from "svelte";

  interface Employee {
    id: string;
    name: string;
    email: string;
    userType?: string;
    created: string;
    status?: string;
    verify?: string;
  }

  let employees: Employee[] = [];
  let filter = "";
  let loading = true;
  let error = "";
  let showAddModal = false;
  let newEmployee = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "employee",
    status: "libre",
  };
  let addError = "";

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
          status: u.status ?? "libre",
          verify: u.verify ?? "non verified",
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
          employee.userType.toLowerCase().includes(filter.toLowerCase())) ||
        (employee.status &&
          employee.status.toLowerCase().includes(filter.toLowerCase()))
    );
  }

  async function addEmployee() {
    addError = "";
    if (newEmployee.password !== newEmployee.confirmPassword) {
      addError = "Passwords do not match.";
      return;
    }
    try {
      await pb.collection("users").create({
        name: newEmployee.name,
        email: newEmployee.email,
        password: newEmployee.password,
        passwordConfirm: newEmployee.confirmPassword,
        userType: newEmployee.userType,
        status: newEmployee.status,
        emailVisibility: true,
      });
      showAddModal = false;
      newEmployee = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        userType: "employee",
        status: "libre",
      };
      await fetchEmployees();
    } catch (e) {
      addError = "Failed to add employee.";
    }
  }

  async function deleteEmployee(id: string) {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    try {
      await pb.collection("users").delete(id);
      await fetchEmployees();
    } catch (e) {
      alert("Failed to delete employee.");
    }
  }
</script>

<h1>Employees</h1>
<div style="margin-bottom: 1em; display: flex; gap: 1em; align-items: center;">
  <input
    type="text"
    placeholder="Search employees..."
    bind:value={filter}
    style="padding: 0.5em; border-radius: 0.25em; border: 1px solid #ccc;"
  />
  <button
    on:click={() => (showAddModal = true)}
    style="padding: 0.5em 1em; border-radius: 0.25em; background: var(--primary); color: var(--primary-foreground); border: none;"
  >
    Add Employee
  </button>
</div>

{#if showAddModal}
  <div
    style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 1000;"
  >
    <form
      on:submit|preventDefault={addEmployee}
      style="background: white; padding: 2em; border-radius: 0.5em; min-width: 300px; display: flex; flex-direction: column; gap: 1em;"
    >
      <h2>Add Employee</h2>
      <input
        type="text"
        placeholder="Name"
        bind:value={newEmployee.name}
        required
      />
      <input
        type="email"
        placeholder="Email"
        bind:value={newEmployee.email}
        required
      />
      <input
        type="password"
        placeholder="Password"
        bind:value={newEmployee.password}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        bind:value={newEmployee.confirmPassword}
        required
      />
      <select bind:value={newEmployee.userType} required>
        <option value="employee">Employee</option>
        <option value="emp">Emp</option>
      </select>
      <select bind:value={newEmployee.status} required>
        <option value="libre">Libre</option>
        <option value="non libre">Non libre</option>
        <option value="malade">Malade</option>
      </select>
      {#if addError}
        <div style="color: red">{addError}</div>
      {/if}
      <div style="display: flex; gap: 1em; justify-content: flex-end;">
        <button type="button" on:click={() => (showAddModal = false)}
          >Cancel</button
        >
        <button
          type="submit"
          style="background: var(--primary); color: var(--primary-foreground); border: none; padding: 0.5em 1em; border-radius: 0.25em;"
          >Add</button
        >
      </div>
    </form>
  </div>
{/if}

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
        <th style="padding: 0.75em;">Status</th>
        <th style="padding: 0.75em;">Created</th>
        <th style="padding: 0.75em; text-align: center;">Actions</th>
        <th style="padding: 0.75em;">Verify</th>
      </tr>
    </thead>
    <tbody>
      {#if filteredEmployees().length === 0}
        <tr>
          <td colspan="7" style="text-align: center; padding: 1em;"
            >No employees found.</td
          >
        </tr>
      {:else}
        {#each filteredEmployees() as employee}
          <tr style="border-bottom: 1px solid var(--muted);">
            <td
              style="padding: 0.75em; vertical-align: middle; text-align: center;"
              >{employee.name}</td
            >
            <td
              style="padding: 0.75em; vertical-align: middle; text-align: center;"
              >{employee.email}</td
            >
            <td
              style="padding: 0.75em; vertical-align: middle; text-align: center;"
              >{employee.userType}</td
            >
            <td
              style="padding: 0.75em; vertical-align: middle; text-align: center;"
              >{employee.status}</td
            >
            <td
              style="padding: 0.75em; vertical-align: middle; text-align: center;"
              >{new Date(employee.created).toLocaleDateString()}</td
            >
            <td
              style="padding: 0.75em; vertical-align: middle; text-align: center;"
            >
              <button
                on:click={() => deleteEmployee(employee.id)}
                style="background: #e74c3c; color: white; border: none; border-radius: 0.25em; padding: 0.25em 0.75em; cursor: pointer; margin-right: 0.5em;"
              >
                Delete
              </button>
              {#if employee.email !== "Hidden"}
                <button
                  on:click={() => window.open(`mailto:${employee.email}`)}
                  style="background: #3498db; color: white; border: none; border-radius: 0.25em; padding: 0.25em 0.75em; cursor: pointer;"
                >
                  Send Mail
                </button>
              {/if}
            </td>
            <td
              style="padding: 0.75em; vertical-align: middle; text-align: center;"
            >
              <button
              style="background: {employee.verify === 'non verified' ? '#2ecc71' : '#e67e22'}; color: white; border: none; border-radius: 0.25em; padding: 0.25em 0.75em; cursor: pointer;"
              on:click={async () => {
                try {
                const newVerify = employee.verify === "non verified" ? "verified" : "non verified";
                await pb.collection("users").update(employee.id, { verify: newVerify });
                await fetchEmployees();
                } catch (e) {
                alert("Failed to update verify status.");
                }
              }}
              >
              {employee.verify === "non verified" ? "Verified" : "Non Verified"}
              </button>
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
{/if}
