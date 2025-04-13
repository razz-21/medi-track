<script lang="ts">
	const generateRandomPercentages = (count: number) => {
		const numbers = Array.from({ length: count }, () => Math.random());
		const sum = numbers.reduce((a, b) => a + b, 0);
		return numbers.map((n) => Math.round((n / sum) * 100));
	};

	const percentages = generateRandomPercentages(14);

	const baranggays = [
		{ name: 'Poblacion', percentage: percentages[0] },
		{ name: 'Sinaloc', percentage: percentages[1] },
		{ name: 'PSB', percentage: percentages[2] },
		{ name: 'Taytay', percentage: percentages[3] },
		{ name: 'Amoros', percentage: percentages[4] },
		{ name: 'Molugan', percentage: percentages[5] },
		{ name: 'Cogon', percentage: percentages[6] },
		{ name: 'Himaya', percentage: percentages[7] },
		{ name: 'Ulaliman', percentage: percentages[8] },
		{ name: 'Quibonbon', percentage: percentages[9] },
		{ name: 'Kalabaylabay', percentage: percentages[10] },
		{ name: 'Hinigdaan', percentage: percentages[11] },
		{ name: 'Bolisong', percentage: percentages[12] },
		{ name: 'Sambulawan', percentage: percentages[13] }
	];

	const sortedBaranggays = baranggays.sort((a, b) => b.percentage - a.percentage);
</script>

<div class="w-full border border-gray-200 rounded-lg p-4">
	<h3 class="text-sm font-bold">Patient with diseases per baranggay</h3>

	<div class="flex items-center justify-between mt-4">
		<div class="flex flex-col gap-2 w-full">
			{#each sortedBaranggays as baranggay (baranggay.name)}
				<div class="flex flex-col gap-2">
					<div class="flex items-center justify-between gap-1">
						<div class="text-xs">{baranggay.name}</div>
						<div class="text-xs">{baranggay.percentage}%</div>
					</div>

					<div class="h-3 bg-gray-100 rounded-full">
						<div
							class="h-3 bg-green-400 rounded-full"
							style="width: {baranggay.percentage}%;"
						></div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
