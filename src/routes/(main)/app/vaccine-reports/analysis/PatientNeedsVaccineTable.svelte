<script lang="ts" module>
	import {
		Table,
		TableHead,
		TableHeader,
		TableRow,
		TableBody,
		TableCell
	} from '$lib/components/ui/table';
	import { VaccineTypeEnum } from '$lib/models/vaccine/vaccine.type';
	import PatientStatusPill from '../../patients/PatientStatusPill.svelte';
	import type { VaccineAnalysis } from '$lib/models/vaccine/vaccine.schema';
	import {
		Select,
		SelectContent,
		SelectInput,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '$lib/components/ui/select';
	import { format } from 'date-fns';

	type Props = {
		vaccineAnalysis: VaccineAnalysis | null;
	};
</script>

<script lang="ts">
	const { vaccineAnalysis = null }: Props = $props();

	let vaccineTypesOptions = $state(Object.values(VaccineTypeEnum));
	let selectedVaccineType = $state({
		label: vaccineTypesOptions[0],
		value: vaccineTypesOptions[0]
	});
	let visiblePatients = $derived(vaccineAnalysis?.[selectedVaccineType.value] ?? []);
</script>

<div class="wrapper">
	<div class="text-lg font-bold mb-2">Residents needs vaccine</div>

	<div class="flex mb-2 max-w-sm">
		<Select bind:selected={selectedVaccineType}>
			<SelectTrigger>
				<SelectValue placeholder="Select Vaccine Type" />
			</SelectTrigger>
			<SelectContent>
				{#each vaccineTypesOptions as vaccineType}
					<SelectItem value={vaccineType}>{vaccineType}</SelectItem>
				{/each}
			</SelectContent>
			<SelectInput name="vaccine_type" />
		</Select>
	</div>
	<div class="rounded-md border max-h-[680px] overflow-y-auto">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead class="text-xs font-medium">Patient name</TableHead>
					<TableHead class="text-xs font-medium">Gender</TableHead>
					<TableHead class="text-xs font-medium">Date of birth</TableHead>
					<TableHead class="text-xs font-medium">Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each visiblePatients as patient}
					<TableRow>
						<TableCell>
							{patient.firstname}
							{patient.lastname}
						</TableCell>
						<TableCell>
							{patient.gender}
						</TableCell>
						<TableCell>
							{format(new Date(patient.date_of_birth), 'MM/dd/yyyy')}
						</TableCell>
						<TableCell>
							<PatientStatusPill status={patient.status} />
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
