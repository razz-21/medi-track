<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let activeRoute = $derived($page.url.pathname);
	let { children } = $props();

	onMount(() => {
		if (!activeRoute.includes('app')) {
			goto('/login');
		}
	});
</script>

{@render children()}

<Toaster duration={6000} closeButton={true} />

<svelte:head>
	<title>Meditrack</title>
</svelte:head>
