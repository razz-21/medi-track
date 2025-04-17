<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	function handleLogin() {
		console.log('login');
		goto('/app');
	}
</script>

<div class="flex flex-col items-center justify-center h-screen bg-gray-100">
	<div class="rounded-lg p-6 lg:p-10 w-full max-w-[30rem] bg-white">
		<img src="/logo/meditrack-logo.svg" alt="Meditrack" class="size-12 mx-auto mb-4" />

		<h2 class="text-3xl font-bold text-center mb-1">Welcome to Meditrack</h2>
		<p class="text-sm font-light text-center text-gray-500">A health tracker management system</p>

		<form class="flex flex-col gap-4 mt-6">
			<div class="flex flex-col gap-2">
				<label for="username" class="text-sm">Username</label>
				<Input type="text" placeholder="Enter username" />
			</div>

			<div class="flex flex-col gap-2">
				<label for="password" class="text-sm">Password</label>
				<Input type="password" placeholder="Enter password" />
			</div>

			<div class="w-full">
				<Button type="submit" class="w-full" on:click={handleLogin}>Login</Button>
			</div>
		</form>
	</div>
</div>
