<script>
	import Headers from '$lib/layouts/common/headers.svelte';
	import { getAllBudgetInformation } from '$lib/dataservice/budgets/budgetsDataService.js';
	import Pagination from '$lib/layouts/common/pagination.svelte';
	import CreateBudget from '$lib/layouts/budgets/createbudget.svelte';
	import BudgetTileConnector from '$lib/layouts/budgets/budgettileconnector.svelte';
	import BudgetCard from '$lib/layouts/budgets/budgetcard.svelte';
	import BudgetsNotFound from '$lib/layouts/budgets/notfound/budgetsnotfound.svelte';
	import { Search, Award } from 'lucide-svelte';
	import { fly, slide } from 'svelte/transition';
	import lodash from 'lodash';

	let { data } = $props();
	let budgets = $derived(data.data.budgets);
	let currencies = $derived(data?.currencies?.data?.currencies?.conversion_rates ?? {});
	let budgetCategories = $derived(data?.budgetCategories?.data?.budget_categories ?? []);

	let defaultCurrency = $state(data.userInformation.currency_code);
	let searchQuery = $state('');
	let isSearching = $state(false);
	const { debounce } = lodash;

	// metadata
	let currentPage = data.data.metadata.current_page;
	let pageSize = data.data.metadata.page_size;
	let totalRecords = data.data.metadata.total_records;
	let totalPages = Math.ceil(totalRecords / pageSize);
	// Filter budgets with null/empty checks
	function filterBudgets() {
		return (budgets ?? []).filter((budget) =>
			budget?.budget?.name?.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}
	function performDelete(budgetId) {
		// Remove the item from the local state
		console.log('Deleting budget with id:', budgetId);
		console.log('Before Delte', data.data.budgets);
		// Filter the data.budgets directly
		const filteredBudgets = data.data.budgets.filter((b) => b.budget.id !== budgetId);

		// Reassign to the original data object to trigger reactivity
		data = {
			...data, // keep the rest of the data object intact
			data: {
				...data.data,
				budgets: filteredBudgets // update only the budgets part
			}
		};
		console.log('After Delte', data.data.budgets);
	}

	async function fetchData(page, query = '') {
		try {
			const response = await getAllBudgetInformation({}, page, pageSize, query);
			if (response.status === 404) {
				// update the budgets to an empty array using data
				data = {
					...data,
					data: {
						...data.data,
						budgets: []
					}
				};

				return;
			}
			// update using data
			data = {
				...data,
				data: {
					...data.data,
					budgets: response.data.budgets
				}
			};
			console.log('Data', data);
		} catch (error) {
			$inspect(error);
		} finally {
			isSearching = false;
		}
	}
	function handleSearch() {
		// if search
		currentPage = 1;
		console.log('Searching for:', searchQuery);
		//fetchData(currentPage, searchQuery);
	}
	function handlePageChange(page) {
		console.log(page);
		fetchData(page, searchQuery);
	}

	$inspect(data);
	// States and calculations with safe fallbacks
</script>

<div class="container mx-auto mb-6 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
	<Headers />
</div>
<div class="flex flex-wrap justify-center gap-3 px-2 py-4">
	<BudgetTileConnector {budgets} />
</div>
<CreateBudget {data} {defaultCurrency} {currencies} {budgetCategories} />

<!-- Main Container -->
<div
	class="container mx-auto rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900"
	in:fly={{ y: 200, duration: 400 }}
	out:slide={{ y: -200, duration: 400 }}
>
	<!-- Header with Search Field -->
	<div class="mb-6 flex items-center justify-between">
		<div class="flex items-center space-x-3">
			<Award class="h-7 w-7 text-blue-500 dark:text-yellow-400" />
			<h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-200">Budget Overview</h1>
		</div>

		<div class="relative w-64">
			<input
				type="text"
				placeholder="Search budgets..."
				oninput={debounce(handleSearch, 500)}
				bind:value={searchQuery}
				class="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
			/>
			<Search class="absolute left-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-300" />
		</div>
	</div>

	{#if filterBudgets().length === 0}
		<BudgetsNotFound />
	{:else}
		{#each filterBudgets() as budgetItem}
			<BudgetCard {defaultCurrency} {budgetItem} {performDelete} />
		{/each}
		<Pagination {totalPages} {pageSize} {totalRecords} {handlePageChange} />
	{/if}
</div>

<style>
	/* Custom styles for responsiveness */

	@media (min-width: 1024px) {
		.container {
			max-width: 80%;
		}
	}
</style>
