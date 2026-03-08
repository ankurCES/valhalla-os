<script lang="ts">
	import { onMount } from 'svelte';

	let supersetUrl = "/superset/";
</script>

<div class="w-full h-full flex flex-col bg-gray-950">
	<iframe
		title="Superset Dashboards"
		src={supersetUrl}
		class="w-full h-full border-none"
	></iframe>
</div>
