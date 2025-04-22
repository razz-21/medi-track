<script lang="ts">
	import { VaccineTypeEnum } from '$lib/models/vaccine/vaccine.type';
	import { Syringe } from '@lucide/svelte';
	type Props = {
		vaccineType: VaccineTypeEnum;
	};

	const { vaccineType = $bindable(VaccineTypeEnum.BCG) } = $props();
</script>

<div
	class="w-fit rounded-md border border-slate-300 px-2 py-1 text-xs font-bold flex items-center gap-1"
>
	<Syringe class="w-4 h-4" />
	{vaccineType}
</div>
