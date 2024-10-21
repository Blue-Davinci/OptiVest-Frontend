<script>
	import {
		Search,
		CreditCard,
		Repeat,
		ShoppingCart,
		FileText,
		Frown,
		FileX,
		Filter
	} from 'lucide-svelte';
	import Pagination from '../common/pagination.svelte';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button'; // shadcn-svelte Button
	import { getAllExpenses } from '$lib/dataservice/expenses/expenses.js';
	import lodash from 'lodash';

	const { debounce } = lodash;

	let { expenseTransactions } = $props();
	let searchQuery = $state('');
	let transactions = $state(expenseTransactions.expenses);
	let currentPage = expenseTransactions.metadata.current_page;
	let pageSize = expenseTransactions.metadata.page_size;
	let totalRecords = expenseTransactions.metadata.total_records;
	let totalPages = Math.ceil(totalRecords / pageSize);
	let isSearching = $state(false);

	async function fetchData(page, query = '') {
		try {
			const response = await getAllExpenses({}, page, pageSize, query);
			if (response.status === 404) {
				transactions = [];
				return;
			}
			transactions = response.data.expenses;
		} catch (error) {
			$inspect(error);
		} finally {
			isSearching = false;
		}
	}
	// ToDo: Make This A Form
	function handleSearch() {
		// if search
		currentPage = 1;
		fetchData(currentPage, searchQuery);
	}

	function handlePageChange(page) {
		//console.log(page);
		fetchData(page, searchQuery);
	}
</script>

<div class="mt-4 rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
		<div class="flex items-center space-x-4">
			<div class="relative">
				<Search
					class="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400 dark:text-gray-500"
					size={16}
				/>
				<input
					type="text"
					bind:value={searchQuery}
					oninput={debounce(handleSearch, 500)}
					placeholder="Search transactions"
					class="rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
				/>
				<Filter
					class="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 dark:text-gray-500"
					size={16}
				/>
			</div>
			<Button variant="outline" onclick={handleSearch}>
				{#if isSearching}
					<svg
						width="20"
						height="20"
						fill="currentColor"
						class="mr-2 animate-spin"
						viewBox="0 0 1792 1792"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"
						>
						</path>
					</svg>
					Searching...
				{:else}
					<Filter size={16} class="mr-2" /> Filter
				{/if}
			</Button>
		</div>
	</div>

	{#if transactions.length === 0}
		{#if searchQuery === ''}
			<div class="flex flex-col items-center justify-center space-y-3 py-10">
				<Frown size={48} class="text-gray-400 dark:text-gray-500" />
				<h3 class="text-xl font-semibold text-gray-900 dark:text-white">No transactions found</h3>
				<p class="text-gray-600 dark:text-gray-400">
					It seems like you haven't added any transactions yet.
				</p>
				<a href="/1#" class="text-blue-600 hover:underline dark:text-blue-400">
					Add your first transaction
				</a>
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center space-y-3 py-10">
				<FileX size={48} class="text-gray-400 dark:text-gray-500" />
				<h3 class="text-xl font-semibold text-gray-900 dark:text-white">No matching results</h3>
				<p class="text-gray-600 dark:text-gray-400">
					We couldn't find any transactions that match your search.
				</p>
			</div>
		{/if}
	{:else}
		<Table.Root>
			<Table.Caption>A list of your recent transactions.</Table.Caption>
			<Table.Header>
				<Table.Row
					class="bg-gradient-to-r from-blue-50 via-gray-50 to-blue-50 dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-800 dark:to-gray-700"
				>
					<Table.Head
						class="border-b border-gray-300 px-6 py-3 text-xs font-bold uppercase tracking-wide text-gray-900 dark:border-gray-600 dark:text-gray-100"
					>
						Transaction
					</Table.Head>
					<Table.Head
						class="border-b border-gray-300 px-6 py-3 text-xs font-bold uppercase tracking-wide text-gray-900 dark:border-gray-600 dark:text-gray-100"
					>
						Date
					</Table.Head>
					<Table.Head
						class="border-b border-gray-300 px-6 py-3 text-xs font-bold uppercase tracking-wide text-gray-900 dark:border-gray-600 dark:text-gray-100"
					>
						Amount
					</Table.Head>
					<Table.Head
						class="border-b border-gray-300 px-6 py-3 text-xs font-bold uppercase tracking-wide text-gray-900 dark:border-gray-600 dark:text-gray-100"
					>
						Category
					</Table.Head>
					<Table.Head
						class="border-b border-gray-300 px-6 py-3 text-xs font-bold uppercase tracking-wide text-gray-900 dark:border-gray-600 dark:text-gray-100"
					>
						Recurring
					</Table.Head>
					<Table.Head
						class="border-b border-gray-300 px-6 py-3 text-xs font-bold uppercase tracking-wide text-gray-900 dark:border-gray-600 dark:text-gray-100"
					>
						Description
					</Table.Head>
				</Table.Row>
			</Table.Header>

			<Table.Body>
				{#each transactions as transaction}
					<Table.Row>
						<Table.Cell>
							<div class="flex items-center space-x-3">
								{#if transaction.category.toLowerCase() === 'recurring'}
									<div class="rounded-full bg-pink-500 p-2">
										<Repeat size={16} color="white" />
									</div>
								{:else if transaction.category.toLowerCase() === 'stationery'}
									<div class="rounded-full bg-blue-500 p-2">
										<FileText size={16} color="white" />
									</div>
								{:else}
									<div class="rounded-full bg-green-500 p-2">
										<ShoppingCart size={16} color="white" />
									</div>
								{/if}
								<span class="font-medium text-gray-900 dark:text-gray-100">{transaction.name}</span>
							</div>
						</Table.Cell>
						<Table.Cell class="text-sm text-gray-500 dark:text-gray-400">
							{new Date(transaction.date_occurred).toLocaleDateString()}
						</Table.Cell>
						<Table.Cell class="text-base font-semibold text-blue-700 dark:text-blue-400">
							${parseFloat(transaction.amount).toFixed(2)}
						</Table.Cell>
						<Table.Cell>
							<span
								class="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-800 dark:text-blue-100"
							>
								{transaction.category}
							</span>
						</Table.Cell>
						<Table.Cell class="text-sm">
							{#if transaction.is_recurring}
								<span class="text-green-600 dark:text-green-400">Yes</span>
							{:else}
								<span class="text-red-600 dark:text-red-400">No</span>
							{/if}
						</Table.Cell>
						<Table.Cell class="text-sm text-gray-500 dark:text-gray-400"
							>{transaction.description}</Table.Cell
						>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
        <Pagination {totalPages} {pageSize} {totalRecords} {handlePageChange} />
	{/if}
</div>
