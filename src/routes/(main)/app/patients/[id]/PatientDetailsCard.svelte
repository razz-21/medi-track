<script lang="ts" module>
	import { Button } from '$lib/components/ui/button';
	import PatientStatusPill from '../PatientStatusPill.svelte';
	import type { PatientGet } from '$lib/models/patients/patient.type';

	type Props = {
		patient: PatientGet;
	};
</script>

<script lang="ts">
	let { patient }: Props = $props();

	let formattedDate = $derived(() => {
		const date = new Date(patient.date_of_birth);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	});

	let createdAt = $derived(() => {
		const date = new Date(patient.created_at);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	});

	let updatedAt = $derived(() => {
		const date = new Date(patient.updated_at);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	});

	let avatar = $derived(() => {
		if (patient.gender === 'male') {
			return 'https://avatar.iran.liara.run/public/21';
		}
		return 'https://avatar.iran.liara.run/public/67';
	});
</script>

<div class="bg-slate-50 rounded-lg py-6 px-4">
	<div class="flex items-center justify-between">
		<div
			class="w-1/3 border-r border-gray flex flex-col items-center justify-center self-stretch gap-2"
		>
			<div class="p-2 border-gray">
				<img
					src={avatar()}
					class="size-32 rounded-full border-4 border-green-300"
					alt="Meditrack"
				/>
			</div>

			<div class="text-center">
				<h2 class="text-2xl font-medium">{patient.firstname} {patient.lastname}</h2>
				<div class="text-xs text-gray-500">RESIDENT</div>
			</div>

			{#if false}
				<div class="mt-2">
					<Button variant="outline" size="sm">Upload image</Button>
				</div>
			{/if}
		</div>

		<div class="w-2/3 mx-6 py-4 flex-wrap">
			<div class="grid grid-cols-3 gap-x-4 gap-y-6">
				<div class="flex flex-col">
					<div class="flex flex-col gap-1">
						<h3 class="text-xs text-gray-400">Full name</h3>
						<p class="text-xs font-medium">{patient.firstname} {patient.lastname}</p>
					</div>
				</div>

				<div class="flex flex-col">
					<div class="flex flex-col gap-1">
						<h3 class="text-xs text-gray-400">Gender</h3>
						<p class="text-xs font-medium capitalize">{patient.gender}</p>
					</div>
				</div>

				<div class="flex flex-col">
					<div class="flex flex-col gap-1">
						<h3 class="text-xs text-gray-400">Date of birth</h3>
						<p class="text-xs font-medium">{formattedDate()}</p>
					</div>
				</div>

				<div class="flex flex-col">
					<div class="flex flex-col gap-1">
						<h3 class="text-xs text-gray-400">Address</h3>
						<p class="text-xs font-medium">{patient.address}</p>
					</div>
				</div>

				<div class="flex flex-col">
					<div class="flex flex-col gap-1">
						<h3 class="text-xs text-gray-400">HSN (Household serial number)</h3>
						<p class="text-xs font-medium">{patient.hsn ?? '-'}</p>
					</div>
				</div>

				<div class="flex flex-col">
					<div class="flex flex-col gap-1">
						<h3 class="text-xs text-gray-400">Household relationship</h3>
						<p class="text-xs font-medium">{patient.household_relationship ?? '-'}</p>
					</div>
				</div>

				<div class="flex flex-col">
					<div class="flex flex-col gap-1">
						<h3 class="text-xs text-gray-400">Contact number</h3>
						<p class="text-xs font-medium">{patient.contact_number}</p>
					</div>
				</div>

				<div class="flex flex-col">
					<div class="flex flex-col gap-1">
						<h3 class="text-xs text-gray-400">Status</h3>
						<PatientStatusPill status={patient.status} />
					</div>
				</div>

				<div class="flex flex-col">
					<div class="flex flex-col gap-1">
						<h3 class="text-xs text-gray-400">Created at</h3>
						<p class="text-xs font-medium">{createdAt()}</p>
					</div>
				</div>

				<div class="flex flex-col">
					<div class="flex flex-col gap-1">
						<h3 class="text-xs text-gray-400">Updated at</h3>
						<p class="text-xs font-medium">{updatedAt()}</p>
					</div>
				</div>
			</div>

			<hr class="my-6" />

			<div class="grid grid-cols-3 gap-x-4 gap-y-6">
				<div class="flex flex-col">
					<div class="flex flex-col gap-1">
						<h3 class="text-xs text-gray-400">Weight</h3>
						<p class="text-xs font-medium">{patient.weight ? `${patient.weight}kg` : '-'}</p>
					</div>
				</div>

				<div class="flex flex-col">
					<div class="flex flex-col gap-1">
						<h3 class="text-xs text-gray-400">Height</h3>
						<p class="text-xs font-medium">{patient.height ? `${patient.height}cm` : '-'}</p>
					</div>
				</div>

				<div class="flex flex-col">
					<div class="flex flex-col gap-1">
						<h3 class="text-xs text-gray-400">Blood type</h3>
						<p class="text-xs font-medium">{patient.blood_type || '-'}</p>
					</div>
				</div>

				<div class="flex flex-col">
					<div class="flex flex-col gap-1">
						<h3 class="text-xs text-gray-400">Mother's name</h3>
						<p class="text-xs font-medium">{patient.relevant_information?.mothers_name || '-'}</p>
					</div>
				</div>

				<div class="flex flex-col">
					<div class="flex flex-col gap-1">
						<h3 class="text-xs text-gray-400">Mother's contact number</h3>
						<p class="text-xs font-medium">
							{patient.relevant_information?.mothers_contact_number || '-'}
						</p>
					</div>
				</div>

				<div class="flex flex-col">
					<div class="flex flex-col gap-1">
						<h3 class="text-xs text-gray-400">Mother's occupation</h3>
						<p class="text-xs font-medium">
							{patient.relevant_information?.mothers_occupation || '-'}
						</p>
					</div>
				</div>

				<div class="flex flex-col">
					<div class="flex flex-col gap-1">
						<h3 class="text-xs text-gray-400">Father's name</h3>
						<p class="text-xs font-medium">{patient.relevant_information?.fathers_name || '-'}</p>
					</div>
				</div>

				<div class="flex flex-col">
					<div class="flex flex-col gap-1">
						<h3 class="text-xs text-gray-400">Father's contact number</h3>
						<p class="text-xs font-medium">
							{patient.relevant_information?.fathers_contact_number || '-'}
						</p>
					</div>
				</div>

				<div class="flex flex-col">
					<div class="flex flex-col gap-1">
						<h3 class="text-xs text-gray-400">Father's occupation</h3>
						<p class="text-xs font-medium">
							{patient.relevant_information?.fathers_occupation || '-'}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
