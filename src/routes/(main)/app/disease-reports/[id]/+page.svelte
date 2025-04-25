<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { getDiseaseReportHandler } from '$lib/handler/diseases/get-disease-report.handler';
	import { GenderEnum } from '$lib/models/common/common.types';
	import type { DiseaseReportGet, DiseaseReportPatch } from '$lib/models/disease/disease.schema';
	import { Routes } from '$lib/models/navigation/routes';
	import { ArrowLeft, Mars, Trash, Venus } from '@lucide/svelte';
	import { format } from 'date-fns';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import DiseaseReportDetails from './DiseaseReportDetails.svelte';
	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle
	} from '$lib/components/ui/sheet';
	import DiseaseReportForm, {
		type DiseaseReportDataForm,
		DiseaseReportMode
	} from '../create/DiseaseReportForm.svelte';
	import { updateDiseaseReportHandler } from '$lib/handler/diseases/update-disease-report.handler';
	import {
		AlertDialog,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogTitle
	} from '$lib/components/ui/alert-dialog';
	import { deleteDiseaseReportHandler } from '$lib/handler/diseases/delete-disease-report.handler';

	let maleAvatar = 'https://avatar.iran.liara.run/public/21';
	let femaleAvatar = 'https://avatar.iran.liara.run/public/67';

	let loading = $state(false);
	let deleteDiseaseReportAlertDialogOpen = $state(false);

	let id = page.params.id;
	let diseaseReport = $state<DiseaseReportGet | null>(null);
	let patient = $derived(diseaseReport?.patient);
	let avatar = $derived(patient?.gender === 'male' ? maleAvatar : femaleAvatar);

	let updateReportSheetOpen = $state(false);
	let diseaseReportData = $state<DiseaseReportDataForm>({} as DiseaseReportDataForm);

	onMount(async () => {
		await requestGetDiseaseReport();
	});

	async function requestGetDiseaseReport() {
		loading = true;
		try {
			diseaseReport = await getDiseaseReportHandler(id);
			diseaseReportData = {
				patient_id: diseaseReport.patient_id,
				disease_type: diseaseReport.disease_type,
				icd_code: diseaseReport.icd_code,
				mode_of_transmission: diseaseReport.mode_of_transmission,
				date_diagnosed: diseaseReport.date_diagnosed,
				date_reported: diseaseReport.date_reported,
				remarks: diseaseReport.remarks ?? ''
			};
		} catch (error) {
			toast.error('Failed to fetch disease report');
			console.error(error);
		} finally {
			loading = false;
		}
	}

	function handleBack() {
		goto(Routes.DiseaseReports);
	}

	function toggleDeleteDiseaseReportAlertDialog() {
		deleteDiseaseReportAlertDialogOpen = !deleteDiseaseReportAlertDialogOpen;
	}

	function toggleUpdateReportSheet() {
		updateReportSheetOpen = !updateReportSheetOpen;
	}

	async function handleUpdateReport() {
		const toastId = toast.loading('Updating disease report...');
		try {
			const payload: DiseaseReportPatch = diseaseReportData;
			const result = await updateDiseaseReportHandler(id, payload);
			diseaseReport = result;
			toast.success('Disease report updated successfully', { id: toastId });
		} catch (error) {
			toast.error('Failed to update disease report', { id: toastId });
			console.error(error);
		} finally {
			toggleUpdateReportSheet();
		}
	}

	async function handleDeleteDiseaseReport() {
		const toastId = toast.loading('Deleting disease report...');
		try {
			await deleteDiseaseReportHandler(id);
			toast.success('Disease report deleted successfully', { id: toastId });
			goto(Routes.DiseaseReports);
		} catch (error) {
			toast.error('Failed to delete disease report', { id: toastId });
			console.error(error);
		} finally {
			toggleDeleteDiseaseReportAlertDialog();
		}
	}
</script>

<div class="max-w-[1200px]">
	<div class="flex items-center justify-between mt-4 mb-6">
		<h2 class="text-2xl font-bold">Disease report details</h2>
		<div class="flex gap-2">
			<Button variant="outline" size="sm" on:click={handleBack}>
				<div class="flex items-center gap-1">
					<ArrowLeft class="w-4 h-4" />
					Back
				</div>
			</Button>

			{#if !loading}
				<Button variant="destructive" size="sm" on:click={toggleDeleteDiseaseReportAlertDialog}>
					<div class="flex items-center gap-1">
						<Trash class="w-4 h-4" />
						Delete
					</div>
				</Button>
			{/if}
		</div>
	</div>

	{#if loading}
		<div class="flex flex-col gap-2">
			<Skeleton class="w-full h-8 rounded-lg bg-slate-200" />
			<Skeleton class="w-full h-16 rounded-lg bg-slate-200" />
			<Skeleton class="w-full h-32 rounded-lg bg-slate-200" />
		</div>
	{:else}
		<div class="flex flex-col gap-4 border border-gray-200 rounded-lg p-4">
			<div class="rounded-lg bg-slate-100 p-4">
				<div class="flex items-center gap-2">
					<div class="rounded-full overflow-hidden">
						<img
							src={avatar}
							alt="Patient avatar"
							class="w-10 h-10 rounded-full border border-white"
						/>
					</div>

					<div class="flex flex-col gap-1">
						<div class="flex gap-2 items-center">
							<h3 class="text-sm font-bold">{patient?.firstname} {patient?.lastname}</h3>
							<Separator orientation="vertical" class="h-4 bg-gray-300" />
							<div class="text-xs text-gray-500">
								{format(new Date(patient?.date_of_birth ?? new Date()), 'MMM d, yyyy')}
							</div>
							<Separator orientation="vertical" class="h-4 bg-gray-300" />
							{#if patient?.gender === GenderEnum.MALE}
								<Mars class="w-4 h-4 text-blue-500" />
							{:else}
								<Venus class="w-4 h-4 text-pink-500" />
							{/if}
						</div>
						<div class="flex gap-2 items-center">
							<p class="text-xs text-gray-500">{patient?.address}</p>
							<Separator orientation="vertical" class="h-4 bg-gray-300" />
							<p class="text-xs text-gray-500">{patient?.contact_number ?? 'N/A'}</p>
						</div>
					</div>
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<div class="text-sm font-bold">Disease Report Data</div>
				{#if diseaseReport}
					<DiseaseReportDetails report={diseaseReport} />
				{/if}
			</div>

			<div class="flex flex-col justify-end gap-2">
				<div class="w-full flex justify-end">
					<Button size="sm" on:click={toggleUpdateReportSheet}>Update report</Button>
				</div>
			</div>
		</div>
	{/if}
</div>

<AlertDialog bind:open={deleteDiseaseReportAlertDialogOpen}>
	<AlertDialogContent>
		<AlertDialogTitle>Are you sure?</AlertDialogTitle>
		<AlertDialogDescription>
			Are you sure you want to delete this disease report? The record will be permanently removed
			from the system.
		</AlertDialogDescription>
		<AlertDialogFooter>
			<Button variant="outline" on:click={toggleDeleteDiseaseReportAlertDialog}>No, cancel</Button>
			<Button variant="destructive" on:click={handleDeleteDiseaseReport}>Yes, delete</Button>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>

<Sheet bind:open={updateReportSheetOpen}>
	<SheetContent side="right" class="w-[820px] sm:max-w-full">
		<SheetHeader>
			<SheetTitle>Update disease report</SheetTitle>
			<SheetDescription class="text-xs">
				Update the disease report for {patient?.firstname}
				{patient?.lastname}
			</SheetDescription>
		</SheetHeader>

		<div class="flex flex-col gap-4 my-4">
			<DiseaseReportForm
				bind:diseaseReportData
				mode={DiseaseReportMode.EDIT}
				negativeButtonText="Cancel"
				positiveButtonText="Update report"
				selectedPatient={patient}
				cancel={toggleUpdateReportSheet}
				submit={handleUpdateReport}
			/>
		</div>
	</SheetContent>
</Sheet>
