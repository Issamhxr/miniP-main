<script>
	import {
		BxBriefcase,
		BxCog,
		BxGroup,
		BxLeftArrowAlt,
		BxReceipt,
		BxRightArrowAlt,
		BxUser
	} from 'svelte-boxicons';
	import SidebarItem from './SidebarItem.svelte';
	let closed = $state(true);
</script>

<aside class:closed>
	<div class="sidebar-header">
		<button class="collapse-button" onclick={() => (closed = !closed)}>
			{#if closed}
				<BxRightArrowAlt size="24" color="var(--primary-background)" />
			{:else}
				<BxLeftArrowAlt size="24" color="var(--primary-background)" />
			{/if}
		</button>
	</div>

	<SidebarItem label="Tickets" {closed} selected={false} link="/admin/tickets">
		<BxReceipt />
	</SidebarItem>

	<SidebarItem label="Services" {closed} selected={false} link="/admin/services">
		<BxBriefcase />
	</SidebarItem>

	<SidebarItem label="Employees" {closed} selected={false} link="/admin/employees">
		<BxGroup />
	</SidebarItem>

	<SidebarItem label="Clients" {closed} selected={false} link="/admin/clients">
		<BxUser />
	</SidebarItem>

	<SidebarItem label="Settings" {closed} selected={false} link="/admin/settings">
		<BxCog />
	</SidebarItem>
</aside>

<style>
	button {
		cursor: pointer;
		width: 3em;
		border: 1px solid var(--border);
		background-color: var(--sidebar-background);
		border-radius: 0.375rem;
		cursor: pointer;
		padding: 0.5rem 1rem;
		display: grid;
		justify-content: center;
		box-shadow: var(--ring-offset-shadow, 0 0 #0000), var(--ring-shadow, 0 0 #0000), var(--shadow);
	}

	button:hover {
		background-color: var(--muted);
	}
	.sidebar-header {
		width: 100%;
	}

	aside {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5em;
		position: relative;
		left: 0;
		top: 0;
		padding: 0.5em;
		transition: all 0.3s;
		height: 100vh;
		width: 250px;
		background-color: var(--sidebar-background);
		color: var(--sidebar-foreground);
		border: 1px solid var(--border);
		overflow-y: auto;
		overflow-x: hidden;
	}

	.closed {
		width: 4.2em;
	}
</style>
