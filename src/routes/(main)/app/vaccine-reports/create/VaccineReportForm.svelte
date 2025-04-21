<script lang="ts" module>
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { untrack } from 'svelte';
	import { SearchIcon, Mars, ArrowLeftIcon, Save, Venus } from '@lucide/svelte';
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
	import { VaccineTypeEnum } from '$lib/models/vaccine/vaccine.type';
	import VaccineInformationBaseForm, {
		initialVaccineInformationData,
		VaccineInformationBaseFormSchema,
		type VaccineInformationBaseDataForm
	} from './VaccineInformationBaseForm.svelte';
	import VaccineInformationCovid19Form, {
		covid19InitialValues,
		VaccineInformationCovid19FormSchema,
		type VaccineInformationCovid19DataForm
	} from './VaccineInformationCovid19Form.svelte';
	import { Button } from '$lib/components/ui/button';
	import { z } from 'zod';
	import type { Patient } from '$lib/models/patients/patient.type';
	import { GenderEnum } from '$lib/models/common/common.types';
	import { format } from 'date-fns';

	export const VaccineReportFormSchema = z.object({
		type: z.nativeEnum(VaccineTypeEnum),
		description: z.string().nullable(),
		details: z.union([VaccineInformationBaseFormSchema, VaccineInformationCovid19FormSchema])
	});

	export type VaccineReportDataForm = z.infer<typeof VaccineReportFormSchema>;
	export type VaccineReportFormErrors = Partial<Record<keyof VaccineReportDataForm, string>>;

	export const initialVaccineReportData: VaccineReportDataForm = {
		type: VaccineTypeEnum.BCG,
		description: '',
		details: {} as VaccineInformationBaseDataForm | VaccineInformationCovid19DataForm
	};

	type Props = {
		negativeButtonText?: string;
		positiveButtonText?: string;
		vaccineReportData?: VaccineReportDataForm;
		vaccineReportFormErrors?: VaccineReportFormErrors;
		patients?: Patient[];
		selectedPatient?: Patient | null;
		submit: (vaccineReportData: VaccineReportDataForm) => void;
		cancel: () => void;
	};
</script>

<script lang="ts">
	let {
		negativeButtonText = 'Back',
		positiveButtonText = 'Create report',
		vaccineReportData = $bindable(initialVaccineReportData as VaccineReportDataForm),
		vaccineReportFormErrors = $bindable({} as VaccineReportFormErrors),
		patients = $bindable([] as Patient[]),
		selectedPatient = $bindable(null as Patient | null),
		submit,
		cancel
	}: Props = $props();

	let formEl: HTMLFormElement;

	let patientsSelectionDropdownOpen = $state(false);
	let patientGender = $derived(() => selectedPatient?.gender);
	let patientSearchQuery = $state('');
	let filteredPatients = $derived(() =>
		patients.filter((patient) => {
			const fullName = `${patient.firstname} ${patient.lastname}`.toLowerCase();
			return fullName.includes(patientSearchQuery.toLowerCase());
		})
	);
	let selectedPatientBirthdate = $derived(() =>
		selectedPatient ? format(selectedPatient.date_of_birth, 'MMM d, yyyy') : ''
	);

	let vaccineTypes = Object.values(VaccineTypeEnum);
	let covid19InformationData = $state<VaccineInformationCovid19DataForm>(
		{} as VaccineInformationCovid19DataForm
	);
	let isVaccineBaseInformationDataInvalid = $state(false);
	let isVaccineCovid19InformationDataInvalid = $state(false);

	let maleAvatar = 'https://avatar.iran.liara.run/public/21';
	let femaleAvatar = 'https://avatar.iran.liara.run/public/67';
	let getAvatar = $derived(() =>
		selectedPatient?.gender === GenderEnum.MALE ? maleAvatar : femaleAvatar
	);

	const vaccineDefinitions: Record<VaccineTypeEnum, string> = {
		[VaccineTypeEnum.BCG]: 'Given at birth to prevent tuberculosis',
		[VaccineTypeEnum.HepaB1]: 'First dose at birth to prevent hepatitis B',
		[VaccineTypeEnum.Polio]: 'Multiple doses in infancy to prevent polio',
		[VaccineTypeEnum.PCV]: 'Multiple doses to prevent pneumococcal infections',
		[VaccineTypeEnum.Covid19]: 'Initial doses plus boosters to prevent COVID-19',
		[VaccineTypeEnum.MMR]: 'Initial dose plus boosters to prevent measles, mumps, and rubella'
	};

	let isFormInvalid = $derived(() => {
		if (!selectedPatient) return true;

		const vaccineType = vaccineReportData.type;
		if (vaccineType === VaccineTypeEnum.Covid19) {
			return isVaccineCovid19InformationDataInvalid;
		}

		return isVaccineBaseInformationDataInvalid;
	});

	$effect(() => {
		vaccineReportData.details = covid19InformationData;
	});

	$effect(() => {
		const selectedVaccineType = JSON.parse(JSON.stringify(vaccineReportData.type));
		if (selectedVaccineType === VaccineTypeEnum.Covid19) {
			vaccineReportData.details = JSON.parse(JSON.stringify(covid19InitialValues));
		} else {
			vaccineReportData.details = JSON.parse(JSON.stringify(initialVaccineInformationData));
		}
	});

	$effect(() => {
		if (vaccineReportData.type !== VaccineTypeEnum.Covid19) {
			vaccineReportData.details = {
				...vaccineReportData.details,
				weight: selectedPatient?.weight ?? 0,
				height: selectedPatient?.height ?? 0
			} as VaccineInformationBaseDataForm;
		}
	});

	function validateForm() {
		const result = VaccineReportFormSchema.safeParse(vaccineReportData);
		if (!result.success) {
			vaccineReportFormErrors = result.error.flatten()
				.fieldErrors as unknown as VaccineReportFormErrors;
		} else {
			vaccineReportFormErrors = {};
		}
	}

	function handleSelectVaccineType(value: VaccineTypeEnum) {
		vaccineReportData.type = value;
	}

	function handleSelectVaccineTypeByKeyboard(event: KeyboardEvent, value: VaccineTypeEnum) {
		if (event.key === 'Enter' || event.key === ' ') {
			handleSelectVaccineType(value);
		}
	}

	function handleSelectPatient(patient: Patient) {
		selectedPatient = patient;
		patientsSelectionDropdownOpen = false;
		patientSearchQuery = `${patient.firstname} ${patient.lastname}`;
	}

	function handleSelectPatientByKeyboard(event: KeyboardEvent, patient: Patient) {
		if (event.key === 'Enter' || event.key === ' ') {
			handleSelectPatient(patient);
		}
	}

	function submitReport() {
		if (isFormInvalid()) return;
		submit(vaccineReportData);
	}
</script>

<form bind:this={formEl} class="flex flex-col" oninput={validateForm} onsubmit={submitReport}>
	<div>
		<div class="flex flex-col gap-x-4 gap-y-6">
			<div class="flex items-center gap-4">
				<div class="w-1/2 flex flex-col gap-2">
					<Label class="text-xs">Select patient <span class="text-red-500">*</span></Label>
					<div class="relative">
						<div class="absolute" style="left: 10px; top: 50%; transform: translateY(-50%);">
							<SearchIcon class="text-gray-900 w-4 h-4" />
						</div>
						<Input
							bind:value={patientSearchQuery}
							type="search"
							name="firstname"
							placeholder="Search for a patient"
							class="pl-8"
							on:click={() => (patientsSelectionDropdownOpen = true)}
						/>
						{#if patientsSelectionDropdownOpen && !!patientSearchQuery}
							<div class="input-dropdown">
								{#if filteredPatients().length > 0}
									{#each filteredPatients() as patient (patient._id)}
										<div
											role="button"
											tabindex="0"
											class="input-dropdown-item"
											onclick={() => handleSelectPatient(patient)}
											onkeydown={(e) => handleSelectPatientByKeyboard(e, patient)}
										>
											<div class="flex items-center gap-2">
												<div class="w-6 h-6 rounded-full border border-gray-300 overflow-hidden">
													<img
														src={getAvatar()}
														alt="Patient avatar"
														class="w-full h-full object-cover"
													/>
												</div>
												<div>{patient.firstname} {patient.lastname}</div>
											</div>
										</div>
									{/each}
								{:else}
									<div class="input-dropdown-item">
										<div class="flex items-center gap-2">
											<div class="text-center">No patients found</div>
										</div>
									</div>
								{/if}
							</div>
						{/if}
					</div>
				</div>

				{#if selectedPatient}
					<div class="w-1/2 flex flex-col gap-2">
						<div class="border border-dashed border-slate-300 rounded-md p-4">
							<div class="flex items-center justify-between gap-2">
								<div class="flex gap-2">
									<div class="w-6 h-6 rounded-full border border-gray-300 overflow-hidden">
										<img
											src={getAvatar()}
											alt="Patient avatar"
											class="w-full h-full object-cover"
										/>
									</div>
									<div>{selectedPatient.firstname} {selectedPatient.lastname}</div>
								</div>

								<div class="flex items-center gap-2 text-xs">
									{#if patientGender() === GenderEnum.MALE}
										<Mars class="w-5 h-5 text-blue-500" />
									{:else}
										<Venus class="w-5 h-5 text-pink-500" />
									{/if}
									<div class="h-6 w-[1px] bg-gray-300"></div>
									<div>{selectedPatientBirthdate()}</div>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<div class="flex flex-col gap-2">
				<h2 class="text-xs font-medium mb-2">Vaccine type <span class="text-red-500">*</span></h2>
				<RadioGroup bind:value={vaccineReportData.type}>
					<div class="grid grid-cols-3 gap-4">
						{#each vaccineTypes as vaccineType}
							<div
								role="button"
								tabindex="0"
								class="border border-slate-300 rounded-md p-4 cursor-pointer min-h-32 {vaccineReportData.type ===
								vaccineType
									? 'bg-slate-100'
									: ''}"
								onclick={() => handleSelectVaccineType(vaccineType)}
								onkeydown={(e) => handleSelectVaccineTypeByKeyboard(e, vaccineType)}
							>
								<div class="relative h-full flex items-center justify-center gap-2">
									<div class="absolute -top-4 -right-1">
										<RadioGroupItem value={vaccineType} />
									</div>
									<div class="text-center">
										<div class="text-xl font-bold mb-2">{vaccineType}</div>
										<p class="text-xs text-gray-500">{vaccineDefinitions[vaccineType]}</p>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</RadioGroup>
			</div>

			<div class="flex flex-col gap-2">
				<Label id="description" class="text-xs"
					>Description <span class="text-gray-500">(Optional)</span></Label
				>
				<Input id="description" name="description" bind:value={vaccineReportData.description} />
			</div>
			{#if vaccineReportData.type === VaccineTypeEnum.Covid19}
				<VaccineInformationCovid19Form
					bind:covid19InformationData={
						vaccineReportData.details as VaccineInformationCovid19DataForm
					}
					bind:isFormInvalid={isVaccineCovid19InformationDataInvalid}
				/>
			{:else}
				<VaccineInformationBaseForm
					bind:vaccineInformationData={vaccineReportData.details as VaccineInformationBaseDataForm}
					bind:isFormInvalid={isVaccineBaseInformationDataInvalid}
				/>
			{/if}
		</div>
	</div>

	<div class="flex justify-end gap-2 mt-6">
		<Button variant="outline" on:click={cancel}>
			<div class="flex items-center gap-2">
				<ArrowLeftIcon class="w-4 h-4" />
				{negativeButtonText}
			</div>
		</Button>
		<Button type="submit" disabled={isFormInvalid()}>
			<div class="flex items-center gap-2">
				<Save class="w-4 h-4" />
				{positiveButtonText}
			</div>
		</Button>
	</div>
</form>

<style lang="postcss">
	@reference 'tailwindcss';

	.input-dropdown {
		@apply absolute top-10 left-0 w-full p-1 border rounded-sm bg-white z-10;
	}

	.input-dropdown-item {
		@apply flex items-center gap-2 p-1 text-sm hover:bg-gray-100 cursor-pointer;
	}
</style>
