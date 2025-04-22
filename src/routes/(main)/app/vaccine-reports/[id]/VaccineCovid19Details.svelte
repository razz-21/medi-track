<script lang="ts" module>
	import type { Covid19VaccineDetails } from '$lib/models/vaccine/vaccine.schema';
	import { format } from 'date-fns';

	type Props = {
		details: Covid19VaccineDetails;
	};
</script>

<script lang="ts">
	let { details }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	<div class="flex gap-4">
		<div class="w-1/3 flex flex-col">
			<div class="text-xs font-bold text-gray-500">Dose</div>
			<div class="text-sm font-medium">{details.dose}</div>
		</div>

		<div class="w-1/3 flex flex-col">
			<div class="text-xs font-bold text-gray-500">Brand</div>
			<div class="text-sm font-medium">{details.brand}</div>
		</div>

		<div class="w-1/3 flex flex-col">
			<div class="text-xs font-bold text-gray-500">Lot Number</div>
			<div class="text-sm font-medium">{details.lot_number}</div>
		</div>
	</div>

	<div class="flex gap-4">
		<div class="w-1/3 flex flex-col">
			<div class="text-xs font-bold text-gray-500">Vaccinator</div>
			<div class="text-sm font-medium">{details.vaccinator}</div>
		</div>

		<div class="w-1/3 flex flex-col">
			<div class="text-xs font-bold text-gray-500">Date</div>
			<div class="text-sm font-medium">{format(new Date(details.date), 'MMM d, yyyy')}</div>
		</div>

		<div class="w-1/3 flex flex-col" />
	</div>
</div>
