<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		AlertDialog,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle,
		AlertDialogTrigger
	} from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { Routes } from '$lib/models/navigation/routes';
	import { Trash, UserRoundX } from '@lucide/svelte';
	import UserForm, { UserFormMode } from '../create/UserForm.svelte';
	import UserSideDetails from './UserSideDetails.svelte';

	let confirmDeleteUserDialogOpen = false;

	function handleBack() {
		goto(Routes.Users);
	}

	function handleSubmit() {
		console.log('submit');
	}

	function handleCancelDeleteUser() {
		confirmDeleteUserDialogOpen = false;
	}

	function handleDeleteUser() {
		console.log('delete');
	}

	function handleSetUserInactive() {
		console.log('set user inactive');
	}
</script>

<div class="max-w-[1200px]">
	<div class="flex items-center justify-between mt-4 mb-6">
		<div>
			<h2 class="text-2xl font-bold">User details</h2>
		</div>

		<div class="flex gap-2">
			<Button variant="outline" size="sm" on:click={handleSetUserInactive}>
				<div class="flex items-center gap-2">
					<UserRoundX class="w-4 h-4" />
					Set as inactive
				</div>
			</Button>
			<AlertDialog bind:open={confirmDeleteUserDialogOpen}>
				<AlertDialogTrigger>
					<Button variant="destructive" size="sm">
						<div class="flex items-center gap-2">
							<Trash class="w-4 h-4" />
							Delete user
						</div>
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this user?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<Button variant="outline" on:click={handleCancelDeleteUser}>No, cancel</Button>
						<Button variant="destructive" on:click={handleDeleteUser}>Yes, delete</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	</div>

	<div class="flex gap-4">
		<div class="w-4/5 border rounded-lg p-4">
			<UserForm mode={UserFormMode.Edit} back={handleBack} submit={handleSubmit} />
		</div>

		<div class="w-1/4 rounded-lg p-4 bg-slate-100">
			<UserSideDetails />
		</div>
	</div>
</div>
