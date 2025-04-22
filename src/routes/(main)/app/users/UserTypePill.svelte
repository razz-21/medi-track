<script lang="ts" module>
	import { UserStatusEnum, UserTypeEnum, type UserType } from '$lib/models/user/user.type';
	import { User, UserPen, UserRoundCog } from '@lucide/svelte';
	type Props = {
		type: UserType;
	};
</script>

<script lang="ts">
	const { type }: Props = $props();
</script>

<div
	class="flex items-center gap-1 rounded-md px-3 py-1 w-fit text-xs font-medium capitalize border border-gray-300 text-gray-900"
>
	{#if type === UserTypeEnum.Admin}
		<UserRoundCog class="w-3 h-3" />
	{:else if type === UserTypeEnum.Encoder}
		<UserPen class="w-3 h-3" />
	{:else}
		<User class="w-3 h-3" />
	{/if}
	{type}
</div>
