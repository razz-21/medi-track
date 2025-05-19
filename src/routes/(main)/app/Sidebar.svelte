<script lang="ts">
	import { User, Users, LogOut, ChartArea, UserRoundPlus, Syringe, Dna } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { Routes } from '$lib/models/navigation/routes';
	import { page } from '$app/stores';
	import { logoutUserHandler } from '$lib/handler/login/logout-user.handler';
	import { userStore } from '$lib/store/user.store';
	import { isUserAdmin } from '$lib/store/user.store';

	let user = $userStore;
	let userFirstNameLetter = $derived(user?.firstname?.[0]);
	let activeRoute = $derived($page.url.pathname);

	function navigate(path: string) {
		goto(path);
	}

	function handleLogout() {
		logoutUserHandler();
	}
</script>

<div class="sidebar-container">
	<div class="sidebar-user">
		<div class="sidebar-user-avatar">
			<span class="text-white text-xs font-bold">{userFirstNameLetter}</span>
		</div>
		<span class="text-xs font-bold">{user?.firstname} {user?.lastname}</span>
	</div>

	<div class="sidebar-navigation">
		<div
			role="button"
			tabindex="0"
			class="sidebar-navigation-item"
			class:active={activeRoute.includes(Routes.Dashboard)}
			onclick={() => navigate(Routes.Dashboard)}
			onkeydown={(e) => e.key === 'Enter' && navigate(Routes.Dashboard)}
		>
			<ChartArea class="w-4 h-4" />
			<span>Dashboard</span>
		</div>

		<div
			role="button"
			tabindex="0"
			class="sidebar-navigation-item"
			class:active={activeRoute.includes(Routes.Patients)}
			onclick={() => navigate(Routes.Patients)}
			onkeydown={(e) => e.key === 'Enter' && navigate(Routes.Patients)}
		>
			<UserRoundPlus class="w-4 h-4" />
			<span>Residents</span>
		</div>

		<div
			role="button"
			tabindex="0"
			class="sidebar-navigation-item"
			class:active={activeRoute.includes(Routes.VaccineReports)}
			onclick={() => navigate(Routes.VaccineReports)}
			onkeydown={(e) => e.key === 'Enter' && navigate(Routes.VaccineReports)}
		>
			<Syringe class="w-4 h-4" />
			<span>Vaccine Reports</span>
		</div>

		<div
			role="button"
			tabindex="0"
			class="sidebar-navigation-item"
			class:active={activeRoute.includes(Routes.DiseaseReports)}
			onclick={() => navigate(Routes.DiseaseReports)}
			onkeydown={(e) => e.key === 'Enter' && navigate(Routes.DiseaseReports)}
		>
			<Dna class="w-4 h-4" />
			<span>Disease Reports</span>
		</div>

		{#if isUserAdmin()}
			<div
				role="button"
				tabindex="0"
				class="sidebar-navigation-item"
				class:active={activeRoute.includes(Routes.Users)}
				onclick={() => navigate(Routes.Users)}
				onkeydown={(e) => e.key === 'Enter' && navigate(Routes.Users)}
			>
				<Users class="w-4 h-4" />
				<span>Users</span>
			</div>
		{/if}
	</div>

	<div class="sidebar-footer">
		<div class="sidebar-navigation">
			<div
				role="button"
				tabindex="0"
				class="sidebar-navigation-item"
				class:active={activeRoute.includes(Routes.Profile)}
				onclick={() => navigate(Routes.Profile)}
				onkeydown={(e) => e.key === 'Enter' && navigate(Routes.Profile)}
			>
				<User class="w-4 h-4" />
				<span>Profile</span>
			</div>

			<div
				role="button"
				tabindex="0"
				class="sidebar-navigation-item"
				onclick={handleLogout}
				onkeydown={(e) => e.key === 'Enter' && handleLogout()}
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
		@apply flex flex-col h-full p-4 fixed top-0 left-0 w-[280px];
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
		@apply bg-green-200 font-bold text-green-900;
	}

	.sidebar-footer {
		@apply mt-auto;
	}
</style>
