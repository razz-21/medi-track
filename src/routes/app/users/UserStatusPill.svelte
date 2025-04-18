<script lang="ts" module>
	import { type UserStatus, UserStatusEnum } from '$lib/models/user/user.type';
	type Props = {
		status: UserStatus;
	};
</script>

<script lang="ts">
	const { status }: Props = $props();

	let color = $derived(() => {
		if (status === UserStatusEnum.Active) return 'border border-emerald-500 text-emerald-700';
		if (status === UserStatusEnum.Deleted) return 'border border-rose-500 text-rose-700';
		if (status === UserStatusEnum.Inactive) return 'border border-yellow-500 text-yellow-700';
		return 'border border-gray-500 text-gray-600';
	});
</script>

<div class="rounded-md px-3 py-1 w-fit text-xs font-medium capitalize {color()}">
	{status}
</div>
