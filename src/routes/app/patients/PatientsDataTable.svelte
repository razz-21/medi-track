<script lang="ts" module>
	import {
		Table,
		TableHeader,
		TableHead,
		TableRow,
		TableCell,
		TableBody
	} from '$lib/components/ui/table/index.js';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import PatientsDataTableActions from './PatientsDataTableActions.svelte';
	import PatientStatusPill from './PatientStatusPill.svelte';
	import { Button } from '$lib/components/ui/button';
	import { addPagination } from 'svelte-headless-table/plugins';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';

	type Patient = {
		id: string;
		name: string;
		gender: string;
		status: string;
		dateOfBirth: string;
		createdAt: string;
	};
</script>

<script lang="ts">
	const patients: Patient[] = [
		{
			id: '1',
			name: 'John Doe',
			gender: 'Male',
			status: 'active',
			dateOfBirth: '1990-01-01',
			createdAt: '2021-01-01'
		},
		{
			id: '2',
			name: 'Jane Doe',
			gender: 'Female',
			status: 'inactive',
			dateOfBirth: '1990-01-01',
			createdAt: '2021-01-01'
		}
	];

	const table = createTable(readable(patients), {
		page: addPagination()
	});

	const columns = table.createColumns([
		table.column({
			header: 'Name',
			accessor: 'name'
		}),
		table.column({
			header: 'Gender',
			accessor: 'gender'
		}),
		table.column({
			header: 'Date of birth',
			accessor: 'dateOfBirth',
			cell: ({ value }) => {
				return new Date(value).toLocaleDateString('en-US', {
					month: 'long',
					day: 'numeric',
					year: 'numeric'
				});
			}
		}),
		table.column({
			accessor: 'status',
			header: 'Status',
			cell: ({ value }) => {
				return createRender(PatientStatusPill, { status: value });
			}
		}),
		table.column({
			header: 'Created at',
			accessor: 'createdAt',
			cell: ({ value }) => {
				return new Date(value).toLocaleDateString('en-US', {
					month: 'long',
					day: 'numeric',
					year: 'numeric'
				});
			}
		}),
		table.column({
			accessor: ({ id }) => id,
			header: '',
			cell: ({ value }) => {
				return createRender(PatientsDataTableActions, {
					id: value,
					viewPatient: () => {},
					deletePatient: () => {}
				});
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { hasNextPage, hasPreviousPage, pageIndex, pageCount } = pluginStates.page;
</script>

<div class="rounded-md border">
	<Table {...$tableAttrs} class="bg-white rounded-md">
		<TableHeader>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<TableRow>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<TableHead {...attrs} class="font-medium text-xs text-gray-500">
									<Render of={cell.render()} />
								</TableHead>
							</Subscribe>
						{/each}
					</TableRow>
				</Subscribe>
			{/each}
		</TableHeader>
		<TableBody {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<TableRow {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<TableCell {...attrs}>
									<Render of={cell.render()} />
								</TableCell>
							</Subscribe>
						{/each}
					</TableRow>
				</Subscribe>
			{/each}
		</TableBody>
	</Table>
</div>

<div class="flex justify-between gap-4">
	<div class="ml-2">
		<p class="text-xs font-bold">
			Page {$pageIndex + 1} of {$pageCount}
		</p>
	</div>
	<div class="flex items-center justify-end space-x-2 py-2">
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}
		>
			<ChevronLeft class="w-3 h-3" />
		</Button>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => ($pageIndex = $pageIndex + 1)}
		>
			<ChevronRight class="w-3 h-3" />
		</Button>
	</div>
</div>
