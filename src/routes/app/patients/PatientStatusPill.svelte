<script lang="ts" module>
	type Props = {
		status: string;
	};
</script>

<script lang="ts">
	const { status }: Props = $props();

	let color = $derived(() => {
		if (status === 'active') return 'border border-emerald-500 text-emerald-700';
		if (status === 'deleted') return 'border border-rose-500 text-rose-700';
		return 'border border-gray-500 text-gray-600';
	});
</script>

<div class="rounded-sm px-3 py-1 w-fit text-xs capitalize {color()}">
	{status}
</div>
