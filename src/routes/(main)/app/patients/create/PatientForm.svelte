<script lang="ts" module>
	import { z } from 'zod';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import {
		Select,
		SelectContent,
		SelectInput,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '$lib/components/ui/select';
	import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date';
	import { ArrowLeft, Calendar as CalendarIcon, Loader2, Save } from '@lucide/svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import { GenderEnum, type Gender } from '$lib/models/common/common.types';
	import { onMount } from 'svelte';
	import { transformDotNotationObject } from '$lib/utils/common.util';
	import type { Selected } from 'bits-ui';

	export const PatientFormSchema = z.object({
		firstname: z.string({ required_error: 'First name is required' }).nonempty({
			message: 'First name is required'
		}),
		middlename: z.string().nullable(),
		lastname: z.string({ required_error: 'Last name is required' }).nonempty({
			message: 'Last name is required'
		}),
		gender: z.nativeEnum(GenderEnum, { required_error: 'Gender is required' }),
		date_of_birth: z.string({ required_error: 'Date of birth is required' }).nonempty({
			message: 'Date of birth is required'
		}),
		contact_number: z
			.string()
			.max(13, { message: 'Contact number must not exceed to 13 digits' })
			.nullable(),
		address: z.string({ required_error: 'Address is required' }).nonempty({
			message: 'Address is required'
		}),
		weight: z.number().nullable(),
		height: z.number().nullable(),
		blood_type: z.string().nullable(),
		relevant_information: z
			.object({
				mothers_name: z.string().nullable(),
				mothers_contact_number: z
					.string()
					.max(13, { message: 'Contact number must not exceed to 13 digits' })
					.nullable(),
				mothers_occupation: z.string().nullable(),
				fathers_name: z.string().nullable(),
				fathers_contact_number: z
					.string()
					.max(13, { message: 'Contact number must not exceed to 13 digits' })
					.nullable(),
				fathers_occupation: z.string().nullable()
			})
			.nullable()
	});

	export type PatientFormData = z.infer<typeof PatientFormSchema>;

	export type PatientFormProps = {
		positiveButtonLabel?: string;
		negativeButtonLabel?: string;
		patientData: PatientFormData;
		formErrors?: Record<string, string[]>;
		loading?: boolean;
		back: () => void;
		submit: () => void;
	};
</script>

<script lang="ts">
	let {
		positiveButtonLabel = 'Create patient',
		negativeButtonLabel = 'Back',
		formErrors = $bindable({}),
		patientData = $bindable({} as PatientFormData),
		loading = $bindable(false),
		back,
		submit
	}: PatientFormProps = $props();

	let formEl: HTMLFormElement | null = $state(null);
	let touched: Record<string, boolean> = $state({});
	let formInvalid = $derived(Object.values(formErrors).some((errors) => errors.length > 0));
	let genderInitialSelected = $state<{ label: string; value: Gender }>({
		label: 'Male',
		value: GenderEnum.MALE
	});
	let bloodTypeInitialSelected = $state<{ label: string; value: string }>({
		label: 'A+',
		value: 'A+'
	});
	let dateOfBirthValue = $state(parseDate(formatDate(new Date().toISOString())));

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

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let selectedMonth = $derived({
		label: monthFmt.format(dateOfBirthValue.toDate(getLocalTimeZone())),
		value: dateOfBirthValue.month
	});

	let selectedYear = $derived({
		label: yearFmt.format(dateOfBirthValue.toDate(getLocalTimeZone())),
		value: dateOfBirthValue.year
	});

	onMount(() => {
		initializeForm();
	});

	function initializeForm() {
		if (patientData && formEl) {
			formEl.firstname.value = patientData?.firstname ?? '';
			formEl.middlename.value = patientData?.middlename ?? '';
			formEl.lastname.value = patientData?.lastname ?? '';
			formEl.gender.value = patientData?.gender ?? genderInitialSelected.value;
			dateOfBirthValue = patientData?.date_of_birth
				? parseDate(formatDate(patientData.date_of_birth))
				: dateOfBirthValue;
			formEl.contact_number.value = patientData?.contact_number ?? '+63';
			formEl.address.value = patientData?.address ?? '';
			formEl.weight.value = patientData?.weight ?? '';
			formEl.height.value = patientData?.height ?? '';
			formEl.blood_type.value = patientData?.blood_type ?? '';
			formEl['relevant_information.mothers_name'].value =
				patientData?.relevant_information?.mothers_name ?? '';
			formEl['relevant_information.mothers_contact_number'].value =
				patientData?.relevant_information?.mothers_contact_number ?? '';
			formEl['relevant_information.mothers_occupation'].value =
				patientData?.relevant_information?.mothers_occupation ?? '';
			formEl['relevant_information.fathers_name'].value =
				patientData?.relevant_information?.fathers_name ?? '';
			formEl['relevant_information.fathers_contact_number'].value =
				patientData?.relevant_information?.fathers_contact_number ?? '';
			formEl['relevant_information.fathers_occupation'].value =
				patientData?.relevant_information?.fathers_occupation ?? '';
		}
	}

	async function validateForm() {
		if (!formEl) return;

		const data = Object.fromEntries(new FormData(formEl));
		patientData = {
			...(transformDotNotationObject(data) as unknown as PatientFormData),
			date_of_birth: new Date(dateOfBirthValue.toString()).toISOString(),
			weight: data.weight ? Number(data.weight) : null,
			height: data.height ? Number(data.height) : null
		};

		const result = PatientFormSchema.safeParse(patientData);
		if (!result.success) {
			formErrors = result.error.flatten().fieldErrors;
		} else {
			formErrors = {};
		}
	}

	function handleSelectedMonthChange(v: Selected<number> | undefined) {
		if (!v) return;
		const newDate = new Date(Date.UTC(selectedYear.value, v.value - 1, 1, 12, 0, 0));
		dateOfBirthValue = parseDate(formatDate(newDate.toISOString()));
		handleBlur('date_of_birth');
	}

	function handleSelectedYearChange(v: Selected<number> | undefined) {
		if (!v) return;
		const newDate = new Date(Date.UTC(v.value, selectedMonth.value - 1, 1, 12, 0, 0));
		dateOfBirthValue = parseDate(formatDate(newDate.toISOString()));
		handleBlur('date_of_birth');
	}

	function formatDate(dateString: string): string {
		const [year, month, day] = dateString.split('T')[0].split('-');
		return `${year}-${month}-${day}`;
	}

	function handleBlur(fieldName: string) {
		touched[fieldName] = true;
		validateForm();
	}

	function handleSubmit() {
		validateForm();
		Object.keys(formErrors).forEach((key) => {
			touched[key] = true;
		});

		if (formInvalid) return;

		submit();
	}

	function handleBack() {
		back();
	}
</script>

<form bind:this={formEl} class="flex flex-col" oninput={validateForm}>
	<div>
		<h2 class="text-sm font-bold mb-4">Personal Information</h2>
		<div class="flex flex-col gap-x-4 gap-y-6">
			<div class="flex gap-4">
				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">First name <span class="text-red-500">*</span></Label>
					<Input
						name="firstname"
						onblur={() => handleBlur('firstname')}
						class={{
							'border-red-500 focus-visible:ring-red-500': touched.firstname && formErrors.firstname
						}}
					/>
					{#if touched.firstname && formErrors.firstname}
						<p class="text-xs text-red-500">{formErrors.firstname?.[0]}</p>
					{/if}
				</div>

				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">Middle name</Label>
					<Input
						name="middlename"
						onblur={() => handleBlur('middlename')}
						class={{
							'border-red-500 focus-visible:ring-red-500':
								touched.middlename && formErrors.middlename
						}}
					/>
				</div>

				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">Last name <span class="text-red-500">*</span></Label>
					<Input
						name="lastname"
						onblur={() => handleBlur('lastname')}
						class={{
							'border-red-500 focus-visible:ring-red-500': touched.lastname && formErrors.lastname
						}}
					/>
					{#if touched.lastname && formErrors.lastname}
						<p class="text-xs text-red-500">{formErrors.lastname?.[0]}</p>
					{/if}
				</div>
			</div>

			<div class="flex gap-4">
				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">Gender <span class="text-red-500">*</span></Label>
					<Select selected={genderInitialSelected}>
						<SelectTrigger>
							<SelectValue placeholder="Select gender" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="male">Male</SelectItem>
							<SelectItem value="female">Female</SelectItem>
						</SelectContent>
						<SelectInput name="gender" />
					</Select>
				</div>

				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">Date of birth <span class="text-red-500">*</span></Label>
					<Popover.Root>
						<Popover.Trigger asChild let:builder>
							<Button
								variant="outline"
								class={cn(
									'w-full justify-start text-left shadow-none',
									touched.date_of_birth &&
										formErrors.date_of_birth &&
										'border-red-500 focus-visible:ring-red-500',
									!dateOfBirthValue && 'text-muted-foreground'
								)}
								builders={[builder]}
							>
								<CalendarIcon class="mr-2 h-4 w-4" />
								{dateOfBirthValue
									? df.format(dateOfBirthValue.toDate(getLocalTimeZone()))
									: 'Select birthdate'}
							</Button>
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0" align="start">
							<div class="flex gap-2 p-2">
								<Select
									bind:selected={selectedMonth}
									onSelectedChange={(v) => handleSelectedMonthChange(v)}
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
									bind:selected={selectedYear}
									onSelectedChange={(v) => handleSelectedYearChange(v)}
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
							<Calendar
								type="single"
								bind:value={dateOfBirthValue}
								onValueChange={() => handleBlur('date_of_birth')}
							/>
						</Popover.Content>
					</Popover.Root>
					{#if touched.date_of_birth && formErrors.date_of_birth}
						<p class="text-xs text-red-500">{formErrors.date_of_birth?.[0]}</p>
					{/if}
				</div>

				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">Contact number</Label>
					<Input
						name="contact_number"
						onblur={() => handleBlur('contact_number')}
						class={{
							'border-red-500 focus-visible:ring-red-500':
								touched.contact_number && formErrors.contact_number
						}}
					/>
					{#if touched.contact_number && formErrors.contact_number}
						<p class="text-xs text-red-500">{formErrors.contact_number?.[0]}</p>
					{/if}
				</div>
			</div>

			<div class="flex gap-4">
				<div class="w-full flex flex-col gap-2">
					<Label class="text-xs"
						>Address <span class="text-red-500">*</span>
						<span class="text-muted-foreground">(zone, street, barangay, city, province)</span
						></Label
					>
					<Input
						name="address"
						onblur={() => handleBlur('address')}
						class={{
							'border-red-500 focus-visible:ring-red-500': touched.address && formErrors.address
						}}
					/>
					{#if touched.address && formErrors.address}
						<p class="text-xs text-red-500">{formErrors.address?.[0]}</p>
					{/if}
				</div>
			</div>

			<div class="flex gap-4">
				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">Weight <small class="text-muted-foreground">(kg)</small></Label>
					<Input
						type="number"
						name="weight"
						onblur={() => handleBlur('weight')}
						class={{
							'border-red-500 focus-visible:ring-red-500': touched.weight && formErrors.weight
						}}
					/>
					{#if touched.weight && formErrors.weight}
						<p class="text-xs text-red-500">{formErrors.weight?.[0]}</p>
					{/if}
				</div>

				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">Height <small class="text-muted-foreground">(cm)</small></Label>
					<Input
						type="number"
						name="height"
						onblur={() => handleBlur('height')}
						class={{
							'border-red-500 focus-visible:ring-red-500': touched.height && formErrors.height
						}}
					/>
					{#if touched.height && formErrors.height}
						<p class="text-xs text-red-500">{formErrors.height?.[0]}</p>
					{/if}
				</div>

				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">Blood type</Label>
					<Select selected={bloodTypeInitialSelected}>
						<SelectTrigger>
							<SelectValue placeholder="Select blood type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="A+">A+</SelectItem>
							<SelectItem value="A-">A-</SelectItem>
							<SelectItem value="B+">B+</SelectItem>
							<SelectItem value="B-">B-</SelectItem>
							<SelectItem value="AB+">AB+</SelectItem>
							<SelectItem value="AB-">AB-</SelectItem>
							<SelectItem value="O+">O+</SelectItem>
							<SelectItem value="O-">O-</SelectItem>
						</SelectContent>
						<SelectInput name="blood_type" />
					</Select>
					{#if touched.blood_type && formErrors.blood_type}
						<p class="text-xs text-red-500">{formErrors.blood_type?.[0]}</p>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<div class="mt-10">
		<h2 class="text-sm font-bold mb-4">Relevant Information</h2>
		<div class="flex flex-col gap-x-4 gap-y-6">
			<div class="flex gap-4">
				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">Mother's name</Label>
					<Input name="relevant_information.mothers_name" />
				</div>

				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">Contact number</Label>
					<Input name="relevant_information.mothers_contact_number" />
				</div>

				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">Occupation</Label>
					<Input name="relevant_information.mothers_occupation" />
				</div>
			</div>

			<div class="flex gap-4">
				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">Father's name</Label>
					<Input name="relevant_information.fathers_name" />
				</div>

				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">Contact number</Label>
					<Input name="relevant_information.fathers_contact_number" />
				</div>

				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">Occupation</Label>
					<Input name="relevant_information.fathers_occupation" />
				</div>
			</div>
		</div>
	</div>

	<div class="mt-10 flex justify-end gap-2">
		<Button variant="outline" size="sm" on:click={handleBack}>
			<div class="flex items-center gap-1">
				<ArrowLeft class="w-4 h-4" />
				{negativeButtonLabel}
			</div>
		</Button>
		<Button disabled={formInvalid || loading} size="sm" on:click={handleSubmit}>
			<div class="flex items-center gap-1">
				{#if loading}
					<Loader2 class="w-4 h-4 animate-spin" />
				{:else}
					<Save class="w-4 h-4" />
				{/if}
				{positiveButtonLabel}
			</div>
		</Button>
	</div>
</form>
