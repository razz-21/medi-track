<script lang="ts">
	import { goto } from '$app/navigation';
	import { Routes } from '$lib/models/navigation/routes';
	import { isAuthenticated } from '$lib/utils/auth.util';

	if (isAuthenticated()) {
		goto(Routes.Dashboard);
	} else {
		goto(Routes.Login);
	}
</script>
