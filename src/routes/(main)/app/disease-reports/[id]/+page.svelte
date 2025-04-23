<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Routes } from '$lib/models/navigation/routes';
	import { ArrowLeft, Trash } from '@lucide/svelte';

	let loading = $state(false);
	let deleteDiseaseReportAlertDialogOpen = $state(false);

	function handleBack() {
		goto(Routes.DiseaseReports);
	}

	function toggleDeleteDiseaseReportAlertDialog() {
		deleteDiseaseReportAlertDialogOpen = !deleteDiseaseReportAlertDialogOpen;
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
				<Button variant="destructive" size="sm" on:click={toggleDeleteDiseaseReportAlertDialog}>
					<div class="flex items-center gap-1">
						<Trash class="w-4 h-4" />
						Delete
					</div>
				</Button>
			{/if}
		</div>
	</div>
</div>
