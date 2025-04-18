<script lang="ts">
	import { goto } from '$app/navigation';
	import { Routes } from '$lib/models/navigation/routes';
	import UserForm, { UserFormMode } from './UserForm.svelte';

	function handleSubmit() {
		console.log('submit');
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
			mode={UserFormMode.Create}
			positiveButtonLabel="Create user"
			submit={handleSubmit}
			back={handleBack}
		/>
	</div>
</div>
