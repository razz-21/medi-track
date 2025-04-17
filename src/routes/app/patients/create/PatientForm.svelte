<script lang="ts" module>
	type PatientFormProps = {
		back: () => void;
		submit: () => void;
	};
</script>

<script lang="ts">
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
	import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { ArrowLeft, Calendar as CalendarIcon, Save } from '@lucide/svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';

	let { back, submit }: PatientFormProps = $props();

	const formValue = {
		firstName: '',
		middleName: '',
		lastName: '',
		gender: '0',
		dateOfBirth: undefined,
		contactNumber: '+63'
	};

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	function handleSubmit() {
		submit();
	}

	function handleBack() {
		back();
	}
</script>

<div class="flex flex-col">
	<div>
		<h2 class="text-sm font-bold mb-4">Personal Information</h2>
		<div class="flex flex-col gap-x-4 gap-y-6">
			<div class="flex gap-4">
				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">First name <span class="text-red-500">*</span></Label>
					<Input bind:value={formValue.firstName} />
				</div>

				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">Middle name</Label>
					<Input bind:value={formValue.middleName} />
				</div>

				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">Last name <span class="text-red-500">*</span></Label>
					<Input bind:value={formValue.lastName} />
				</div>
			</div>

			<div class="flex gap-4">
				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">Gender <span class="text-red-500">*</span></Label>
					<Select>
						<SelectTrigger>
							<SelectValue placeholder="Select gender" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="0">Male</SelectItem>
							<SelectItem value="1">Female</SelectItem>
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
									!formValue.dateOfBirth && 'text-muted-foreground'
								)}
								builders={[builder]}
							>
								<CalendarIcon class="mr-2 h-4 w-4" />
								{formValue.dateOfBirth
									? df.format(formValue.dateOfBirth.toDate(getLocalTimeZone()))
									: 'Select birthdate'}
							</Button>
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0" align="start">
							<Calendar bind:value={formValue.dateOfBirth} />
						</Popover.Content>
					</Popover.Root>
				</div>

				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">Contact number</Label>
					<Input bind:value={formValue.contactNumber} />
				</div>
			</div>

			<div class="flex gap-4">
				<div class="w-full flex flex-col gap-2">
					<Label class="text-xs">Address</Label>
					<Input />
				</div>
			</div>

			<div class="flex gap-4">
				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">Weight</Label>
					<Input />
				</div>

				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">Height</Label>
					<Input />
				</div>

				<div class="w-1/3 flex flex-col gap-2">
					<Label class="text-xs">Blood type</Label>
					<Select>
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
						<SelectInput name="blood-type" />
					</Select>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-10">
		<h2 class="text-sm font-bold mb-4">Relevant Information</h2>
		<div class="flex flex-col gap-x-4 gap-y-6">
			<div class="flex gap-4">
				<div class="w-1/2 flex flex-col gap-2">
					<Label class="text-xs">Mother's name</Label>
					<Input />
				</div>

				<div class="w-1/2 flex flex-col gap-2">
					<Label class="text-xs">Occupation</Label>
					<Input />
				</div>
			</div>

			<div class="flex gap-4">
				<div class="w-1/2 flex flex-col gap-2">
					<Label class="text-xs">Father's name</Label>
					<Input />
				</div>

				<div class="w-1/2 flex flex-col gap-2">
					<Label class="text-xs">Occupation</Label>
					<Input />
				</div>
			</div>
		</div>
	</div>

	<div class="mt-10 flex justify-end gap-2">
		<Button variant="outline" on:click={handleBack}>
			<div class="flex items-center gap-1">
				<ArrowLeft class="w-4 h-4" />
				Back
			</div>
		</Button>
		<Button on:click={handleSubmit}>
			<div class="flex items-center gap-1">
				<Save class="w-4 h-4" />
				Save details
			</div>
		</Button>
	</div>
</div>
