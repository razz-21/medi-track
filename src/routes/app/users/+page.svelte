<script lang="ts" module>
	import { Button } from '$lib/components/ui/button';
	import { Plus } from '@lucide/svelte';
	import UsersDataTable from './UsersDataTable.svelte';
	import {
		Select,
		SelectContent,
		SelectInput,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { Routes } from '$lib/models/navigation/routes';
	import { goto } from '$app/navigation';

	let search = $state('');
	let selectedRole = $state('all');

	function handleCreateUser() {
		goto(Routes.UsersCreate);
	}
</script>

<div class="max-w-[1440px] flex flex-col gap-4">
	<div class="flex items-center justify-between mt-4">
		<div>
			<h2 class="text-2xl font-bold">Users</h2>
			<p class="text-xs text-gray-400">List of all users</p>
		</div>

		<div class="flex items-center gap-2">
			<Button size="sm" on:click={handleCreateUser}>
				<Plus class="w-4 h-4" />
				Add user
			</Button>
		</div>
	</div>

	<hr />

	<div class="users-table-container">
		<div class="flex items-center gap-2 mb-2">
			<div class="w-[18rem]">
				<Input bind:value={search} type="text" placeholder="Search by name" class="w-full" />
			</div>
			<div class="w-[12rem]">
				<Select onSelectedChange={(v) => (selectedRole = v?.value as string)}>
					<SelectTrigger>
						<SelectValue placeholder="Select role" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All</SelectItem>
						<SelectItem value="admin">Admin</SelectItem>
						<SelectItem value="encoder">Encoder</SelectItem>
					</SelectContent>
					<SelectInput bind:value={selectedRole} name="filter-role" />
				</Select>
			</div>
		</div>
		<UsersDataTable />
	</div>
</div>
