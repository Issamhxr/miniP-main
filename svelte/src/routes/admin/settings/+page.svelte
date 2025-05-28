<script lang="ts">
  let email = "";
  let oldPassword = "";
  let newPassword = "";
  let confirmPassword = "";
  let message = "";

  async function updateEmail() {
    // TODO: Call your backend to update email
    message = "Email updated (demo only)";
  }

  async function changePassword() {
    if (newPassword !== confirmPassword) {
      message = "Passwords do not match.";
      return;
    }
    // TODO: Call your backend to change password
    message = "Password changed (demo only)";
  }
</script>

<div class="settings-container">
  <h2>Admin Settings</h2>

  <form on:submit|preventDefault={updateEmail} class="settings-form">
    <label>Email</label>
    <input type="email" bind:value={email} placeholder="New email" required />
    <button type="submit">Update Email</button>
  </form>

  <form on:submit|preventDefault={changePassword} class="settings-form">
    <label>Old Password</label>
    <input type="password" bind:value={oldPassword} required />
    <label>New Password</label>
    <input type="password" bind:value={newPassword} required />
    <label>Confirm New Password</label>
    <input type="password" bind:value={confirmPassword} required />
    <button type="submit">Change Password</button>
  </form>

  {#if message}
    <div class="message">{message}</div>
  {/if}
</div>

<style>
  .settings-container {
    max-width: 400px;
    margin: 2em auto;
    background: #fff;
    padding: 2em;
    border-radius: 0.75em;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  }
  .settings-form {
    display: flex;
    flex-direction: column;
    gap: 0.7em;
    margin-bottom: 1.5em;
  }
  .settings-form label {
    font-weight: 500;
  }
  .settings-form input {
    padding: 0.6em 1em;
    border-radius: 0.3em;
    border: 1px solid #ccc;
    font-size: 1em;
  }
  .settings-form button {
    background: #2d3a4a;
    color: #fff;
    border: none;
    padding: 0.7em 1em;
    border-radius: 0.3em;
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    margin-top: 0.5em;
  }
  .message {
    color: #2d3a4a;
    text-align: center;
    margin-top: 1em;
  }
</style>
