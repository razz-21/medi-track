<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import PatientStatusPill from '../PatientStatusPill.svelte';

	// For Female Avatar
	// https://avatar.iran.liara.run/public/67

	// For Male Avatar
	// https://avatar.iran.liara.run/public/21
</script>

<div class="bg-slate-50 rounded-lg py-6 px-4">
	<div class="flex items-center justify-between">
		<div class="w-1/3 border-r border-gray flex flex-col items-center gap-2">
			<div class="p-2 border-gray">
				<img
					src="https://avatar.iran.liara.run/public/21"
					class="size-32 rounded-full border-4 border-green-300"
					alt="Meditrack"
				/>
			</div>

			<div class="text-center">
				<h2 class="text-2xl font-medium">John Doe</h2>
				<div class="text-xs text-gray-500">john.doe@example.com</div>
			</div>

			<div class="mt-2">
				<Button variant="outline" size="sm">Upload image</Button>
			</div>
		</div>

		<div class="w-2/3 grid grid-cols-3 gap-x-4 gap-y-6 mx-6 py-4 flex-wrap">
			<div class="flex flex-col">
				<div class="flex flex-col gap-1">
					<h3 class="text-xs text-gray-400">Full name</h3>
					<p class="text-sm font-medium">John Doe</p>
				</div>
			</div>

			<div class="flex flex-col">
				<div class="flex flex-col gap-1">
					<h3 class="text-xs text-gray-400">Gender</h3>
					<p class="text-sm font-medium">Male</p>
				</div>
			</div>

			<div class="flex flex-col">
				<div class="flex flex-col gap-1">
					<h3 class="text-xs text-gray-400">Date of birth</h3>
					<p class="text-sm font-medium">1990-01-01</p>
				</div>
			</div>

			<div class="col-span-2 flex flex-col">
				<div class="flex flex-col gap-1">
					<h3 class="text-xs text-gray-400">Address</h3>
					<p class="text-sm font-medium">123 Main St, Anytown, USA</p>
				</div>
			</div>

			<div class="flex flex-col">
				<div class="flex flex-col gap-1">
					<h3 class="text-xs text-gray-400">Contact number</h3>
					<p class="text-sm font-medium">+1234567890</p>
				</div>
			</div>

			<div class="flex flex-col">
				<div class="flex flex-col gap-1">
					<h3 class="text-xs text-gray-400">Status</h3>
					<PatientStatusPill status="active" />
				</div>
			</div>

			<div class="flex flex-col">
				<div class="flex flex-col gap-1">
					<h3 class="text-xs text-gray-400">Created at</h3>
					<p class="text-sm font-medium">2021-01-01</p>
				</div>
			</div>
		</div>
	</div>
</div>
