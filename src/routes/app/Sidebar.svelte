<script lang="ts">
	import { User, Users, LogOut, ChartArea, UserRoundPlus, ClipboardMinus } from '@lucide/svelte';
	import { goto } from '$app/navigation';

	function handleLogout() {
		goto('/login');
	}
</script>

<div class="sidebar-container">
	<div class="sidebar-user">
		<div class="sidebar-user-avatar">
			<span class="text-white text-xs font-bold">T</span>
		</div>
		<span class="text-xs font-bold">Ernesto Razo</span>
	</div>

	<div class="sidebar-navigation">
		<div class="sidebar-navigation-item active">
			<ChartArea class="w-4 h-4" />
			<span>Dashboard</span>
		</div>

		<div class="sidebar-navigation-item">
			<UserRoundPlus class="w-4 h-4" />
			<span>Patients</span>
		</div>

		<div class="sidebar-navigation-item">
			<ClipboardMinus class="w-4 h-4" />
			<span>Diagnosis</span>
		</div>

		<div class="sidebar-navigation-item">
			<Users class="w-4 h-4" />
			<span>Users</span>
		</div>
	</div>

	<div class="sidebar-footer">
		<div class="sidebar-navigation">
			<div class="sidebar-navigation-item">
				<User class="w-4 h-4" />
				<span>Profile</span>
			</div>

			<div
				role="button"
				tabindex="0"
				class="sidebar-navigation-item"
				on:click={handleLogout}
				on:keydown={(e) => e.key === 'Enter' && handleLogout()}
			>
				<LogOut class="w-4 h-4" />
				<span>Logout</span>
			</div>
		</div>
	</div>
</div>

<style>
	@reference 'tailwindcss';

	.sidebar-container {
		@apply flex flex-col h-full p-4;
	}

	.sidebar-user {
		@apply flex items-center gap-2 py-1;
	}

	.sidebar-user-avatar {
		@apply w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center;
	}

	.sidebar-navigation {
		@apply flex flex-col mt-4;
	}

	.sidebar-navigation-item {
		@apply flex items-center gap-2 p-2 mx-[-4px] text-sm hover:bg-gray-100 rounded-md cursor-pointer;
	}

	.sidebar-navigation-item.active {
		@apply bg-green-500 text-white;
	}

	.sidebar-footer {
		@apply mt-auto;
	}
</style>
