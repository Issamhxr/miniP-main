<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<!--
<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>
-->
<h1>{data.items[0].name}</h1>
