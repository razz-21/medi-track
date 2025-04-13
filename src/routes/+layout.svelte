<script lang="ts">
	import { Toaster } from "$lib/components/ui/sonner";
	import '../app.css';

	let { children } = $props();
</script>

{@render children()}

<Toaster />

<svelte:head>
	<title>Meditrack</title>
</svelte:head>