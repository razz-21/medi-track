<script lang="ts" module>
	import type { VaccineBaseDetails } from '$lib/models/vaccine/vaccine.schema';
	import { format } from 'date-fns';

	type Props = {
		details: VaccineBaseDetails;
	};
</script>

<script lang="ts">
	let { details }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	<div class="flex gap-4">
		<div class="w-1/3 flex flex-col">
			<div class="text-xs font-bold text-gray-500">Dose</div>
			<div class="text-xs font-medium">{details.dose}</div>
		</div>

		<div class="w-1/3 flex flex-col">
			<div class="text-xs font-bold text-gray-500">Immunization Date</div>
			<div class="text-xs font-medium">
				{format(new Date(details.immunization_date), 'MMM d, yyyy')}
			</div>
		</div>

		<div class="w-1/3 flex flex-col">
			<div class="text-xs font-bold text-gray-500">Weight</div>
			<div class="text-xs font-medium">{details.weight} kg</div>
		</div>
	</div>

	<div class="flex gap-4">
		<div class="w-1/3 flex flex-col">
			<div class="text-xs font-bold text-gray-500">Height</div>
			<div class="text-xs font-medium">{details.height} cm</div>
		</div>

		<div class="w-1/3 flex flex-col">
			<div class="text-xs font-bold text-gray-500">Remarks</div>
			<div class="text-xs font-medium">{details.remarks}</div>
		</div>

		<div class="w-1/3 flex flex-col" />
	</div>
</div>
