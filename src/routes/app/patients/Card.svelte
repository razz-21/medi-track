<script lang="ts">
	let { title, value, color = 'bg-gray-100' } = $props();
</script>

<div class="border-1 border-gray-200 rounded-md px-4 py-3 flex flex-col gap-2 w-full">
	<div class="flex items-baseline gap-2">
		<div class="w-2 h-2 rounded-full {color}"></div>
		<div class="text-xs text-gray-400">{title}</div>
	</div>

	<div class="text-lg font-medium">{value}</div>
</div>
