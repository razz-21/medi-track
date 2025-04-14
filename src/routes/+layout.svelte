<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let { children } = $props();

	onMount(() => {
		goto('/login');
	});
</script>

{@render children()}

<Toaster />

<svelte:head>
	<title>Meditrack</title>
</svelte:head>
