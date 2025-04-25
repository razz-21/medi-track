<script lang="ts" module>
	import type {
		Covid19VaccineDetails,
		VaccineReportGet,
		VaccineBaseDetails as BaseDetails
	} from '$lib/models/vaccine/vaccine.schema';
	import { VaccineTypeEnum } from '$lib/models/vaccine/vaccine.type';
	import VaccineTypePill from '../VaccineTypePill.svelte';
	import VaccineCovid19Details from './VaccineCovid19Details.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Trash } from '@lucide/svelte';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import {
		AlertDialog,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle,
		AlertDialogTrigger
	} from '$lib/components/ui/alert-dialog';
	import { format } from 'date-fns';
	import VaccineBaseDetails from './VaccineBaseDetails.svelte';

	type Props = {
		vaccineReport: VaccineReportGet;
		activeDeleteRecordId?: string;
		addNewRecord?: () => void;
		deleteRecord?: (id: string) => void;
	};
</script>

<script lang="ts">
	let {
		vaccineReport = $bindable(),
		activeDeleteRecordId = $bindable(),
		addNewRecord,
		deleteRecord
	}: Props = $props();

	let deleteRecordAlertDialogOpen = $state(false);

	function handleCancelDeleteRecord() {
		deleteRecordAlertDialogOpen = false;
	}

	function handleSelectedDeleteRecord(id: string) {
		activeDeleteRecordId = id;
		deleteRecordAlertDialogOpen = true;
	}

	function handleDeleteRecord() {
		if (activeDeleteRecordId) {
			deleteRecord?.(activeDeleteRecordId);
			deleteRecordAlertDialogOpen = false;
		}
	}

	function handleAddNewRecord() {
		addNewRecord?.();
	}
</script>

<div class="flex flex-col gap-4">
	<div class="border border-gray-200 rounded-lg p-4">
		<div class="flex gap-4">
			<div class="w-1/3 flex flex-col gap-1">
				<div class="text-xs font-bold text-gray-500">Vaccine</div>
				<div class="text-sm font-medium">
					<VaccineTypePill vaccineType={vaccineReport.type} />
				</div>
			</div>

			<div class="w-1/3 flex flex-col">
				<div class="text-xs font-bold text-gray-500">Description</div>
				<div class="text-sm font-medium">{vaccineReport.description || '-'}</div>
			</div>

			<div class="w-1/3 flex flex-col">
				<div class="text-xs font-bold text-gray-500">Record date</div>
				<div class="text-sm font-medium">
					{format(new Date(vaccineReport.created_at), 'MMM d, yyyy')}
				</div>
			</div>
		</div>
	</div>
	{#each vaccineReport.details ?? [] as detail}
		<div class="relative border border-dashed border-gray-300 rounded-lg p-4">
			<div class="absolute top-2 right-2">
				<AlertDialog bind:open={deleteRecordAlertDialogOpen}>
					<AlertDialogTrigger>
						<Tooltip>
							<TooltipTrigger>
								<Button
									variant="outline"
									size="icon"
									class="p-1 h-6 w-6 shadow-none"
									on:click={() => handleSelectedDeleteRecord(detail._id)}
								>
									<Trash class="w-3 h-3" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top">
								<p>Delete record</p>
							</TooltipContent>
						</Tooltip>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you sure?</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to delete this record?
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<Button variant="outline" size="sm" on:click={handleCancelDeleteRecord}
								>No, cancel</Button
							>
							<Button variant="destructive" size="sm" on:click={handleDeleteRecord}
								>Yes, delete</Button
							>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>

			{#if vaccineReport.type === VaccineTypeEnum.Covid19}
				<VaccineCovid19Details details={detail as Covid19VaccineDetails} />
			{:else}
				<VaccineBaseDetails details={detail as BaseDetails} />
			{/if}
		</div>
	{/each}

	<div class="flex justify-end">
		<Button variant="outline" size="sm" on:click={() => handleAddNewRecord()}>Add new record</Button
		>
	</div>
</div>
