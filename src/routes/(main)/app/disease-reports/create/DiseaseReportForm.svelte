<script lang="ts" module>
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
	import {
		Select,
		SelectContent,
		SelectInput,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '$lib/components/ui/select';
	import { GenderEnum } from '$lib/models/common/common.types';
	import {
		DiseaseDefinitions,
		DiseaseTypeEnum,
		DiseaseICDCodeEnum,
		DiseaseModeTransmissionEnum
	} from '$lib/models/disease/disease.type';
	import type { Patient } from '$lib/models/patients/patient.type';
	import {
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		type DateValue
	} from '@internationalized/date';
	import {
		ArrowLeftIcon,
		Calendar as CalendarIcon,
		Mars,
		PlusIcon,
		SearchIcon,
		Venus
	} from '@lucide/svelte';
	import { Calendar } from '$lib/components/ui/calendar';
	import { format } from 'date-fns';
	import { onMount, untrack } from 'svelte';
	import { z } from 'zod';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { Selected } from 'bits-ui';

	export const DiseaseReportForm = z.object({
		patient_id: z
			.string({
				required_error: 'Select a patient'
			})
			.nonempty({
				message: 'Select a patient'
			}),
		disease_type: z.nativeEnum(DiseaseTypeEnum, {
			required_error: 'Disease type is required',
			invalid_type_error: 'Disease type must be a valid disease type'
		}),
		icd_code: z.nativeEnum(DiseaseICDCodeEnum, {
			required_error: 'ICD code is required',
			invalid_type_error: 'ICD code must be a valid ICD code'
		}),
		mode_of_transmission: z.nativeEnum(DiseaseModeTransmissionEnum, {
			required_error: 'Mode of transmission is required',
			invalid_type_error: 'Mode of transmission must be a valid mode of transmission'
		}),
		date_diagnosed: z.string({
			required_error: 'Date diagnosed is required'
		}),
		date_reported: z.string({
			required_error: 'Date reported is required'
		}),
		remarks: z.string().optional()
	});

	export type DiseaseReportDataForm = z.infer<typeof DiseaseReportForm>;
	export type DiseaseReportFormErrors = Partial<Record<keyof DiseaseReportDataForm, string>>;
	export const DiseaseReportMode = {
		CREATE: 'create',
		EDIT: 'edit'
	} as const;
	export type DiseaseReportMode = (typeof DiseaseReportMode)[keyof typeof DiseaseReportMode];

	export const initialDiseaseReportData: DiseaseReportDataForm = {
		patient_id: '',
		disease_type: DiseaseTypeEnum.Dengue,
		icd_code: DiseaseICDCodeEnum.Dengue,
		mode_of_transmission: DiseaseModeTransmissionEnum.NA,
		date_diagnosed: '',
		date_reported: ''
	};

	type Props = {
		mode?: DiseaseReportMode;
		positiveButtonText?: string;
		negativeButtonText?: string;
		patients?: Patient[];
		selectedPatient?: Patient | null;
		diseaseReportData?: DiseaseReportDataForm;
		formErrors?: DiseaseReportFormErrors;
		isFormInvalid?: boolean;
		cancel?: () => void;
		submit?: (data: DiseaseReportDataForm) => void;
	};
</script>

<script lang="ts">
	let {
		mode = $bindable(DiseaseReportMode.CREATE),
		positiveButtonText = 'Create report',
		negativeButtonText = 'Cancel',
		patients = $bindable([]),
		selectedPatient = $bindable(null),
		diseaseReportData = $bindable(initialDiseaseReportData),
		formErrors = $bindable({}),
		isFormInvalid = $bindable(false),
		cancel,
		submit
	}: Props = $props();

	let patientSearchQuery = $state('');
	let patientsSelectionDropdownOpen = $state(false);
	let patientGender = $derived(() => selectedPatient?.gender);
	let filteredPatients = $derived(() =>
		patients.filter((patient) => {
			const fullName = `${patient.firstname} ${patient.lastname}`.toLowerCase();
			return fullName.includes(patientSearchQuery.toLowerCase());
		})
	);

	let maleAvatar = 'https://avatar.iran.liara.run/public/21';
	let femaleAvatar = 'https://avatar.iran.liara.run/public/67';
	let getAvatar = $derived((gender: GenderEnum) =>
		gender === GenderEnum.MALE ? maleAvatar : femaleAvatar
	);

	let diseaseTypes = $derived(() => {
		if (mode === DiseaseReportMode.EDIT) {
			return [diseaseReportData.disease_type];
		}

		return Object.values(DiseaseTypeEnum);
	});
	let icdCodes = $derived(Object.values(DiseaseICDCodeEnum));
	let modeOfTransmissions = $derived(Object.values(DiseaseModeTransmissionEnum));
	let initialSelectedICDCode = $derived({
		label: diseaseReportData.icd_code,
		value: diseaseReportData.icd_code
	});
	let initialSelectedModeOfTransmission = $derived({
		label: diseaseReportData.mode_of_transmission,
		value: diseaseReportData.mode_of_transmission
	});
	let selectedDateDiagosed = $state<DateValue>(
		parseDate(format(diseaseReportData.date_diagnosed || new Date(), 'yyyy-MM-dd'))
	);
	let selectedDateReported = $state<DateValue>(
		parseDate(format(diseaseReportData.date_reported || new Date(), 'yyyy-MM-dd'))
	);

	let touched = $state<Record<keyof DiseaseReportDataForm, boolean>>({
		patient_id: false,
		disease_type: false,
		icd_code: false,
		mode_of_transmission: false,
		date_diagnosed: false,
		date_reported: false,
		remarks: false
	});

	const monthOptions = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	].map((month, i) => ({ value: i + 1, label: month }));

	const monthFmt = new DateFormatter('en-US', {
		month: 'long'
	});

	const yearFmt = new DateFormatter('en-US', {
		year: 'numeric'
	});

	const yearOptions = Array.from({ length: 100 }, (_, i) => ({
		label: yearFmt.format(new Date(new Date().getFullYear() - i, 0, 1)),
		value: new Date().getFullYear() - i
	}));

	const dateFormatter = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let selectedDateDiagosedMonth = $derived({
		label: monthFmt.format(selectedDateDiagosed.toDate(getLocalTimeZone())),
		value: selectedDateDiagosed.month
	});

	let selectedDateDiagosedYear = $derived({
		label: yearFmt.format(selectedDateDiagosed.toDate(getLocalTimeZone())),
		value: selectedDateDiagosed.year
	});

	let selectedDateReportedMonth = $derived({
		label: monthFmt.format(selectedDateReported.toDate(getLocalTimeZone())),
		value: selectedDateReported.month
	});

	let selectedDateReportedYear = $derived({
		label: yearFmt.format(selectedDateReported.toDate(getLocalTimeZone())),
		value: selectedDateReported.year
	});

	$effect(() => {
		diseaseReportData.patient_id = selectedPatient?._id ?? '';
		untrack(() => {
			validateForm();
		});
	});

	$effect(() => {
		isFormInvalid = Object.values(formErrors).some((error) => error !== '');
	});

	$effect(() => {
		const selectedDiseaseType = diseaseReportData.disease_type;
		untrack(() => {
			diseaseReportData.icd_code = DiseaseICDCodeEnum[selectedDiseaseType];
		});
	});

	$effect(() => {
		diseaseReportData.date_diagnosed = new Date(selectedDateDiagosed.toString()).toISOString();
	});

	$effect(() => {
		diseaseReportData.date_reported = new Date(selectedDateReported.toString()).toISOString();
	});

	onMount(() => {});

	function validateForm() {
		const result = DiseaseReportForm.safeParse(diseaseReportData);
		if (!result.success) {
			formErrors = result.error.flatten().fieldErrors as unknown as DiseaseReportFormErrors;
		} else {
			formErrors = {};
		}
	}

	function handleSelectPatient(patient: Patient) {
		selectedPatient = patient;
		patientSearchQuery = `${patient.firstname} ${patient.lastname}`;
		patientsSelectionDropdownOpen = false;
	}

	function handleSelectPatientByKeyboard(e: KeyboardEvent, patient: Patient) {
		if (e.key === 'Enter' || e.key === ' ') {
			handleSelectPatient(patient);
		}
	}

	function handleSelectDiseaseType(diseaseType: DiseaseTypeEnum) {
		diseaseReportData.disease_type = diseaseType;
	}

	function handleSelectDiseaseTypeByKeyboard(e: KeyboardEvent, diseaseType: DiseaseTypeEnum) {
		if (e.key === 'Enter' || e.key === ' ') {
			handleSelectDiseaseType(diseaseType);
		}
	}

	function handleSelectedDateDiagosedMonthChange(v: Selected<number> | undefined) {
		if (!v) return;
		const newDate = new Date(Date.UTC(selectedDateDiagosedYear.value, v.value - 1, 1, 12, 0, 0));
		selectedDateDiagosed = parseDate(newDate.toISOString().split('T')[0]);
		touched.date_diagnosed = true;
	}

	function handleSelectedDateDiagosedYearChange(v: Selected<number> | undefined) {
		if (!v) return;
		const newDate = new Date(Date.UTC(v.value, selectedDateDiagosedMonth.value - 1, 1, 12, 0, 0));
		selectedDateDiagosed = parseDate(newDate.toISOString().split('T')[0]);
		touched.date_diagnosed = true;
	}

	function handleSelectedDateReportedMonthChange(v: Selected<number> | undefined) {
		if (!v) return;
		const newDate = new Date(Date.UTC(selectedDateReportedYear.value, v.value - 1, 1, 12, 0, 0));
		selectedDateReported = parseDate(newDate.toISOString().split('T')[0]);
		touched.date_reported = true;
	}

	function handleSelectedDateReportedYearChange(v: Selected<number> | undefined) {
		if (!v) return;
		const newDate = new Date(Date.UTC(v.value, selectedDateReportedMonth.value - 1, 1, 12, 0, 0));
		selectedDateReported = parseDate(newDate.toISOString().split('T')[0]);
		touched.date_reported = true;
	}

	function submitForm() {
		validateForm();

		Object.keys(diseaseReportData).forEach((key) => {
			touched[key as keyof DiseaseReportDataForm] = true;
		});

		if (Object.keys(formErrors).length > 0) {
			return;
		}

		submit?.(diseaseReportData);
	}
</script>

<form class="flex flex-col gap-4" oninput={validateForm}>
	<div class="flex gap-4">
		{#if mode === DiseaseReportMode.CREATE}
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
						class="pl-8 {formErrors.patient_id && touched.patient_id
							? 'border-red-500 focus-visible:ring-red-500'
							: ''}"
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
													src={getAvatar(patient.gender)}
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
				{#if formErrors.patient_id && touched.patient_id}
					<p class="text-red-500 text-xs">{formErrors.patient_id}</p>
				{/if}
			</div>

			{#if selectedPatient}
				<div class="w-1/2 flex flex-col gap-2">
					<div class="border border-dashed border-slate-300 rounded-md p-4">
						<div class="flex items-center justify-between gap-2">
							<div class="flex gap-2">
								<div class="w-6 h-6 rounded-full border border-gray-300 overflow-hidden">
									<img
										src={getAvatar(selectedPatient.gender)}
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
								<div>{format(selectedPatient.date_of_birth, 'MMM d, yyyy')}</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		{/if}
	</div>

	<div class="flex flex-col gap-2">
		<h2 class="text-xs font-medium mb-2">Disease type <span class="text-red-500">*</span></h2>
		<RadioGroup bind:value={diseaseReportData.disease_type}>
			<div class="grid grid-cols-3 gap-4">
				{#each diseaseTypes() as diseaseType}
					<div
						role="button"
						tabindex="0"
						class="border border-slate-300 rounded-md p-4 cursor-pointer min-h-32 {diseaseReportData.disease_type ===
						diseaseType
							? 'bg-slate-100'
							: ''}"
						onclick={() => handleSelectDiseaseType(diseaseType)}
						onkeydown={(e) => handleSelectDiseaseTypeByKeyboard(e, diseaseType)}
					>
						<div class="relative h-full flex items-center justify-center gap-2">
							<div class="absolute -top-4 -right-1">
								<RadioGroupItem value={diseaseType} />
							</div>
							<div class="text-center">
								<div class="text-xl font-bold mb-2">{diseaseType}</div>
								<p class="text-xs text-gray-500">{DiseaseDefinitions[diseaseType]}</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</RadioGroup>
	</div>

	<div class="flex gap-4">
		<div class="w-1/2">
			<Label for="icd_code" class="text-xs">ICD code <span class="text-red-500">*</span></Label>
			<Select
				selected={initialSelectedICDCode}
				onSelectedChange={(value) => {
					diseaseReportData.icd_code = value?.value ?? DiseaseICDCodeEnum.Dengue;
				}}
				disabled
			>
				<SelectTrigger>
					<SelectValue placeholder="Select an ICD code" />
				</SelectTrigger>
				<SelectContent>
					{#each icdCodes as code}
						<SelectItem value={code}>{code}</SelectItem>
					{/each}
				</SelectContent>
				<SelectInput bind:value={diseaseReportData.icd_code} name="icd_code" readonly />
			</Select>
			{#if formErrors.icd_code && touched.icd_code}
				<p class="text-red-500 text-xs">{formErrors.icd_code}</p>
			{/if}
		</div>

		<div class="w-1/2">
			<Label for="icd_code" class="text-xs"
				>Mode of transmission <span class="text-red-500">*</span></Label
			>
			<Select
				selected={initialSelectedModeOfTransmission}
				onSelectedChange={(value) => {
					diseaseReportData.mode_of_transmission =
						value?.value ?? DiseaseModeTransmissionEnum.Airborne;
				}}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select a mode of transmission" />
				</SelectTrigger>
				<SelectContent>
					{#each modeOfTransmissions as mode}
						<SelectItem value={mode}>{mode}</SelectItem>
					{/each}
				</SelectContent>
				<SelectInput
					bind:value={diseaseReportData.mode_of_transmission}
					name="mode_of_transmission"
				/>
			</Select>
			{#if formErrors.mode_of_transmission && touched.mode_of_transmission}
				<p class="text-red-500 text-xs">{formErrors.mode_of_transmission}</p>
			{/if}
		</div>
	</div>

	<div class="flex gap-4">
		<div class="w-1/2">
			<Label for="date" class="text-xs">Date of diagnosis<span class="text-red-500">*</span></Label>
			<Popover>
				<PopoverTrigger asChild let:builder>
					<Button
						variant="outline"
						class="w-full shadow-none justify-start text-left"
						builders={[builder]}
					>
						<div class="flex items-center gap-2">
							<CalendarIcon class="w-4 h-4" />
							<span class="font-normal"
								>{diseaseReportData.date_diagnosed
									? dateFormatter.format(new Date(diseaseReportData.date_diagnosed))
									: 'Select date'}</span
							>
						</div>
					</Button>
				</PopoverTrigger>
				<PopoverContent class="w-auto p-0">
					<div class="flex gap-2 p-2">
						<Select
							bind:selected={selectedDateDiagosedMonth}
							onSelectedChange={(v) => handleSelectedDateDiagosedMonthChange(v)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select month" />
							</SelectTrigger>
							<SelectContent>
								{#each monthOptions as month}
									<SelectItem value={month.value}>{month.label}</SelectItem>
								{/each}
							</SelectContent>
							<SelectInput name="date_of_birth" />
						</Select>

						<Select
							bind:selected={selectedDateDiagosedYear}
							onSelectedChange={(v) => handleSelectedDateDiagosedYearChange(v)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select year" />
							</SelectTrigger>
							<SelectContent class="max-h-[200px] overflow-y-auto">
								{#each yearOptions as year}
									<SelectItem value={year.value}>{year.label}</SelectItem>
								{/each}
							</SelectContent>
							<SelectInput name="date_of_birth" />
						</Select>
					</div>
					<Calendar bind:value={selectedDateDiagosed} />
				</PopoverContent>
			</Popover>
		</div>

		<div class="w-1/2">
			<Label for="date" class="text-xs">
				Date reported <span class="text-red-500">*</span>
			</Label>
			<Popover>
				<PopoverTrigger asChild let:builder>
					<Button
						variant="outline"
						class="w-full shadow-none justify-start text-left"
						builders={[builder]}
					>
						<div class="flex items-center gap-2">
							<CalendarIcon class="w-4 h-4" />
							<span class="font-normal"
								>{diseaseReportData.date_reported
									? dateFormatter.format(new Date(diseaseReportData.date_reported))
									: 'Select date'}</span
							>
						</div>
					</Button>
				</PopoverTrigger>
				<PopoverContent class="w-auto p-0">
					<div class="flex gap-2 p-2">
						<Select
							bind:selected={selectedDateReportedMonth}
							onSelectedChange={(v) => handleSelectedDateReportedMonthChange(v)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select month" />
							</SelectTrigger>
							<SelectContent>
								{#each monthOptions as month}
									<SelectItem value={month.value}>{month.label}</SelectItem>
								{/each}
							</SelectContent>
							<SelectInput name="date_of_birth" />
						</Select>

						<Select
							bind:selected={selectedDateReportedYear}
							onSelectedChange={(v) => handleSelectedDateReportedYearChange(v)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select year" />
							</SelectTrigger>
							<SelectContent class="max-h-[200px] overflow-y-auto">
								{#each yearOptions as year}
									<SelectItem value={year.value}>{year.label}</SelectItem>
								{/each}
							</SelectContent>
							<SelectInput name="date_of_birth" />
						</Select>
					</div>
					<Calendar bind:value={selectedDateReported} />
				</PopoverContent>
			</Popover>
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<Label for="remarks" class="text-xs">Remarks</Label>
		<Textarea bind:value={diseaseReportData.remarks} name="remarks" />
	</div>

	<div class="flex justify-end gap-2 mt-2">
		<Button type="button" variant="outline" size="sm" on:click={() => cancel?.()}>
			<div class="flex items-center gap-1">
				<ArrowLeftIcon class="w-4 h-4" />
				{negativeButtonText}
			</div>
		</Button>
		<Button type="submit" size="sm" disabled={isFormInvalid} on:click={submitForm}>
			<div class="flex items-center gap-1">
				<PlusIcon class="w-4 h-4" />
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
