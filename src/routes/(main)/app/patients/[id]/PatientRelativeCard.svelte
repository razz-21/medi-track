<script lang="ts" module>
	import type { Patient } from '$lib/models/patients/patient.type';
	import { Eye } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { Routes } from '$lib/models/navigation/routes';

	type Props = {
		familyMembers: Omit<Patient, 'relevant_information'>[];
	};
</script>

<script lang="ts">
	const { familyMembers }: Props = $props();

	function handleViewPatient(id: string) {
		goto(`${Routes.Patients}/${id}`, { invalidateAll: true });
	}
</script>

<div class="flex flex-col gap-2 overflow-y-auto h-full border border-gray-200 rounded-lg p-4">
	<h2 class="text-sm font-medium mb-2">Household members</h2>

	{#each familyMembers as member}
		<div
			class="flex items-center justify-between gap-4 border py-3 px-3 bg-white border-gray-200 rounded-lg hover:bg-slate-50"
		>
			<div class="flex flex-col gap-1">
				<div class="text-sm">{member.firstname} {member.lastname}</div>
				<div class="text-xs text-gray-500">{member.household_relationship}</div>
			</div>

			<div
				role="button"
				tabindex="0"
				onclick={() => handleViewPatient(member._id)}
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						handleViewPatient(member._id);
					}
				}}
			>
				<Eye class="w-5 h-5 text-gray-500 hover:cursor-pointer" />
			</div>
		</div>
	{/each}

	{#if familyMembers.length === 0}
		<div class="text-sm text-gray-500 text-center">No household members found</div>
	{/if}
</div>
