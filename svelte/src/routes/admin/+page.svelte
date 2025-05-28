<script lang="ts">
  export let form;
</script>

<div class="login-container">
  <form method="POST" class="login-form" autocomplete="off">
    <h2>Admin Login</h2>
    <input
      type="email"
      name="email"
      placeholder="Admin Email"
      required
      autocomplete="username"
    />
    <input
      type="password"
      name="password"
      placeholder="Password"
      required
      autocomplete="current-password"
    />
    {#if form?.error && typeof form.error === "string"}
      <div class="error">{form.error}</div>
    {/if}
    <button type="submit">Login</button>
  </form>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f6f6f6;
  }
  .login-form {
    background: white;
    padding: 2.5em 2em 2em 2em;
    border-radius: 0.75em;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
    min-width: 320px;
    display: flex;
    flex-direction: column;
    gap: 1.2em;
  }
  .login-form h2 {
    margin: 0 0 0.5em 0;
    text-align: center;
    color: #2d3a4a;
    font-weight: 600;
  }
  .login-form input {
    padding: 0.7em 1em;
    border-radius: 0.3em;
    border: 1px solid #ccc;
    font-size: 1em;
    outline: none;
    transition: border 0.2s;
  }
  .login-form input:focus {
    border: 1.5px solid #2d3a4a;
  }
  .login-form button {
    background: #2d3a4a;
    color: #fff;
    border: none;
    padding: 0.7em 1em;
    border-radius: 0.3em;
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    margin-top: 0.5em;
    transition: background 0.2s;
  }
  .login-form button:hover {
    background: #1a2330;
  }
  .error {
    color: #e74c3c;
    text-align: center;
    font-size: 0.98em;
    margin-top: -0.5em;
  }
</style>
