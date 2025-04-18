<script lang="ts">
	import { UserRoundCheck, UserPen, UserRound } from '@lucide/svelte';
	import UserStatusPill from '../UserStatusPill.svelte';
</script>

<div class="rounded-lg p-2">
	<div class="flex flex-col gap-4">
		<div class="flex items-center gap-2">
			<UserRound class="w-6 h-6 text-gray-700" />
			<div class="flex flex-col">
				<p class="text-sm">
					<UserStatusPill status="active" />
				</p>
			</div>
		</div>
		<div class="flex items-center gap-2">
			<UserRoundCheck class="w-6 h-6 text-gray-700" />
			<div class="flex flex-col">
				<p class="text-xs text-gray-500">User created</p>
				<p class="text-sm font-medium">January 12, 2024</p>
			</div>
		</div>

		<div class="flex items-center gap-2">
			<UserPen class="w-6 h-6 text-gray-700" />
			<div class="flex flex-col">
				<p class="text-xs text-gray-500">User updated</p>
				<p class="text-sm font-medium">January 12, 2024</p>
			</div>
		</div>
	</div>
</div>
