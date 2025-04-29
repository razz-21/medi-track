<script lang="ts">
	import { UserRoundPlus } from '@lucide/svelte';

	let { title, value, icon } = $props();
</script>

<div class="border-1 border-gray-200 rounded-md px-4 py-3 flex flex-col gap-2 w-full">
	<div class="flex items-center gap-2">
		{@render icon?.()}
		<div class="text-xs text-gray-400">{title}</div>
	</div>

	<div class="text-lg font-bold">{value}</div>
</div>
