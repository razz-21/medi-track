<script lang="ts" module>
	import { z } from 'zod';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import { Calendar as CalendarIcon } from '@lucide/svelte';
	import {
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		type DateValue
	} from '@internationalized/date';
	import { format } from 'date-fns';
	import { Covid19VaccineTypeEnum } from '$lib/models/vaccine/vaccine.type';
	import {
		Select,
		SelectContent,
		SelectInput,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '$lib/components/ui/select';
	import { onMount } from 'svelte';

	export const VaccineInformationCovid19FormSchema = z.object({
		dose: z
			.string({ required_error: 'Dose is required' })
			.nonempty({ message: 'Dose is required' }),
		brand: z
			.string({ required_error: 'Brand is required' })
			.nonempty({ message: 'Brand is required' }),
		lot_number: z
			.string({ required_error: 'Lot number is required' })
			.nonempty({ message: 'Lot number is required' }),
		date: z
			.string({ required_error: 'Date of vaccination is required' })
			.nonempty({ message: 'Date of vaccination is required' }),
		vaccinator: z
			.string({ required_error: 'Vaccinator is required' })
			.nonempty({ message: 'Vaccinator is required' })
	});

	export type VaccineInformationCovid19DataForm = z.infer<
		typeof VaccineInformationCovid19FormSchema
	>;
	export type VaccineInformationCovid19FormErrors = Partial<
		Record<keyof VaccineInformationCovid19DataForm, string>
	>;

	type Props = {
		covid19InformationData?: VaccineInformationCovid19DataForm;
		formErrors?: VaccineInformationCovid19FormErrors;
		isFormInvalid?: boolean;
	};

	export const covid19InitialValues: VaccineInformationCovid19DataForm = {
		dose: '',
		brand: Object.values(Covid19VaccineTypeEnum)[0],
		lot_number: '',
		date: '',
		vaccinator: ''
	};
</script>

<script lang="ts">
	let {
		covid19InformationData = $bindable(covid19InitialValues),
		formErrors = $bindable({} as VaccineInformationCovid19FormErrors),
		isFormInvalid = $bindable(false)
	}: Props = $props();

	let touched = $state<Record<keyof VaccineInformationCovid19DataForm, boolean>>({
		dose: false,
		brand: false,
		lot_number: false,
		date: false,
		vaccinator: false
	});

	let covid19Brands = $state(Object.values(Covid19VaccineTypeEnum));
	let initialSelectedBrand = $state({ label: covid19Brands[0], value: covid19Brands[0] });
	let selectedDate = $state<DateValue>(parseDate(format(new Date(), 'yyyy-MM-dd')));

	covid19InformationData.brand = initialSelectedBrand.value;

	const dateFormatter = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	$effect(() => {
		isFormInvalid = Object.values(formErrors).length > 0;
	});

	$effect(() => {
		covid19InformationData.date = new Date(selectedDate.toDate(getLocalTimeZone())).toISOString();
	});

	onMount(() => {
		validateForm();
	});

	function validateForm() {
		const result = VaccineInformationCovid19FormSchema.safeParse(covid19InformationData);
		if (!result.success) {
			formErrors = result.error.flatten()
				.fieldErrors as unknown as VaccineInformationCovid19FormErrors;
		} else {
			formErrors = {};
		}
	}

	function handleFieldBlur(field: keyof VaccineInformationCovid19DataForm) {
		touched[field] = true;
		validateForm();
	}
</script>

<div class="flex flex-col gap-4" oninput={validateForm}>
	<div class="flex gap-4">
		<div class="w-1/3 flex flex-col gap-2">
			<Label for="dose" class="text-xs">Dose<span class="text-red-500">*</span></Label>
			<Input
				bind:value={covid19InformationData.dose}
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

		<div class="w-1/3 flex flex-col gap-2">
			<Label for="brand" class="text-xs">Brand<span class="text-red-500">*</span></Label>
			<Select
				selected={initialSelectedBrand}
				onSelectedChange={(value) => {
					covid19InformationData.brand = value?.value ?? '';
				}}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select a brand" />
				</SelectTrigger>
				<SelectContent>
					{#each covid19Brands as brand}
						<SelectItem value={brand}>{brand}</SelectItem>
					{/each}
				</SelectContent>
				<SelectInput bind:value={covid19InformationData.brand} name="brand" />
			</Select>
			{#if formErrors.brand && touched.brand}
				<p class="text-red-500 text-xs">{formErrors.brand}</p>
			{/if}
		</div>

		<div class="w-1/3 flex flex-col gap-2">
			<Label for="lot_number" class="text-xs">Lot Number<span class="text-red-500">* </span></Label>
			<Input
				bind:value={covid19InformationData.lot_number}
				id="lot_number"
				name="lot_number"
				type="text"
				class={formErrors.lot_number && touched.lot_number
					? 'border-red-500 focus-visible:ring-red-500'
					: ''}
				on:blur={() => handleFieldBlur('lot_number')}
			/>
			{#if formErrors.lot_number && touched.lot_number}
				<p class="text-red-500 text-xs">{formErrors.lot_number}</p>
			{/if}
		</div>
	</div>

	<div class="flex gap-4">
		<div class="w-4/6 flex flex-col gap-2">
			<Label for="vaccinator" class="text-xs">Vaccinator<span class="text-red-500">*</span></Label>
			<Input
				bind:value={covid19InformationData.vaccinator}
				id="vaccinator"
				name="vaccinator"
				type="text"
				class={formErrors.vaccinator && touched.vaccinator
					? 'border-red-500 focus-visible:ring-red-500'
					: ''}
				on:blur={() => handleFieldBlur('vaccinator')}
			/>
			{#if formErrors.vaccinator && touched.vaccinator}
				<p class="text-red-500 text-xs">{formErrors.vaccinator}</p>
			{/if}
		</div>

		<div class="w-2/6 flex flex-col gap-2">
			<Label for="date" class="text-xs"
				>Date of vaccination<span class="text-red-500">*</span></Label
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
								>{covid19InformationData.date
									? dateFormatter.format(new Date(covid19InformationData.date))
									: 'Select date'}</span
							>
						</div>
					</Button>
				</PopoverTrigger>
				<PopoverContent class="w-auto p-0">
					<Calendar bind:value={selectedDate} />
				</PopoverContent>
			</Popover>
		</div>
	</div>
</div>
