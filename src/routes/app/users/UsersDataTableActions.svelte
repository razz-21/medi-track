<script lang="ts" module>
	import {
		DropdownMenu,
		DropdownMenuTrigger,
		DropdownMenuContent,
		DropdownMenuItem
	} from '$lib/components/ui/dropdown-menu';
	import { Ellipsis, Eye, Trash } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	type Props = {
		id: string;
		disabledDelete?: boolean;
		viewUser: (id: string) => void;
		deleteUser: (id: string) => void;
	};
</script>

<script lang="ts">
	const { id, viewUser, deleteUser, disabledDelete = false }: Props = $props();
</script>

<div class="w-full flex justify-end">
	<DropdownMenu>
		<DropdownMenuTrigger asChild let:builder>
			<Button size="icon" variant="ghost" builders={[builder]} class="relative h-8 w-8">
				<span class="sr-only">Open menu</span>
				<Ellipsis class="h-4 w-4" />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent>
			<DropdownMenuItem on:click={() => viewUser(id)} class="font-medium cursor-pointer">
				<Eye class="w-4 h-4" />
				<span class="ml-2">View</span>
			</DropdownMenuItem>
			<DropdownMenuItem
				disabled={disabledDelete}
				on:click={() => deleteUser(id)}
				class="font-medium cursor-pointer"
			>
				<Trash class="w-4 h-4 text-rose-400" />
				<span class="ml-2 text-rose-500">Delete</span>
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</div>
