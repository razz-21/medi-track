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

	type User = {
		id: string;
		name: string;
		role: string;
		username: string;
		status: string;
		createdAt: string;
	};
</script>

<script lang="ts">
	let pageIndex = $state(1);
	let pageCount = $state(10);
	let hasPreviousPage = $state(true);
	let hasNextPage = $state(true);

	const users: User[] = [
		{
			id: '1',
			name: 'John Doe',
			role: 'Admin',
			username: 'john.doe',
			status: 'active',
			createdAt: '2021-01-01'
		},
		{
			id: '2',
			name: 'Jane Doe',
			role: 'Encoder',
			username: 'jane.doe',
			status: 'inactive',
			createdAt: '2021-01-01'
		},
		{
			id: '3',
			name: 'John Doe',
			role: 'Admin',
			username: 'john.doe',
			status: 'deleted',
			createdAt: '2021-01-01'
		}
	];

	function formateDate(date: string) {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
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
			{#each users as user (user.id)}
				<TableRow>
					<TableCell>
						<div
							role="button"
							tabindex="0"
							class="hover:underline hover:underline-offset-4 hover:decoration hover:decoration-green-700 hover:underline-2 cursor-pointer"
							onclick={() => goto(`${Routes.Users}/${user.id}`)}
							onkeydown={(e) => {
								if (e.key === 'Enter') {
									goto(`${Routes.Users}/${user.id}`);
								}
							}}
						>
							{user.name}
						</div>
					</TableCell>
					<TableCell>{user.username}</TableCell>
					<TableCell>{user.role}</TableCell>
					<TableCell>
						<UserStatusPill status={user.status} />
					</TableCell>
					<TableCell>{formateDate(user.createdAt)}</TableCell>
					<TableCell>
						<UsersDataTableActions
							id={user.id}
							viewUser={() => {
								goto(`${Routes.Users}/${user.id}`);
							}}
							deleteUser={() => {}}
						/>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>

<div class="flex justify-between items-center gap-4">
	<div class="ml-2">
		<p class="text-xs font-bold">
			Page {pageIndex + 1} of {pageCount}
		</p>
	</div>
	<div class="flex items-center justify-end space-x-2 py-2">
		<Button
			variant="outline"
			size="sm"
			on:click={() => (pageIndex = pageIndex - 1)}
			disabled={!hasPreviousPage}
		>
			<ChevronLeft class="w-3 h-3" />
		</Button>
		<Button
			variant="outline"
			size="sm"
			disabled={!hasNextPage}
			on:click={() => (pageIndex = pageIndex + 1)}
		>
			<ChevronRight class="w-3 h-3" />
		</Button>
	</div>
</div>
