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
	import { onMount } from 'svelte';
	import { getUserTableHandler } from '$lib/handler/users/get-user-table.handler';
	import {
		UserStatusEnum,
		UserTypeEnum,
		type UserGetTable,
		type UserType
	} from '$lib/models/user/user.type';
	import { debounce } from '$lib/utils/common.util';
	import { toast } from 'svelte-sonner';
	import { patchUserHandler } from '$lib/handler/users/patch-user.handler';
	import { isUserAdmin } from '$lib/store/user.store';
</script>

<script lang="ts">
	let usersTable = $state({} as UserGetTable);
	let search = $state('');
	let selectedRole = $state('');
	let page = $state(1);
	let limit = $state(10);
	let total = $derived(usersTable.total ?? 0);
	let count = $derived(usersTable.count ?? 0);
	let loadingTable = $state(true);
	let filterRoleInitialSelected = { label: 'All', value: '' };

	if (!isUserAdmin()) {
		goto(Routes.Dashboard);
	}

	onMount(async () => {
		fetchUsers();
	});

	const searchUser = debounce(() => {
		fetchUsers();
	}, 500);

	async function fetchUsers() {
		try {
			loadingTable = true;
			usersTable = await getUserTableHandler({
				page,
				limit,
				...(search ? { q: search } : {}),
				...(selectedRole ? { type: selectedRole as UserType } : {})
			});
			loadingTable = false;
		} catch (error) {
			console.error(error);
		}
	}

	function handleFilterRoleChange(value: string) {
		selectedRole = value;
		fetchUsers();
	}

	function handleCreateUser() {
		goto(Routes.UsersCreate);
	}

	async function handlePageChange() {
		fetchUsers();
	}

	async function handleDeleteUser(user: UserGetTable['users'][0]) {
		const toastId = toast.loading('Deleting user');
		try {
			await patchUserHandler(user._id, { status: UserStatusEnum.Deleted });
			user.status = UserStatusEnum.Deleted;
			toast.success('User deleted successfully', { id: toastId });

			usersTable.users = usersTable.users.map((u) => {
				if (u._id === user._id) {
					u.status = UserStatusEnum.Deleted;
				}
				return u;
			});
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message, { id: toastId });
			}
		}
	}
</script>

<div class="max-w-[1440px] flex flex-col gap-4">
	<div class="flex items-center justify-between mt-4">
		<div>
			<h2 class="text-2xl font-bold">Users <span class="text-sm text-gray-400">({count})</span></h2>
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
				<Input
					bind:value={search}
					type="search"
					placeholder="Search by name"
					class="w-full"
					oninput={searchUser}
				/>
			</div>
			<div class="w-[12rem]">
				<Select
					selected={filterRoleInitialSelected}
					onSelectedChange={(v) => handleFilterRoleChange(v?.value as string)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select role" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">All</SelectItem>
						<SelectItem value={UserTypeEnum.Admin}>Admin</SelectItem>
						<SelectItem value={UserTypeEnum.Encoder}>Encoder</SelectItem>
					</SelectContent>
					<SelectInput bind:value={selectedRole} name="filter-role" />
				</Select>
			</div>
		</div>
		<UsersDataTable
			bind:loading={loadingTable}
			bind:page
			bind:limit
			bind:total
			users={usersTable.users}
			deleteUser={handleDeleteUser}
			pageChange={handlePageChange}
		/>
	</div>
</div>
