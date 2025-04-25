<script lang="ts">
	import { DiseaseTypeEnum } from '$lib/models/disease/disease.type';
	import { Dna } from '@lucide/svelte';

	type Props = {
		diseaseType: DiseaseTypeEnum;
	};

	const { diseaseType = $bindable(DiseaseTypeEnum.Dengue) }: Props = $props();

	let diseaseTypeColor = $derived(() => {
		switch (diseaseType) {
			case DiseaseTypeEnum.Dengue:
				return 'border-sky-300 text-sky-700';
			case DiseaseTypeEnum.Flu:
				return 'border-green-300 text-green-700';
			case DiseaseTypeEnum.HIV:
				return 'border-amber-300 text-amber-700';
			case DiseaseTypeEnum.Influenza:
				return 'border-red-300 text-red-700';
			case DiseaseTypeEnum.TB:
				return 'border-violet-300 text-violet-700';
			default:
				return 'border-slate-300 text-slate-700';
		}
	});
</script>

<div
	class="w-fit rounded-md border {diseaseTypeColor()} px-2 py-1 text-xs font-bold flex items-center gap-1"
>
	<Dna class="w-4 h-4" />
	{diseaseType}
</div>
