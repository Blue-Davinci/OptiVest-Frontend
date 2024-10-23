<script>
    import CreateBudget from '$lib/layouts/budgets/createbudget.svelte';
	import BudgetTileConnector from '$lib/layouts/budgets/budgettileconnector.svelte';
	import BudgetCard from '$lib/layouts/budgets/budgetcard.svelte';
	import BudgetsNotFound from '$lib/layouts/budgets/notfound/budgetsnotfound.svelte';
	import { Search, Award } from 'lucide-svelte';
	import { fly, slide } from 'svelte/transition';

	let { data } = $props();
	let budgets = $derived(data.data.budgets);
    let currencies = $derived(data?.currencies?.data?.currencies?.conversion_rates ?? {});
    let budgetCategories = $derived(data?.budgetCategories?.data?.budget_categories ?? []);

	let defaultCurrency = $state(data.userInformation.currency_code);
	let searchQuery = $state('');
	// Filter budgets with null/empty checks
	function filterBudgets() {
		return (budgets ?? []).filter((budget) =>
			budget?.budget?.name?.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}
    function performDelete(budgetId) {
        // Remove the item from the local state
        console.log('Deleting budget with id:', budgetId);
        console.log("Before Delte", data.data.budgets); 
                // Filter the data.budgets directly
        const filteredBudgets = data.data.budgets.filter(b => b.budget.id !== budgetId);
        
        // Reassign to the original data object to trigger reactivity
        data = {
            ...data, // keep the rest of the data object intact
            data: {
                ...data.data,
                budgets: filteredBudgets // update only the budgets part
            }
        };
        console.log("After Delte", data.data.budgets);
    }
    $inspect(data);
	// States and calculations with safe fallbacks
</script>

<BudgetTileConnector {budgets} />
<CreateBudget {data} {defaultCurrency} {currencies} {budgetCategories} />

<!-- Main Container -->
<div
  class="container mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg transition-all duration-300 transform"
  in:fly={{ y: 200, duration: 400 }}
  out:slide={{ y: -200, duration: 400 }}
>
  <!-- Header with Search Field -->
  <div class="mb-6 flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <Award class="h-7 w-7 text-blue-500 dark:text-yellow-400" />
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-200">
        Budget Overview
      </h1>
    </div>
    
    <div class="relative w-64">
      <input
        type="text"
        placeholder="Search budgets..."
        bind:value={searchQuery}
        class="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 transition-all duration-300 shadow-sm"
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
