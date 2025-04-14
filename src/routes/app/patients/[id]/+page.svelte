<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Pencil, ArrowLeft } from '@lucide/svelte';
	import PatientDetailsCard from './PatientDetailsCard.svelte';
	import { goto } from '$app/navigation';
	import { Routes } from '$lib/models/navigation/routes';
	import PatientVaccinesTable from './PatientVaccinesTable.svelte';
	import PatientDiseasesTable from './PatientDiseasesTable.svelte';
	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle,
		SheetTrigger
	} from '$lib/components/ui/sheet';
	import SheetFooter from '$lib/components/ui/sheet/sheet-footer.svelte';
	import PatientForm from '../PatientForm.svelte';

	function handleBack() {
		goto(Routes.Patients);
	}
</script>

<div class="max-w-[1440px]">
	<div class="flex items-center justify-between mt-4 mb-6">
		<div>
			<h2 class="text-2xl font-bold">Patient details</h2>
		</div>

		<div class="flex items-center gap-2">
			<Sheet>
				<SheetTrigger asChild let:builder>
					<Button size="sm" variant="outline" builders={[builder]}>
						<div class="flex items-center gap-1">
							<Pencil class="w-4 h-4" />
							Edit details
						</div>
					</Button>
				</SheetTrigger>
				<SheetContent side="right">
					<SheetHeader>
						<SheetTitle>Edit patient details</SheetTitle>
						<SheetDescription class="text-xs">
							Make changes to the patient's details here. Click save when you're done.
						</SheetDescription>
					</SheetHeader>

					<div class="flex flex-col gap-4 mt-6">
						<PatientForm />
					</div>
				</SheetContent>
			</Sheet>

			<Button size="sm" variant="outline" on:click={handleBack}>
				<div class="flex items-center gap-1">
					<ArrowLeft class="w-4 h-4" />
					Back
				</div>
			</Button>
		</div>
	</div>

	<div class="flex flex-col gap-8">
		<div class="flex gap-4">
			<div class="w-8/12">
				<PatientDetailsCard />
			</div>
		</div>

		<div class="flex gap-4">
			<div class="w-1/2">
				<PatientVaccinesTable />
			</div>

			<div class="w-1/2">
				<PatientDiseasesTable />
			</div>
		</div>
	</div>
</div>
