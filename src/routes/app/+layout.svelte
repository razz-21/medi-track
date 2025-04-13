<script lang="ts">
	import Sidebar from './Sidebar.svelte';

	let { children } = $props();
</script>

<div class="flex bg-gray-50">
	<Sidebar />
	<div class="main-container">
		{@render children()}
	</div>
</div>

<style lang="postcss">
	@reference 'tailwindcss';

	.main-container {
		@apply bg-white w-full m-2 p-4 rounded-lg border-gray-200 border min-h-screen;

		margin-left: 240px;
	}
</style>
