<script lang="ts">
	import {
		TableHeader,
		TableRow,
		TableHead,
		TableBody,
		TableCell,
		Table
	} from '$lib/components/ui/table';

	const vaccines = [
		{
			vaccine: 'BCG',
			dose: '1',
			date: '2021-01-01'
		},
		{
			vaccine: 'BCG',
			dose: '1',
			date: '2021-01-01'
		},
		{
			vaccine: 'BCG',
			dose: '1',
			date: '2021-01-01'
		},
		{
			vaccine: 'BCG',
			dose: '1',
			date: '2021-01-01'
		}
	];

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString();
	}
</script>

<div class="flex flex-col gap-2">
	<h2 class="text-sm font-bold">Recent Vaccines</h2>
	<div class="rounded-md border">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead class="font-medium text-xs text-gray-500">Vaccine</TableHead>
					<TableHead class="font-medium text-xs text-gray-500">Dose</TableHead>
					<TableHead class="font-medium text-xs text-gray-500">Date</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each vaccines as vaccine}
					<TableRow>
						<TableCell>{vaccine.vaccine}</TableCell>
						<TableCell>{vaccine.dose}</TableCell>
						<TableCell>{formatDate(vaccine.date)}</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
