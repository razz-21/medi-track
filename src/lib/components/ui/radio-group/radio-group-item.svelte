<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';
	import { Check } from '@lucide/svelte';
	import { cn } from '$lib/utils.js';

	type $$Props = RadioGroupPrimitive.ItemProps & {
		value: string;
	};
	type $$Events = RadioGroupPrimitive.ItemEvents;

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'];
	export { className as class };
</script>

<RadioGroupPrimitive.Item
	{value}
	class={cn(
		'border-primary text-primary focus-visible:ring-ring aspect-square h-4 w-4 rounded-full border shadow focus:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{...$$restProps}
	on:click
>
	<div class="flex items-center justify-center">
		<RadioGroupPrimitive.ItemIndicator>
			<Check class="text-primary h-2.5 w-2.5" strokeWidth={3} />
		</RadioGroupPrimitive.ItemIndicator>
	</div>
</RadioGroupPrimitive.Item>
