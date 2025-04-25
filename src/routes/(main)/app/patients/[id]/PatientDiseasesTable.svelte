<script lang="ts">
	import {
		TableHeader,
		TableRow,
		TableHead,
		TableBody,
		TableCell,
		Table
	} from '$lib/components/ui/table';

	const diseases = [
		{
			disease: 'BCG',
			date: '2021-01-01'
		},
		{
			disease: 'BCG',
			date: '2021-01-01'
		},
		{
			disease: 'BCG',
			date: '2021-01-01'
		},
		{
			disease: 'BCG',
			date: '2021-01-01'
		}
	];

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString();
	}
</script>

<div class="flex flex-col gap-2">
	<h2 class="text-sm font-bold">Recent Diseases</h2>
	<div class="rounded-md border">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead class="font-medium text-xs text-gray-500">Disease</TableHead>
					<TableHead class="font-medium text-xs text-gray-500">Date</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each diseases as disease}
					<TableRow>
						<TableCell>{disease.disease}</TableCell>
						<TableCell>{formatDate(disease.date)}</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
