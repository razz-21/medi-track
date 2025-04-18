<script lang="ts" module>
	import {
		Table,
		TableHeader,
		TableHead,
		TableRow,
		TableCell,
		TableBody
	} from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { Routes } from '$lib/models/navigation/routes';
	import UserStatusPill from './UserStatusPill.svelte';
	import UsersDataTableActions from './UsersDataTableActions.svelte';
	import { UserStatusEnum, type UserGetTable } from '$lib/models/user/user.type';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import {
		AlertDialog,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogTitle,
		AlertDialogTrigger
	} from '$lib/components/ui/alert-dialog';
	import UserTypePill from './UserTypePill.svelte';

	export type Props = {
		loading: boolean;
		users: UserGetTable['users'];
		page: number;
		limit: number;
		total: number;
		pageChange: (page: number) => void;
		deleteUser: (user: UserGetTable['users'][0]) => void;
	};
</script>

<script lang="ts">
	let {
		loading = $bindable(false),
		users = [],
		page = $bindable(1),
		limit = $bindable(10),
		total = $bindable(0),
		pageChange,
		deleteUser
	}: Props = $props();

	let pageCount = $derived(Math.ceil(total / limit));
	let hasPreviousPage = $derived(page > 1);
	let hasNextPage = $derived(page < pageCount);
	let deleteUserDialogOpen = $state(false);
	let activeUser = $state<UserGetTable['users'][0] | null>(null);

	function formateDate(date: string) {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function handlePreviousPage() {
		page = page - 1;
		handlePageChange(page);
	}

	function handleNextPage() {
		page = page + 1;
		handlePageChange(page);
	}

	function handlePageChange(page: number) {
		pageChange(page);
	}

	function handleDeleteUser() {
		if (!activeUser) return;
		deleteUser(activeUser);
		deleteUserDialogOpen = false;
	}
</script>

<div class="rounded-md border">
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead class="font-medium text-xs text-gray-500">Name</TableHead>
				<TableHead class="font-medium text-xs text-gray-500">Username</TableHead>
				<TableHead class="font-medium text-xs text-gray-500">Role</TableHead>
				<TableHead class="font-medium text-xs text-gray-500">Status</TableHead>
				<TableHead class="font-medium text-xs text-gray-500">Created at</TableHead>
				<TableHead class="font-medium text-xs text-gray-500 w-[3rem]"></TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#if loading}
				{#each Array(6) as _}
					<TableRow>
						{#each Array(6) as _}
							<TableCell>
								<Skeleton class="w-full h-6 rounded-md bg-slate-200" />
							</TableCell>
						{/each}
					</TableRow>
				{/each}
			{:else if users.length > 0}
				{#each users as user (user._id)}
					<TableRow>
						<TableCell>
							<div
								role="button"
								tabindex="0"
								class="hover:underline hover:underline-offset-4 hover:decoration hover:decoration-green-700 hover:underline-2 cursor-pointer"
								onclick={() => goto(`${Routes.Users}/${user._id}`)}
								onkeydown={(e) => {
									if (e.key === 'Enter') {
										goto(`${Routes.Users}/${user._id}`);
									}
								}}
							>
								{user.firstname}
								{user.lastname}
							</div>
						</TableCell>
						<TableCell>{user.username}</TableCell>
						<TableCell>
							<UserTypePill type={user.role} />
						</TableCell>
						<TableCell>
							<UserStatusPill status={user.status} />
						</TableCell>
						<TableCell>{formateDate(user.createdAt || '')}</TableCell>
						<TableCell>
							<UsersDataTableActions
								disabledDelete={user.status === UserStatusEnum.Deleted}
								id={user._id}
								viewUser={() => {
									goto(`${Routes.Users}/${user._id}`);
								}}
								deleteUser={() => {
									activeUser = user;
									deleteUserDialogOpen = true;
								}}
							/>
						</TableCell>
					</TableRow>
				{/each}
			{:else}
				<TableRow>
					<TableCell colspan={6} class="text-center text-xs text-gray-500 py-4 font-bold"
						>No users found</TableCell
					>
				</TableRow>
			{/if}
		</TableBody>
	</Table>
</div>

<AlertDialog bind:open={deleteUserDialogOpen}>
	<AlertDialogContent>
		<AlertDialogTitle>Are you sure?</AlertDialogTitle>
		<AlertDialogDescription
			>Are you sure you want to delete the user <span class="font-bold">{activeUser?.username}</span
			>?</AlertDialogDescription
		>
		<AlertDialogFooter>
			<Button variant="outline" size="sm" on:click={() => (deleteUserDialogOpen = false)}
				>No, cancel</Button
			>
			<Button variant="destructive" size="sm" on:click={handleDeleteUser}>Yes, delete</Button>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>

{#if !loading}
	<div class="flex justify-between items-center gap-4">
		<div class="ml-2">
			<p class="text-xs font-bold">Page {page} of {pageCount}</p>
		</div>
		<div class="flex items-center justify-end space-x-2 py-2">
			<Button
				variant="outline"
				size="sm"
				on:click={() => handlePreviousPage()}
				disabled={!hasPreviousPage}
			>
				<ChevronLeft class="w-3 h-3" />
			</Button>
			<Button variant="outline" size="sm" disabled={!hasNextPage} on:click={() => handleNextPage()}>
				<ChevronRight class="w-3 h-3" />
			</Button>
		</div>
	</div>
{/if}
