<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Pencil, ArrowLeft, Trash } from '@lucide/svelte';
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
	import PatientForm, { type PatientFormData } from '../create/PatientForm.svelte';
	import { onMount } from 'svelte';
	import { getPatient } from '$lib/handler/patients/get-patient.handler';
	import { page } from '$app/state';
	import { PatientStatusEnum, type PatientGet } from '$lib/models/patients/patient.type';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { toast } from 'svelte-sonner';
	import { updatePatient } from '$lib/handler/patients/update-patient.handler';
	import {
		AlertDialog,
		AlertDialogTrigger,
		AlertDialogContent,
		AlertDialogHeader,
		AlertDialogTitle,
		AlertDialogDescription,
		AlertDialogFooter
	} from '$lib/components/ui/alert-dialog';
	import { objectDifference } from '$lib/utils/common.util';
	import PatientRelativeCard from './PatientRelativeCard.svelte';
	import PatientDiseaseCases from './PatientDiseaseCases.svelte';
	import PatientVaccineCases from './PatientVaccineCases.svelte';

	let patientId = $state(page.params.id);
	let patient = $state<PatientGet>({} as PatientGet);
	let patientData = $state<PatientFormData>({} as PatientFormData);
	let isPatientActive = $derived(patient?.status === PatientStatusEnum.ACTIVE);
	let isPatientDeleted = $derived(patient?.status === PatientStatusEnum.DELETED);
	let loading = $state(true);
	let sheetPatientFormOpen = $state(false);
	let confirmSetPatientDeleteDialogOpen = $state(false);
	let confirmSetPatientActiveDialogOpen = $state(false);

	$effect(() => {
		if (page.params.id) {
			patientId = page.params.id;
			getPatientData();
		}
	});

	onMount(async () => {
		await getPatientData();
	});

	async function getPatientData() {
		loading = true;
		try {
			patient = await getPatient(patientId);
			const { _id, status, created_at, updated_at, ...rest } = patient;

			patientData = rest as PatientFormData;
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}

	async function handleUpdatePatient() {
		const toastId = toast.loading('Updating patient details...');
		sheetPatientFormOpen = false;
		try {
			const updatePatientPayload = objectDifference(patientData, patient);
			const result = await updatePatient(patientId, updatePatientPayload);
			toast.success('Patient details updated successfully', { id: toastId });
			patient = result;
		} catch (error) {
			toast.error('Failed to update patient details', { id: toastId });
			console.error(error);
		}
	}

	function handleBack() {
		goto(Routes.Patients);
	}

	function handlePatientFormBack() {
		sheetPatientFormOpen = false;
	}

	function handleSetPatientDeleteDialogOpen() {
		confirmSetPatientDeleteDialogOpen = true;
	}

	function handleCancelSetPatientDeleteDialog() {
		confirmSetPatientDeleteDialogOpen = false;
	}

	async function handlePatientDelete() {
		const toastId = toast.loading('Deleting patient...');
		try {
			const payload = {
				status: PatientStatusEnum.DELETED
			};
			confirmSetPatientDeleteDialogOpen = false;
			await updatePatient(patientId, payload);
			toast.success('Patient deleted successfully', { id: toastId });
			patient.status = PatientStatusEnum.DELETED;
		} catch (error) {
			toast.error('Failed to delete patient', { id: toastId });
		}
	}

	function handleSetPatientActiveDialogOpen() {
		confirmSetPatientActiveDialogOpen = true;
	}

	function handleCancelSetPatientActiveDialog() {
		confirmSetPatientActiveDialogOpen = false;
	}

	async function handleSetPatientActive() {
		const toastId = toast.loading('Setting patient as active...');
		try {
			const payload = {
				status: PatientStatusEnum.ACTIVE
			};
			confirmSetPatientActiveDialogOpen = false;
			await updatePatient(patientId, payload);
			toast.success('Patient set as active successfully', { id: toastId });
			patient.status = PatientStatusEnum.ACTIVE;
		} catch (error) {
			toast.error('Failed to set patient as active', { id: toastId });
		}
	}
</script>

{#key patientId}
	<div class="max-w-[1800px]">
		<div class="flex items-center justify-between mt-4 mb-6">
			<div>
				<h2 class="text-2xl font-bold">Resident details</h2>
			</div>

			<div class="flex items-center gap-2">
				{#if loading}
					<Skeleton class="w-32 h-8 bg-slate-200" />
					<Skeleton class="w-32 h-8 bg-slate-200" />
				{:else}
					{#if isPatientActive}
						<AlertDialog bind:open={confirmSetPatientDeleteDialogOpen}>
							<AlertDialogTrigger>
								<Button variant="destructive" size="sm" on:click={handleSetPatientDeleteDialogOpen}>
									<div class="flex items-center gap-2">
										<Trash class="w-4 h-4" />
										Delete
									</div>
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you sure?</AlertDialogTitle>
									<AlertDialogDescription>
										Are you sure you want to delete this patient?
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<Button variant="outline" on:click={handleCancelSetPatientDeleteDialog}
										>No, cancel</Button
									>
									<Button variant="destructive" on:click={handlePatientDelete}>Yes, delete</Button>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					{/if}

					{#if isPatientDeleted}
						<AlertDialog bind:open={confirmSetPatientActiveDialogOpen}>
							<AlertDialogTrigger>
								<Button variant="outline" size="sm" on:click={handleSetPatientActiveDialogOpen}>
									<div class="flex items-center gap-2">
										<Trash class="w-4 h-4" />
										Set as active
									</div>
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you sure?</AlertDialogTitle>
									<AlertDialogDescription>
										Are you sure you want to set this patient as active?
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<Button variant="outline" on:click={handleCancelSetPatientActiveDialog}
										>No, cancel</Button
									>
									<Button variant="outline" on:click={handleSetPatientActive}
										>Yes, set as active</Button
									>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					{/if}

					{#if isPatientActive}
						<Sheet bind:open={sheetPatientFormOpen}>
							<SheetTrigger asChild let:builder>
								<Button size="sm" variant="outline" builders={[builder]}>
									<div class="flex items-center gap-1">
										<Pencil class="w-4 h-4" />
										Edit details
									</div>
								</Button>
							</SheetTrigger>
							<SheetContent side="right" class="w-[1000px] sm:max-w-full">
								<SheetHeader>
									<SheetTitle>Edit resident details</SheetTitle>
									<SheetDescription class="text-xs">
										Make changes to the resident's details here. Click save when you're done.
									</SheetDescription>
								</SheetHeader>

								<div class="flex flex-col gap-4 mt-6">
									<PatientForm
										bind:patientData
										negativeButtonLabel="Back"
										positiveButtonLabel="Update details"
										back={handlePatientFormBack}
										submit={handleUpdatePatient}
									/>
								</div>
							</SheetContent>
						</Sheet>
					{/if}

					<Button size="sm" variant="outline" on:click={handleBack}>
						<div class="flex items-center gap-1">
							<ArrowLeft class="w-4 h-4" />
							Back
						</div>
					</Button>
				{/if}
			</div>
		</div>

		<div class="flex flex-col gap-8">
			<div class="flex gap-4">
				<div class="w-full">
					{#if loading}
						<div class="flex flex-col gap-2">
							<Skeleton class="w-full h-8 bg-slate-200" />
							<Skeleton class="w-full h-12 bg-slate-200" />
							<Skeleton class="w-full h-[200px] bg-slate-200" />
						</div>
					{:else}
						<PatientDetailsCard {patient} />
					{/if}
				</div>
			</div>

			{#if !loading}
				<div class="grid grid-cols-3 gap-4 max-h-[400px]">
					<div class="col-span-1">
						<PatientRelativeCard familyMembers={patient.family_members} />
					</div>

					<div class="col-span-1">
						<PatientDiseaseCases diseaseHistory={patient.disease_history} />
					</div>

					<div class="col-span-1">
						<PatientVaccineCases vaccineHistory={patient.vaccine_history} />
					</div>

					<!-- <div class="w-1/2">
						<PatientDiseasesTable />
					</div> -->
				</div>
			{/if}
		</div>
	</div>
{/key}
