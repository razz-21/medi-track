<script lang="ts" module>
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
	import { z, ZodError } from 'zod';
	import { UserTypeEnum, type UserType } from '$lib/models/user/user.type';
	import type { Selected } from 'bits-ui';

	export const UserFormMode = {
		Create: 'create',
		Edit: 'edit'
	} as const;

	type Props = {
		mode?: (typeof UserFormMode)[keyof typeof UserFormMode];
		positiveButtonLabel?: string;
		negativeButtonLabel?: string;
		formErrors?: Record<string, string[]>;
		userData?: UserFormData;
		loading?: boolean;
		submit: () => void;
		back: () => void;
	};

	const baseSchema = z.object({
		firstname: z
			.string({ required_error: 'First name is required' })
			.nonempty({ message: 'First name is required' }),
		lastname: z
			.string({ required_error: 'Last name is required' })
			.nonempty({ message: 'Last name is required' }),
		username: z
			.string({ required_error: 'Username is required' })
			.nonempty({ message: 'Username is required' })
			.min(6, { message: 'Username must be at least 4 characters' })
			.max(32, { message: 'Username must be less than 16 characters' }),
		role: z
			.nativeEnum(UserTypeEnum, { required_error: 'Role is required' })
			.default(UserTypeEnum.Encoder)
	});

	export const createUserSchema = baseSchema
		.extend({
			password: z
				.string({ required_error: 'Password is required' })
				.nonempty({ message: 'Password is required' })
				.min(8, { message: 'Password must be at least 8 characters' })
				.max(32, { message: 'Password must be less than 32 characters' }),
			confirmPassword: z
				.string({ required_error: 'Confirm password is required' })
				.nonempty({ message: 'Confirm password is required' })
				.min(8, { message: 'Confirm password must be at least 8 characters' })
				.max(32, { message: 'Confirm password must be less than 32 characters' })
		})
		.superRefine((data, ctx) => {
			if (data.password !== data.confirmPassword) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Passwords do not match',
					path: ['confirmPassword']
				});
			}
		});

	export const editUserSchema = baseSchema
		.extend({
			currentPassword: z
				.string({ required_error: 'Current password is required' })
				.nonempty({ message: 'Current password is required' })
				.max(32, { message: 'Current password must be less than 32 characters' }),
			newPassword: z
				.string({ required_error: 'New password is required' })
				.nonempty({ message: 'New password is required' })
				.max(32, { message: 'New password must be less than 32 characters' })
		})
		.superRefine((data, ctx) => {
			if (data.newPassword === data.currentPassword) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'New password must be different from current password',
					path: ['newPassword']
				});
			}
		});

	export type UserFormSchema = typeof createUserSchema | typeof editUserSchema;
	export type UserFormData = z.infer<UserFormSchema>;
	export type UserCreateFormData = z.infer<typeof createUserSchema>;
	export type UserEditFormData = z.infer<typeof editUserSchema>;
</script>

<script lang="ts">
	let {
		mode = UserFormMode.Create,
		userData = $bindable({} as UserFormData),
		formErrors = $bindable({}),
		positiveButtonLabel = 'Save user',
		negativeButtonLabel = 'Back',
		loading = $bindable(false),
		back,
		submit
	}: Props = $props();

	let formEl: HTMLFormElement;
	let touched: Record<string, boolean> = $state({});
	let formInvalid = $derived(Object.values(formErrors).some((errors) => errors.length > 0));
	let roleSelection: Selected<UserType>[] = [
		{
			label: 'Admin',
			value: UserTypeEnum.Admin
		},
		{
			label: 'Encoder',
			value: UserTypeEnum.Encoder
		}
	];

	function handleBlur(fieldName: string) {
		touched[fieldName] = true;
		validateForm();
	}

	async function validateForm() {
		const data = Object.fromEntries(new FormData(formEl));
		userData = data as UserFormData;
		try {
			const schema = mode === UserFormMode.Create ? createUserSchema : editUserSchema;
			schema.parse(data);
			formErrors = {};
		} catch (error) {
			if (error instanceof ZodError) {
				const { fieldErrors: errors } = error.flatten();
				formErrors = Object.fromEntries(
					Object.entries(errors).map(([key, value]) => [key, value as string[]])
				);
			} else {
				console.error(error);
			}
		}
	}
</script>

<form bind:this={formEl} method="POST" onchange={validateForm} oninput={validateForm}>
	<div class="flex flex-col">
		<div class="flex flex-col gap-4">
			<h4 class="text-sm font-bold">User Information</h4>

			<div class="flex gap-x-4 gap-y-6">
				<div class="w-1/2 flex flex-col gap-2">
					<Label class="text-xs">First name <span class="text-red-500">*</span></Label>
					<Input
						name="firstname"
						onblur={() => handleBlur('firstname')}
						class={{
							'border-red-500 focus-visible:ring-red-500': touched.firstname && formErrors.firstname
						}}
					/>
					{#if touched.firstname && formErrors.firstname}
						<p class="text-red-500 text-xs">{formErrors.firstname[0]}</p>
					{/if}
				</div>

				<div class="w-1/2 flex flex-col gap-2">
					<Label class="text-xs">Last name <span class="text-red-500">*</span></Label>
					<Input
						name="lastname"
						onblur={() => handleBlur('lastname')}
						class={{
							'border-red-500 focus-visible:ring-red-500': touched.lastname && formErrors.lastname
						}}
					/>
					{#if touched.lastname && formErrors.lastname}
						<p class="text-red-500 text-xs">{formErrors.lastname[0]}</p>
					{/if}
				</div>
			</div>

			<div class="flex gap-x-4 gap-y-6">
				<div class="w-1/2 flex flex-col gap-2">
					<Label class="text-xs">Username <span class="text-red-500">*</span></Label>
					<Input
						name="username"
						onblur={() => handleBlur('username')}
						class={{
							'border-red-500 focus-visible:ring-red-500': touched.username && formErrors.username
						}}
					/>
					{#if touched.username && formErrors.username}
						<p class="text-red-500 text-xs">{formErrors.username[0]}</p>
					{/if}
				</div>

				<div class="w-1/2 flex flex-col gap-2">
					<Label class="text-xs">Role <span class="text-red-500">*</span></Label>
					<Select selected={{ label: 'Admin', value: UserTypeEnum.Admin }}>
						<SelectTrigger>
							<SelectValue placeholder="Select role" />
						</SelectTrigger>
						<SelectContent>
							{#each roleSelection as role}
								<SelectItem value={role.value}>{role.label}</SelectItem>
							{/each}
						</SelectContent>
						<SelectInput
							name="role"
							onblur={() => handleBlur('role')}
							class={{
								'border-red-500 focus-visible:ring-red-500': touched.role && formErrors.role
							}}
						/>
					</Select>
					{#if touched.role && formErrors.role}
						<p class="text-red-500 text-xs">{formErrors.role[0]}</p>
					{/if}
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
						<Input
							type="password"
							name="password"
							onblur={() => handleBlur('password')}
							class={{
								'border-red-500 focus-visible:ring-red-500': touched.password && formErrors.password
							}}
						/>
						{#if touched.password && formErrors.password}
							<p class="text-red-500 text-xs">{formErrors.password[0]}</p>
						{/if}
					</div>

					<div class="w-1/2 flex flex-col gap-2">
						<Label class="text-xs">Confirm password <span class="text-red-500">*</span></Label>
						<Input
							type="password"
							name="confirmPassword"
							onblur={() => handleBlur('confirmPassword')}
							class={{
								'border-red-500 focus-visible:ring-red-500':
									touched.confirmPassword && formErrors.confirmPassword
							}}
						/>
						{#if touched.confirmPassword && formErrors.confirmPassword}
							<p class="text-red-500 text-xs">{formErrors.confirmPassword[0]}</p>
						{/if}
					</div>
				</div>
			{:else}
				<div class="flex gap-x-4 gap-y-6">
					<div class="w-1/2 flex flex-col gap-2">
						<Label class="text-xs">Current password <span class="text-red-500">*</span></Label>
						<Input
							type="password"
							name="currentPassword"
							onblur={() => handleBlur('currentPassword')}
							class={{
								'border-red-500 focus-visible:ring-red-500':
									touched.currentPassword && formErrors.currentPassword
							}}
						/>
						{#if touched.currentPassword && formErrors.currentPassword}
							<p class="text-red-500 text-xs">{formErrors.currentPassword[0]}</p>
						{/if}
					</div>

					<div class="w-1/2 flex flex-col gap-2">
						<Label class="text-xs">New password <span class="text-red-500">*</span></Label>
						<Input
							type="password"
							name="newPassword"
							onblur={() => handleBlur('newPassword')}
							class={{
								'border-red-500 focus-visible:ring-red-500':
									touched.newPassword && formErrors.newPassword
							}}
						/>
						{#if touched.newPassword && formErrors.newPassword}
							<p class="text-red-500 text-xs">{formErrors.newPassword[0]}</p>
						{/if}
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
			<Button size="sm" disabled={formInvalid || loading} on:click={submit}>
				<div class="flex items-center gap-2">
					<Save class="w-4 h-4" />
					{positiveButtonLabel}
				</div>
			</Button>
		</div>
	</div>
</form>
