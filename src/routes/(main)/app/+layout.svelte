<script lang="ts">
	import Sidebar from './Sidebar.svelte';

	let { children } = $props();
</script>

<div class="flex bg-slate-50">
	<Sidebar />
	<div class="main-container">
		{@render children()}
	</div>
</div>

<style lang="postcss">
	@reference 'tailwindcss';

	.main-container {
		@apply bg-white w-full m-2 p-6 rounded-lg border-gray-200 border;

		margin-left: 280px;
		min-height: calc(100vh - 1rem);
	}
</style>
