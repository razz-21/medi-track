<script lang="ts" module>
	export const UserFormMode = {
		Create: 'create',
		Edit: 'edit'
	} as const;

	type Props = {
		mode?: (typeof UserFormMode)[keyof typeof UserFormMode];
		positiveButtonLabel?: string;
		negativeButtonLabel?: string;
		submit: () => void;
		back: () => void;
	};
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
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
	import { Save, ArrowLeft } from '@lucide/svelte';

	let {
		mode = UserFormMode.Create,
		positiveButtonLabel = 'Save user',
		negativeButtonLabel = 'Back',
		back,
		submit
	}: Props = $props();
</script>

<div class="flex flex-col">
	<div class="flex flex-col gap-4">
		<h4 class="text-sm font-bold">User Information</h4>

		<div class="flex gap-x-4 gap-y-6">
			<div class="w-1/2 flex flex-col gap-2">
				<Label class="text-xs">First name <span class="text-red-500">*</span></Label>
				<Input />
			</div>

			<div class="w-1/2 flex flex-col gap-2">
				<Label class="text-xs">Last name <span class="text-red-500">*</span></Label>
				<Input />
			</div>
		</div>

		<div class="flex gap-x-4 gap-y-6">
			<div class="w-1/2 flex flex-col gap-2">
				<Label class="text-xs">Username <span class="text-red-500">*</span></Label>
				<Input />
			</div>

			<div class="w-1/2 flex flex-col gap-2">
				<Label class="text-xs">Role <span class="text-red-500">*</span></Label>
				<Select>
					<SelectTrigger>
						<SelectValue placeholder="Select role" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="admin">Admin</SelectItem>
						<SelectItem value="encoder">Encoder</SelectItem>
					</SelectContent>
					<SelectInput name="user-role" />
				</Select>
			</div>
		</div>
	</div>

	<hr class="my-6" />

	<div class="flex flex-col gap-4">
		<h4 class="text-sm font-bold">Account Password</h4>

		{#if mode === UserFormMode.Create}
			<div class="flex gap-x-4 gap-y-6">
				<div class="w-1/2 flex flex-col gap-2">
					<Label class="text-xs">Password <span class="text-red-500">*</span></Label>
					<Input type="password" />
				</div>

				<div class="w-1/2 flex flex-col gap-2">
					<Label class="text-xs">Confirm password <span class="text-red-500">*</span></Label>
					<Input type="password" />
				</div>
			</div>
		{:else}
			<div class="flex gap-x-4 gap-y-6">
				<div class="w-1/2 flex flex-col gap-2">
					<Label class="text-xs">Current password <span class="text-red-500">*</span></Label>
					<Input type="password" />
				</div>

				<div class="w-1/2 flex flex-col gap-2">
					<Label class="text-xs">New password <span class="text-red-500">*</span></Label>
					<Input type="password" />
				</div>
			</div>
		{/if}
	</div>

	<div class="mt-6 flex justify-end gap-2">
		<Button variant="outline" size="sm" on:click={back}>
			<div class="flex items-center gap-2">
				<ArrowLeft class="w-4 h-4" />
				{negativeButtonLabel}
			</div>
		</Button>
		<Button size="sm" on:click={submit}>
			<div class="flex items-center gap-2">
				<Save class="w-4 h-4" />
				{positiveButtonLabel}
			</div>
		</Button>
	</div>
</div>
