<script lang="ts" module>
	type Props = {
		status: string;
	};
</script>

<script lang="ts">
	const { status }: Props = $props();

	let color = $derived(() => {
		if (status === 'active') return 'bg-emerald-100 text-emerald-700';
		if (status === 'deleted') return 'bg-rose-100 text-rose-700';
		if (status === 'inactive') return 'bg-yellow-100 text-yellow-700';
		return 'bg-gray-100 text-gray-600';
	});
</script>

<div class="rounded-sm px-3 py-1 w-fit text-xs capitalize {color()}">
	{status}
</div>
