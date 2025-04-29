<script lang="ts" module>
	type Props = {
		user: UserGet;
	};
</script>

<script lang="ts">
	import { UserRoundCheck, UserPen, UserRound } from '@lucide/svelte';
	import UserStatusPill from '../UserStatusPill.svelte';
	import type { UserGet } from '$lib/models/user/user.type';

	const df = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	});

	let { user = {} as UserGet }: Props = $props();
</script>

<div class="rounded-lg p-2">
	<div class="flex flex-col gap-4">
		<div class="flex items-center gap-2">
			<UserRound class="w-6 h-6 text-gray-700" />
			<div class="flex flex-col">
				<p class="text-sm">
					<UserStatusPill status={user.status} />
				</p>
			</div>
		</div>
		<div class="flex items-center gap-2">
			<UserRoundCheck class="w-6 h-6 text-gray-700" />
			<div class="flex flex-col">
				<p class="text-xs text-gray-500">User created</p>
				<p class="text-sm font-medium">{df.format(new Date(user?.createdAt ?? ''))}</p>
			</div>
		</div>

		<div class="flex items-center gap-2">
			<UserPen class="w-6 h-6 text-gray-700" />
			<div class="flex flex-col">
				<p class="text-xs text-gray-500">User updated</p>
				<p class="text-sm font-medium">{df.format(new Date(user?.updatedAt ?? ''))}</p>
			</div>
		</div>
	</div>
</div>
