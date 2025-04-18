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
	import { Trash, UserRoundCheck, UserRoundX } from '@lucide/svelte';
	import UserForm, {
		UserFormMode,
		type UserEditFormData,
	} from '../create/UserForm.svelte';
	import UserSideDetails from './UserSideDetails.svelte';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { getUserHandler } from '$lib/handler/users/get-user.handler';
	import { UserStatusEnum, type UserGet } from '$lib/models/user/user.type';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { patchUserHandler } from '$lib/handler/users/patch-user.handler';
	import { toast } from 'svelte-sonner';

	let loading = $state(true);
	let confirmDeleteUserDialogOpen = $state(false);
	let confirmSetUserInactiveDialogOpen = $state(false);
	let confirmSetUserActiveDialogOpen = $state(false);
	let user: UserGet = $state({} as UserGet);
	let userData: UserEditFormData = $state({} as UserEditFormData);
	let formErrors: Record<string, string[]> = $state({});
	let loadingForm = $state(false);

	$effect(() => {
		initializeUserData();
	});

	onMount(async () => {
		const { id } = page.params;
		user = await getUserHandler(id);
		initializeUserData();
		loading = false;
	});

	function initializeUserData() {
		if (user) {
			userData = {
				...user
			};
		}
	}

	function handleBack() {
		goto(Routes.Users);
	}

	async function handleUserUpdate() {
		const { newPassword, ...userDataRest } = userData;
		const updateUser = Object.fromEntries(
			Object.entries(userDataRest).filter(([key, value]) => value !== user[key as keyof UserGet])
		);

		if (userData.newPassword) {
			updateUser.password = userData.newPassword;
		}

		const toastId = toast.loading('Updating user');
		try {
			const updatedUser = await patchUserHandler(user._id, updateUser);
			user = updatedUser;
			toast.success('User updated successfully', { id: toastId });
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message, { id: toastId });
				if (error.message.includes('Username already exists')) {
					formErrors = {
						username: ['Username already exists']
					};
				}

				if (error.message.includes('Current password is incorrect')) {
					formErrors = {
						currentPassword: ['Current password is incorrect']
					};
				}
			}
		} finally {
			loadingForm = false;
		}
	}

	function handleCancelDeleteUser() {
		confirmDeleteUserDialogOpen = false;
	}

	async function handleDeleteUser() {
		const toastId = toast.loading('Deleting user');
		try {
			await patchUserHandler(user._id, { status: UserStatusEnum.Deleted });
			user.status = UserStatusEnum.Deleted;
			toast.success('User deleted successfully', { id: toastId });
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message, { id: toastId });
			}
		} finally {
			confirmDeleteUserDialogOpen = false;
		}
	}

	function hadleSetUserActiveDialogOpen() {
		confirmSetUserActiveDialogOpen = true;
	}

	function handleCancelSetUserActive() {
		confirmSetUserActiveDialogOpen = false;
	}

	async function handleSetUserActive() {
		const toastId = toast.loading('Setting user as active');
		try {
			await patchUserHandler(user._id, { status: UserStatusEnum.Active });
			user.status = UserStatusEnum.Active;
			toast.success('User set as active successfully', { id: toastId });
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message, { id: toastId });
			}
		} finally {
			confirmSetUserActiveDialogOpen = false;
			confirmSetUserInactiveDialogOpen = false;
		}
	}

	function handleCancelSetUserInactive() {
		confirmSetUserInactiveDialogOpen = false;
	}

	async function handleSetUserInactive() {
		const toastId = toast.loading('Setting user as inactive');
		try {
			await patchUserHandler(user._id, { status: UserStatusEnum.Inactive });
			user.status = UserStatusEnum.Inactive;
			toast.success('User set as inactive successfully', { id: toastId });
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message, { id: toastId });
			}
		} finally {
			confirmSetUserInactiveDialogOpen = false;
			confirmSetUserActiveDialogOpen = false;
		}
	}
</script>

<div class="max-w-[1200px]">
	<div class="flex items-center justify-between mt-4 mb-6">
		<div>
			<h2 class="text-2xl font-bold">User details</h2>
		</div>

		<div class="flex gap-2">
			{#if loading}
				<Skeleton class="w-24 h-[2rem] rounded-lg bg-slate-200" />
				<Skeleton class="w-24 h-[2rem] rounded-lg bg-slate-200" />
			{:else}
				{#if user.status === UserStatusEnum.Inactive || user.status === UserStatusEnum.Deleted}
					<AlertDialog bind:open={confirmSetUserActiveDialogOpen}>
						<AlertDialogTrigger>
							<Button variant="outline" size="sm" on:click={hadleSetUserActiveDialogOpen}>
								<div class="flex items-center gap-2">
									<UserRoundCheck class="w-4 h-4" />
									Set as active
								</div>
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you sure?</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to set this user as active? The user will be able to login
									to the system.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<Button variant="outline" on:click={handleCancelSetUserActive}>No, cancel</Button>
								<Button variant="outline" on:click={handleSetUserActive}>Yes, set as active</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				{/if}

				{#if user.status === UserStatusEnum.Active}
					<AlertDialog bind:open={confirmSetUserInactiveDialogOpen}>
						<AlertDialogTrigger>
							<Button variant="outline" size="sm" on:click={hadleSetUserActiveDialogOpen}>
								<div class="flex items-center gap-2">
									<UserRoundX class="w-4 h-4" />
									Set as inactive
								</div>
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you sure?</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to set this user as inactive? The user will not be able to
									login to the system.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<Button variant="outline" on:click={handleCancelSetUserInactive}>No, cancel</Button>
								<Button variant="outline" on:click={handleSetUserInactive}
									>Yes, set as inactive</Button
								>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				{/if}

				{#if user.status !== UserStatusEnum.Deleted}
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
				{/if}
			{/if}
		</div>
	</div>

	{#if loading}
		<div class="flex gap-4 h-[15rem]">
			<div class="w-4/5 flex flex-col gap-2">
				<Skeleton class="w-full h-full max-h-[2rem] rounded-lg bg-slate-200" />
				<Skeleton class="w-full h-full max-h-[3rem] rounded-lg bg-slate-200" />
				<Skeleton class="w-full h-full max-h-[10rem] rounded-lg bg-slate-200" />
			</div>

			<div class="w-1/4">
				<Skeleton class="w-full h-full max-h-[15rem] rounded-lg bg-slate-200" />
			</div>
		</div>
	{:else}
		<div class="flex gap-4">
			<div class="w-4/5 border rounded-lg p-4">
				<UserForm
					bind:userData
					bind:loading={loadingForm}
					bind:formErrors
					mode={UserFormMode.Edit}
					back={handleBack}
					submit={handleUserUpdate}
				/>
			</div>

			<div class="w-1/4 rounded-lg p-4 bg-slate-100">
				<UserSideDetails {user} />
			</div>
		</div>
	{/if}
</div>
