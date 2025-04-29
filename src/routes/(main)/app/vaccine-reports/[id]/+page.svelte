<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import type { VaccineReportGet, VaccineReportPatch } from '$lib/models/vaccine/vaccine.schema';
	import { ArrowLeft, Mars, Trash, Venus } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import VaccineDetails from './VaccineDetails.svelte';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { Routes } from '$lib/models/navigation/routes';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { getVaccineReport } from '$lib/handler/vaccines/get-vaccine-report.handler';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { format } from 'date-fns';
	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle
	} from '$lib/components/ui/sheet';
	import VaccineInformationBaseForm, {
		type VaccineInformationBaseDataForm
	} from '../create/VaccineInformationBaseForm.svelte';
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
	import { vaccineDefinitions, VaccineTypeEnum } from '$lib/models/vaccine/vaccine.type';
	import VaccineInformationCovid19Form, {
		type VaccineInformationCovid19DataForm
	} from '../create/VaccineInformationCovid19Form.svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { updateVaccineReportHandler } from '$lib/handler/vaccines/update-vaccine-report.handler';
	import { deleteVaccineReportHandler } from '$lib/handler/vaccines/delete-vaccine-report.handler';
	import {
		AlertDialog,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogTitle
	} from '$lib/components/ui/alert-dialog';
	import { GenderEnum } from '$lib/models/common/common.types';

	let maleAvatar = 'https://avatar.iran.liara.run/public/21';
	let femaleAvatar = 'https://avatar.iran.liara.run/public/67';

	let id = page.params.id;
	let vaccineReport = $state<VaccineReportGet | null>(null);
	let selectedVaccineType = $derived(vaccineReport?.type ?? null);
	let patient = $derived(vaccineReport?.patient);
	let avatar = $derived(patient?.gender === 'male' ? maleAvatar : femaleAvatar);
	let loading = $state(true);

	let addNewRecordSheetOpen = $state(false);
	let vaccineInformationBaseDataForm = $state<VaccineInformationBaseDataForm>(
		{} as VaccineInformationBaseDataForm
	);
	let vaccineInformationCovid19DataForm = $state<VaccineInformationCovid19DataForm>(
		{} as VaccineInformationCovid19DataForm
	);
	let isAddNewRecordFormInvalid = $state(false);

	let deleteVaccineReportAlertDialogOpen = $state(false);

	onMount(async () => {
		await requestGetVaccineReport();
	});

	function toggleAddNewRecordSheet() {
		if (vaccineReport?.type !== VaccineTypeEnum.Covid19) {
			vaccineInformationBaseDataForm = {
				weight: patient?.weight ?? 0,
				height: patient?.height ?? 0
			} as VaccineInformationBaseDataForm;
		}

		addNewRecordSheetOpen = !addNewRecordSheetOpen;
	}

	function toggleDeleteVaccineReportAlertDialog() {
		deleteVaccineReportAlertDialogOpen = !deleteVaccineReportAlertDialogOpen;
	}

	async function requestGetVaccineReport() {
		loading = true;
		try {
			vaccineReport = await getVaccineReport(id);
		} catch (error) {
			toast.error('Failed to fetch vaccine report');
			console.error(error);
		} finally {
			loading = false;
		}
	}

	function handleBack() {
		goto(Routes.VaccineReports);
	}

	async function handleAddNewRecord() {
		const toastId = toast.loading('Adding new record...');
		try {
			let newDetail = {};
			if (selectedVaccineType === VaccineTypeEnum.Covid19) {
				newDetail = {
					_id: uuidv4(),
					...vaccineInformationCovid19DataForm
				};
			} else {
				newDetail = {
					_id: uuidv4(),
					...vaccineInformationBaseDataForm
				};
			}

			const payload = {
				details: [...(vaccineReport?.details ?? []), newDetail] as VaccineReportPatch['details']
			};

			const result = await updateVaccineReportHandler(id, payload);
			vaccineReport = {
				...result,
				patient: patient
			};
			toast.success('New record added', { id: toastId });
		} catch (error) {
			console.error(error);
			toast.error('Failed to add new record', { id: toastId });
		} finally {
			toggleAddNewRecordSheet();
		}
	}

	async function handleDeleteRecord(recordId: string) {
		const toastId = toast.loading('Deleting record...');
		try {
			const vaccineDetais = vaccineReport?.details ?? [];
			const filteredVaccineDetails = vaccineDetais.filter((detail) => detail._id !== recordId);
			const payload = {
				details: filteredVaccineDetails
			} as VaccineReportPatch;

			const result = await updateVaccineReportHandler(id, payload);
			vaccineReport = {
				...result,
				patient: patient
			};
			toast.success('Record deleted', { id: toastId });
		} catch (error) {
			console.error(error);
			toast.error('Failed to delete record', { id: toastId });
		} finally {
			vaccineReport = await getVaccineReport(id);
		}
	}

	async function handleDeleteVaccineReport() {
		const toastId = toast.loading('Deleting vaccine report...');
		try {
			await deleteVaccineReportHandler(id);
			toast.success('Vaccine report deleted', { id: toastId });
			goto(Routes.VaccineReports);
		} catch (error) {
			console.error(error);
			toast.error('Failed to delete vaccine report', { id: toastId });
		}
	}
</script>

<div class="max-w-[1200px]">
	<div class="flex items-center justify-between mt-4 mb-6">
		<h2 class="text-2xl font-bold">Vaccine report details</h2>
		<div class="flex gap-2">
			<Button variant="outline" size="sm" on:click={handleBack}>
				<div class="flex items-center gap-1">
					<ArrowLeft class="w-4 h-4" />
					Back
				</div>
			</Button>

			{#if !loading}
				<Button variant="destructive" size="sm" on:click={toggleDeleteVaccineReportAlertDialog}>
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
				<div class="text-sm font-bold">Vaccination Data</div>
				{#if vaccineReport}
					<VaccineDetails
						{vaccineReport}
						addNewRecord={toggleAddNewRecordSheet}
						deleteRecord={handleDeleteRecord}
					/>
				{/if}
			</div>
		</div>
	{/if}
</div>

<AlertDialog bind:open={deleteVaccineReportAlertDialogOpen}>
	<AlertDialogContent>
		<AlertDialogTitle>Are you sure?</AlertDialogTitle>
		<AlertDialogDescription>
			Are you sure you want to delete this vaccine report? The record will be permanently removed
			from the system.
		</AlertDialogDescription>
		<AlertDialogFooter>
			<Button variant="outline" on:click={toggleDeleteVaccineReportAlertDialog}>No, cancel</Button>
			<Button variant="destructive" on:click={handleDeleteVaccineReport}>Yes, delete</Button>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>

<Sheet bind:open={addNewRecordSheetOpen}>
	<SheetContent side="right" class="w-[820px] sm:max-w-full">
		<SheetHeader>
			<SheetTitle>Add new vaccine record</SheetTitle>
			<SheetDescription class="text-xs">
				Add a new vaccine record to the vaccine report
			</SheetDescription>
		</SheetHeader>

		<div class="flex flex-col gap-4 my-4">
			<div class="flex gap-2 mb-2">
				{#if selectedVaccineType}
					<div class="flex flex-col gap-2">
						<h2 class="text-xs font-medium mb-2">
							Vaccine type <span class="text-red-500">*</span>
						</h2>
						<RadioGroup value={selectedVaccineType}>
							<div class="flex gap-4">
								<div
									class="w-6/6 border border-slate-300 rounded-md p-4 cursor-pointer min-h-32 bg-slate-100"
								>
									<div class="relative h-full flex items-center justify-center gap-2">
										<div class="absolute -top-4 -right-1">
											<RadioGroupItem value={selectedVaccineType} />
										</div>
										<div class="text-center">
											<div class="text-xl font-bold mb-2">{selectedVaccineType}</div>
											<p class="text-xs text-gray-500">{vaccineDefinitions[selectedVaccineType]}</p>
										</div>
									</div>
								</div>
							</div>
						</RadioGroup>
					</div>
				{/if}
			</div>

			<hr class="border-gray-200 border-dashed" />

			{#if selectedVaccineType === VaccineTypeEnum.Covid19}
				<VaccineInformationCovid19Form
					bind:covid19InformationData={vaccineInformationCovid19DataForm}
					bind:isFormInvalid={isAddNewRecordFormInvalid}
				/>
			{:else}
				<VaccineInformationBaseForm
					bind:vaccineInformationData={vaccineInformationBaseDataForm}
					bind:isFormInvalid={isAddNewRecordFormInvalid}
				/>
			{/if}
		</div>

		<div class="flex justify-end gap-2 mt-4">
			<Button variant="outline" size="sm" on:click={toggleAddNewRecordSheet}>Cancel</Button>
			<Button
				variant="default"
				size="sm"
				disabled={isAddNewRecordFormInvalid}
				on:click={handleAddNewRecord}>Add record</Button
			>
		</div>
	</SheetContent>
</Sheet>
