<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Routes } from '$lib/models/navigation/routes';

	type Props = {
		children: Snippet;
	};

	const { children }: Props = $props();

	let pathname = $derived(page.url.pathname);

	function navigate(url: string) {
		goto(url);
	}
</script>

<div class="relative">
	<div class="navbar">
		<div
			role="button"
			tabindex="0"
			class="navbar-item"
			class:active={pathname === '/app/vaccine-reports'}
			onclick={() => navigate(Routes.VaccineReports)}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					navigate(Routes.VaccineReports);
				}
			}}
		>
			Reports
		</div>
		<div
			role="button"
			tabindex="0"
			class="navbar-item"
			class:active={pathname === '/app/vaccine-reports/analysis'}
			onclick={() => navigate(Routes.VaccineReportsAnalysis)}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					navigate(Routes.VaccineReportsAnalysis);
				}
			}}
		>
			Analysis
		</div>
	</div>
	{@render children()}
</div>

<style lang="postcss">
	@reference 'tailwindcss';

	.navbar {
		@apply flex items-center gap-1 p-2 border border-gray-200 rounded-lg;
		margin: -0.5rem -0.5rem 1rem -0.5rem;
	}

	.navbar-item {
		@apply py-1 px-3 text-sm cursor-pointer rounded-lg;
	}

	.navbar-item:hover,
	.navbar-item.active {
		@apply bg-slate-200;
	}
</style>
