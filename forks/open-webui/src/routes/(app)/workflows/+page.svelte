<script lang="ts">
	import { onMount } from 'svelte';
	import { WEBUI_BASE_URL } from '$lib/constants';

	let n8nUrl = "/n8n/";
</script>

<div class="w-full h-full flex flex-col bg-gray-950">
	<iframe
		title="n8n Workflows"
		src={n8nUrl}
		class="w-full h-full border-none"
		allow="clipboard-read; clipboard-write"
	></iframe>
</div>
