<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-col gap-2">
		<Label class="text-xs">First name</Label>
		<Input />
	</div>

	<div class="flex flex-col gap-2">
		<Label class="text-xs">Last name</Label>
		<Input />
	</div>

	<div class="flex flex-col gap-2">
		<Label class="text-xs">Email</Label>
		<Input />
	</div>

	<div class="flex flex-col gap-2">
		<Label class="text-xs">Address</Label>
		<Input />
	</div>
</div>
