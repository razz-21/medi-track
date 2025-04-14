<script lang="ts">
	import { User, Users, LogOut, ChartArea, UserRoundPlus, ClipboardMinus } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { Routes } from '$lib/models/navigation/routes';
	import { page } from '$app/stores';

	let activeRoute = $derived($page.url.pathname);

	function navigate(path: string) {
		goto(path);
	}

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
		<div
			role="button"
			tabindex="0"
			class="sidebar-navigation-item"
			class:active={activeRoute === Routes.Dashboard}
			on:click={() => navigate(Routes.Dashboard)}
			on:keydown={(e) => e.key === 'Enter' && navigate(Routes.Dashboard)}
		>
			<ChartArea class="w-4 h-4" />
			<span>Dashboard</span>
		</div>

		<div
			role="button"
			tabindex="0"
			class="sidebar-navigation-item"
			class:active={activeRoute === Routes.Patients}
			on:click={() => navigate(Routes.Patients)}
			on:keydown={(e) => e.key === 'Enter' && navigate(Routes.Patients)}
		>
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

<style lang="postcss">
	@reference 'tailwindcss';

	.sidebar-container {
		@apply flex flex-col h-full p-4 fixed top-0 left-0 w-[240px];
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
		@apply flex items-center gap-2 p-2 mx-[-4px] text-xs hover:bg-gray-100 rounded-md cursor-pointer;
	}

	.sidebar-navigation-item.active {
		@apply bg-green-100;
	}

	.sidebar-footer {
		@apply mt-auto;
	}
</style>
