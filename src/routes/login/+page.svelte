<script lang="ts" module>
	type ErrorMessage = {
		title: string;
		message: string;
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import type { AuthLogin } from '$lib/models/authentication/authentication.type';
	import { Loader2, TriangleAlert } from '@lucide/svelte';
	import { loginUserHandler } from '$lib/handler/login/login-user.handler';
	import { AUTH_STORAGE_KEY } from '$lib/models/common/constants';
	import { userStore } from '$lib/store/user.store';
	import { onMount } from 'svelte';
	import type { User } from '$lib/models/user/user.type';

	let { data }: { data: { user: User } } = $props();

	let form = $state<AuthLogin>({
		username: '',
		password: ''
	});
	let loading = $state(false);
	let errorMessage = $state<ErrorMessage | null>(null);

	onMount(() => {
		console.log(data);
	});

	async function handleLogin() {
		loading = true;

		try {
			const result = await loginUserHandler(form);
			localStorage.setItem(AUTH_STORAGE_KEY, result.accessToken);
			userStore.set(result.user);

			goto('/app');
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = {
					title: 'Error',
					message: error.message
				};
			}
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex flex-col items-center justify-center h-screen bg-gray-100">
	<div class="rounded-lg p-6 lg:p-10 w-full max-w-[30rem] bg-white">
		<img src="/logo/meditrack-logo.svg" alt="Meditrack" class="size-12 mx-auto mb-4" />

		<h2 class="text-3xl font-bold text-center mb-1">Welcome to Meditrack</h2>
		<p class="text-sm font-light text-center text-gray-500">A health tracker management system</p>

		{#if errorMessage}
			<div class="mt-4">
				<Alert variant="destructive">
					<TriangleAlert class="h-4 w-4" />
					<AlertTitle>{errorMessage.title}</AlertTitle>
					<AlertDescription class="text-xs">{errorMessage.message}</AlertDescription>
				</Alert>
			</div>
		{/if}

		<form class="flex flex-col gap-4 mt-6">
			<div class="flex flex-col gap-2">
				<Label for="username">Username</Label>
				<Input bind:value={form.username} type="text" placeholder="Enter username" />
			</div>

			<div class="flex flex-col gap-2">
				<Label for="password">Password</Label>
				<Input bind:value={form.password} type="password" placeholder="Enter password" />
			</div>

			<div class="w-full">
				<Button type="submit" class="w-full" on:click={handleLogin} disabled={loading}>
					<div class="flex items-center justify-center">
						{#if loading}
							<Loader2 class="size-4 mr-2 animate-spin" />
						{/if}
						{loading ? 'Logging in...' : 'Login'}
					</div>
				</Button>
			</div>
		</form>
	</div>
</div>
