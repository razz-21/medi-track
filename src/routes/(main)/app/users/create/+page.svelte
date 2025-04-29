<script lang="ts" module>
	import { goto } from '$app/navigation';
	import { createUserHandler } from '$lib/handler/users/create-user.hander';
	import { Routes } from '$lib/models/navigation/routes';
	import { v4 as uuidv4 } from 'uuid';
	import UserForm, { UserFormMode, type UserCreateFormData } from './UserForm.svelte';
	import { toast } from 'svelte-sonner';
</script>

<script lang="ts">
	let userData: UserCreateFormData = $state({} as UserCreateFormData);
	let loadingForm = $state(false);
	let formErrors = $state({});

	async function handleSubmit() {
		loadingForm = true;
		const toastId = toast.loading('Creating user...');

		try {
			const body = {
				_id: uuidv4(),
				firstname: userData.firstname,
				lastname: userData.lastname,
				username: userData.username,
				role: userData.role,
				password: userData.password
			};
			const result = await createUserHandler(body);

			if (result) {
				toast.success('User created successfully', { id: toastId });
				goto(Routes.Users);
			} else {
				toast.error('Failed to create user', { id: toastId });
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message, { id: toastId });
				if (error.message.includes('Username already exists')) {
					formErrors = {
						username: ['Username already exists']
					};
				}
			}
		} finally {
			loadingForm = false;
		}
	}

	function handleBack() {
		goto(Routes.Users);
	}
</script>

<div class="max-w-[800px]">
	<div class="flex items-center justify-between mt-4 mb-6">
		<div>
			<h2 class="text-2xl font-bold">Create user</h2>
		</div>
	</div>

	<div class="border rounded-lg p-4">
		<UserForm
			bind:userData
			bind:loading={loadingForm}
			bind:formErrors
			mode={UserFormMode.Create}
			positiveButtonLabel="Create user"
			submit={handleSubmit}
			back={handleBack}
		/>
	</div>
</div>
