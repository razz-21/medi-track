<script lang="ts" module>
	import { Button } from '$lib/components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { Ellipsis, Eye } from '@lucide/svelte';

	type Props = {
		id: string;
		viewReport: (id: string) => void;
	};
</script>

<script lang="ts">
	const { id, viewReport }: Props = $props();
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
			<DropdownMenuItem on:click={() => viewReport(id)} class="font-medium cursor-pointer">
				<Eye class="w-4 h-4" />
				<span class="ml-2">View</span>
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</div>
