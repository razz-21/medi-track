<script lang="ts" module>
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { z } from 'zod';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Calendar as CalendarIcon } from '@lucide/svelte';
	import { Calendar } from '$lib/components/ui/calendar';
	import {
		DateFormatter,
		parseDate,
		type DateValue,
		getLocalTimeZone
	} from '@internationalized/date';
	import { format } from 'date-fns';
	import { onMount } from 'svelte';

	export const VaccineInformationBaseFormSchema = z.object({
		dose: z
			.string({ required_error: 'Dose is required' })
			.nonempty({ message: 'Dose is required' }),
		immunization_date: z.string({ required_error: 'Immunization date is required' }),
		weight: z
			.number({
				required_error: 'Weight is required',
				invalid_type_error: 'Weight must be a number'
			})
			.min(1, { message: 'Weight must be greater than 0' }),
		height: z
			.number({
				required_error: 'Height is required',
				invalid_type_error: 'Height must be a number'
			})
			.min(1, { message: 'Height must be greater than 0' }),
		remarks: z.string().nullable().default(null)
	});

	export type VaccineInformationBaseDataForm = z.infer<typeof VaccineInformationBaseFormSchema>;
	export type VaccineInformationBaseFormErrors = Partial<
		Record<keyof VaccineInformationBaseDataForm, string>
	>;

	export const initialVaccineInformationData: VaccineInformationBaseDataForm = {
		dose: '',
		immunization_date: '',
		weight: 0,
		height: 0,
		remarks: null
	};

	type Props = {
		vaccineInformationData?: VaccineInformationBaseDataForm;
		formErrors?: VaccineInformationBaseFormErrors;
		isFormInvalid?: boolean;
	};
</script>

<script lang="ts">
	let {
		vaccineInformationData = $bindable(
			initialVaccineInformationData as VaccineInformationBaseDataForm
		),
		formErrors = $bindable({} as VaccineInformationBaseFormErrors),
		isFormInvalid = $bindable(false)
	}: Props = $props();

	$effect(() => {
		isFormInvalid = Object.values(formErrors).length > 0;
	});

	let touched = $state<Record<keyof VaccineInformationBaseDataForm, boolean>>({
		dose: false,
		immunization_date: false,
		weight: false,
		height: false,
		remarks: false
	});
	let selectedDate = $state<DateValue>(parseDate(format(new Date(), 'yyyy-MM-dd')));

	const dateFormatter = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	$effect(() => {
		vaccineInformationData.immunization_date = new Date(
			selectedDate.toDate(getLocalTimeZone())
		).toISOString();
	});

	onMount(() => {
		validateForm();
	});

	function handleFieldBlur(field: keyof VaccineInformationBaseDataForm) {
		validateForm();
		touched[field] = true;
	}

	function validateForm() {
		const result = VaccineInformationBaseFormSchema.safeParse(vaccineInformationData);
		if (!result.success) {
			formErrors = result.error.flatten()
				.fieldErrors as unknown as VaccineInformationBaseFormErrors;
		} else {
			formErrors = {};
		}
	}
</script>

<div class="flex flex-col gap-4" oninput={validateForm}>
	<div class="flex gap-4">
		<div class="w-1/4 flex flex-col gap-2">
			<Label for="dose" class="text-xs">Dose <span class="text-red-500">*</span></Label>
			<Input
				bind:value={vaccineInformationData.dose}
				id="dose"
				name="dose"
				type="text"
				class={formErrors.dose && touched.dose ? 'border-red-500 focus-visible:ring-red-500' : ''}
				on:blur={() => handleFieldBlur('dose')}
			/>
			{#if formErrors.dose && touched.dose}
				<p class="text-red-500 text-xs">{formErrors.dose}</p>
			{/if}
		</div>

		<div class="w-1/4 flex flex-col gap-2">
			<Label for="immunization-date" class="text-xs"
				>Immunization date <span class="text-red-500">*</span></Label
			>
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
								>{vaccineInformationData.immunization_date
									? dateFormatter.format(new Date(vaccineInformationData.immunization_date))
									: 'Select date'}</span
							>
						</div>
					</Button>
				</PopoverTrigger>
				<PopoverContent class="w-auto p-0">
					<Calendar type="single" bind:value={selectedDate} />
				</PopoverContent>
			</Popover>
			{#if formErrors.immunization_date && touched.immunization_date}
				<p class="text-red-500 text-xs">{formErrors.immunization_date}</p>
			{/if}
		</div>

		<div class="w-1/4 flex flex-col gap-2">
			<Label for="weight" class="text-xs"
				>Weight <small class="text-gray-500">(kg)</small> <span class="text-red-500">*</span></Label
			>
			<Input
				bind:value={vaccineInformationData.weight}
				id="weight"
				name="weight"
				type="number"
				class={formErrors.weight && touched.weight
					? 'border-red-500 focus-visible:ring-red-500'
					: ''}
				on:blur={() => handleFieldBlur('weight')}
			/>
			{#if formErrors.weight && touched.weight}
				<p class="text-red-500 text-xs">{formErrors.weight}</p>
			{/if}
		</div>

		<div class="w-1/4 flex flex-col gap-2">
			<Label for="height" class="text-xs"
				>Height <small class="text-gray-500">(cm)</small> <span class="text-red-500">*</span></Label
			>
			<Input
				bind:value={vaccineInformationData.height}
				id="height"
				name="height"
				type="number"
				class={formErrors.height && touched.height
					? 'border-red-500 focus-visible:ring-red-500'
					: ''}
				on:blur={() => handleFieldBlur('height')}
			/>
			{#if formErrors.height && touched.height}
				<p class="text-red-500 text-xs">{formErrors.height}</p>
			{/if}
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<Label for="remarks" class="text-xs">Remarks</Label>
		<Textarea
			bind:value={vaccineInformationData.remarks}
			id="remarks"
			name="remarks"
			class={formErrors.remarks && touched.remarks
				? 'border-red-500 focus-visible:ring-red-500'
				: ''}
			on:blur={() => handleFieldBlur('remarks')}
		/>
		{#if formErrors.remarks && touched.remarks}
			<p class="text-red-500 text-xs">{formErrors.remarks}</p>
		{/if}
	</div>
</div>
