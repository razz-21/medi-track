<script lang="ts">
	import { VaccineTypeEnum } from '$lib/models/vaccine/vaccine.type';
	import { Syringe } from '@lucide/svelte';
	type Props = {
		vaccineType: VaccineTypeEnum;
	};

	const { vaccineType = $bindable(VaccineTypeEnum.BCG) } = $props();

	let vaccineTypeColor = $derived(() => {
		switch (vaccineType) {
			case VaccineTypeEnum.BCG:
				return 'border-sky-300 text-sky-700';
			case VaccineTypeEnum.Covid19:
				return 'border-green-300 text-green-700';
			case VaccineTypeEnum.HepaB1:
				return 'border-amber-300 text-amber-700';
			case VaccineTypeEnum.MMR:
				return 'border-red-300 text-red-700';
			case VaccineTypeEnum.PCV:
				return 'border-blue-300 text-blue-700';
			case VaccineTypeEnum.Polio:
				return 'border-purple-300 text-purple-700';
			default:
				return 'border-slate-300 text-slate-700';
		}
	});
</script>

<div
	class="w-fit rounded-md border {vaccineTypeColor()} px-2 py-1 text-xs font-bold flex items-center gap-1"
>
	<Syringe class="w-4 h-4" />
	{vaccineType}
</div>
