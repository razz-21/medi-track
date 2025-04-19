<script lang="ts">
	import { goto } from '$app/navigation';
	import { Routes } from '$lib/models/navigation/routes';
	import type { User } from '$lib/models/user/user.type';
	import { userStore } from '$lib/store/user.store';

	let { data }: { data: { user: User } } = $props();

	$userStore = data.user;

	if ($userStore) {
		goto(Routes.Dashboard);
	} else {
		goto(Routes.Login);
	}
</script>
