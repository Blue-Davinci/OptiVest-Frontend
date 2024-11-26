<script>
    import Pagination from '$lib/layouts/common/pagination.svelte';
    import CreateNewIncome from '$lib/layouts/income/createnewincome.svelte';
	import IncomeTileConnector from '$lib/layouts/income/incometileconnector.svelte';
	import IncomeCharts from '$lib/layouts/income/incomecharts.svelte';
	import IncomeTips from '$lib/layouts/income/incometips.svelte';
	import IncomeTables from '$lib/layouts/income/incometables.svelte';
	import IncomeTableNotFound from '$lib/layouts/income/notfound/incometablenotfound.svelte';
	import {Wallet} from 'lucide-svelte';

	let { data } = $props();
	let incomeData = $derived(data?.incomeData?.data?.incomes ?? []);
    let currencies = $derived(data?.currencies?.data?.currencies?.conversion_rates ?? {});
	let defaultCurrency = $state(data.userInformation?.currency_code === '' ? 'USD' : data.userInformation?.currency_code);
	let searchQuery = $state('');
	$inspect(data);

	// Filtered incomes based on search
	let filteredIncomes = $derived(
		incomeData.filter(
			(item) =>
				item.income.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.income.description.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function formatCurrency(amount, currency = defaultCurrency) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency
		}).format(amount);
	}

	function formatDate(dateString) {
		const date = new Date(dateString);
		const options = { year: 'numeric', month: 'short', day: '2-digit' };
		return date.toLocaleDateString('en-US', options);
	}

	let mostUsedCurrency = $derived(data?.incomeData?.most_used_currency_code ?? defaultCurrency);
    	// metadata
	let currentPage = data?.incomeData?.data?.metadata?.current_page ?? 0;
	let pageSize = data?.incomeData?.data?.metadata?.page_size ?? 0;
	let totalRecords = data?.incomeData?.data?.metadata?.total_records ?? 0;
	let totalPages = Math.ceil(totalRecords / pageSize);
    function handlePageChange(page) {
		console.log(page);
		fetchData(page, searchQuery);
	}
</script>

<CreateNewIncome {data} {currencies} {defaultCurrency}/>

<div class="min-h-screen bg-gray-50 p-4 transition-colors dark:bg-gray-900 sm:p-6 lg:p-8">
	<!-- Header Section -->
	<div class="mb-8">
		<div class="flex items-center gap-3">
			<Wallet class="h-8 w-8 text-purple-600 dark:text-purple-400" />
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Income Dashboard</h1>
		</div>
		<p class="ml-11 mt-2 text-gray-600 dark:text-gray-400">Track and analyze your income streams</p>
	</div>

	<!-- Stats Cards -->
	<IncomeTileConnector {incomeData} {defaultCurrency} {formatCurrency} {mostUsedCurrency} />

	<!-- Rest of the component remains the same -->
	<!-- Charts Section -->
	<IncomeCharts {incomeData} />

	<!-- Income Tips Section -->
	<IncomeTips />

	<!-- Table Section -->
	{#if incomeData.length}
		<IncomeTables {filteredIncomes} {searchQuery} {formatCurrency} {formatDate} />
        <Pagination {totalPages} {pageSize} {totalRecords} {handlePageChange} />
	{:else}
		<IncomeTableNotFound />
	{/if}
</div>
