<script lang="ts">
	import { browser } from '$app/environment';
	import { preloadCode } from '$app/navigation';
	import { Toaster } from '$lib/components/ui/sonner';
	import { Routes } from '$lib/models/navigation/routes';
	import '../app.css';

	if (browser) {
		preloadCode(Routes.SiteDisease);
		preloadCode(Routes.SiteVaccine);
		preloadCode(Routes.Dashboard);
	}

	let { children } = $props();
</script>

{@render children()}

<Toaster duration={6000} closeButton={true} />

<svelte:head>
	<title>Meditrack</title>
</svelte:head>
