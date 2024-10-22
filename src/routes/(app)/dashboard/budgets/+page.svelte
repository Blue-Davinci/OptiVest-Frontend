<script>
    import { PieChart } from 'layerchart';
    import { schemeTableau10 } from 'd3-scale-chromatic';
    import { ChevronDown, ChevronUp, FileText, Target, Repeat, Edit, Trash, Search } from 'lucide-svelte';
    import { fly, fade } from 'svelte/transition';

    let { data } = $props();
    let budgets = $state(data.data.budgets);
    let expandedBudget = $state(null);
    let defaultCurrency = $state(data.userInformation.currency_code);
    let searchQuery = $state('');

    const prepareChartData = (goalContribution, recurringExpenses, totalExpenses) => [
        { name: 'Goal Monthly Contribution', value: parseFloat(goalContribution) },
        { name: 'Projected Recurring Expenses', value: parseFloat(recurringExpenses) },
        { name: 'Other Expenses', value: parseFloat(totalExpenses) - parseFloat(recurringExpenses) }
    ];

    function toggleExpand(budgetId) {
        expandedBudget = expandedBudget === budgetId ? null : budgetId;
    }

    function handleUpdate(budgetId) {
        console.log(`Update budget: ${budgetId}`);
    }

    function handleDelete(budgetId) {
        console.log(`Delete budget: ${budgetId}`);
    }

    function filterBudgets() {
        return budgets.filter(budget => 
            budget.budget.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
</script>

<!-- Main Container -->
<div class="container mx-auto p-4">
    <!-- Header with Search Field -->
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-200">Budget Overview</h1>
        <div class="relative w-64">
            <input 
                type="text" 
                placeholder="Search budgets..." 
                bind:value={searchQuery} 
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
            />
            <Search class="absolute left-3 top-2.5 w-5 h-5 text-gray-500 dark:text-gray-300" />
        </div>
    </div>

    {#each filterBudgets() as budgetItem}
    <div class="rounded-lg bg-white p-6 shadow-lg border dark:bg-gray-800 border-gray-200 dark:border-gray-600 mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between">
            <!-- Left: Budget Details -->
            <div class="flex space-x-4 mb-4 lg:mb-0 items-center">
                <FileText class="w-6 h-6 text-gray-600 dark:text-gray-300" />
                <div class="space-y-2">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-200 flex items-center">
                        {budgetItem.budget.name}
                    </h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Created: {new Date(budgetItem.budget.created_at).toLocaleDateString()}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Category: {budgetItem.budget.category}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Total Amount: ${budgetItem.budget.total_amount}
                    </p>
                </div>
            </div>

            <!-- Middle: Default Currency, Conversion Rate, and is_strict Badge -->
            <div class="text-center mb-4 lg:mb-0">
                <p class="text-gray-500 dark:text-gray-400 text-lg">Currency</p>
                <p class="text-xl font-semibold text-gray-900 dark:text-gray-200">
                    {budgetItem.budget.currency_code || defaultCurrency}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    Conversion Rate: {budgetItem.budget.conversion_rate}
                </p>
                <span class={`px-2 py-1 rounded-full text-sm font-medium ${budgetItem.budget.is_strict ? 'bg-green-100 text-green-700 dark:bg-green-600 dark:text-green-100' : 'bg-red-100 text-red-700 dark:bg-red-600 dark:text-red-100'}`}>
                    {budgetItem.budget.is_strict ? 'Strict Budget' : 'Flexible Budget'}
                </span>
            </div>

            <!-- Right: Pie Chart, Summary, and Actions -->
            <div class="flex flex-col lg:flex-row items-center space-x-6 w-full lg:w-auto">
                <!-- Pie Chart -->
                <div class="w-full lg:w-40 h-40 mb-4 lg:mb-0">
                    <PieChart
                        data={prepareChartData(
                            budgetItem.goal_summary_totals.total_monthly_contribution,
                            budgetItem.goal_summary_totals.projected_recurring_expenses,
                            budgetItem.goal_summary_totals.total_expenses
                        )}
                        key="name"
                        value="value"
                        innerRadius={-10}
                        cornerRadius={5}
                        padAngle={0.02}
                        cRange={schemeTableau10}
                    />
                </div>

                <!-- Summary -->
                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-md text-center w-full lg:w-40 mb-4 lg:mb-0">
                    <div class="mb-3">
                        <span class="block text-sm text-gray-600 dark:text-gray-300">Total Recurring Expenses</span>
                        <p class="font-bold text-lg text-gray-900 dark:text-white">${budgetItem.goal_summary_totals.projected_recurring_expenses}</p>
                    </div>
                    <div>
                        <span class="block text-sm text-gray-600 dark:text-gray-300">Total Goals</span>
                        <p class="font-bold text-lg text-gray-900 dark:text-white">${budgetItem.goal_summary_totals.total_monthly_contribution}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Actions -->
        <div class="mt-4 flex flex-wrap justify-end space-x-4">
            <button
                class="flex items-center text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition duration-150 ease-in-out"
                onclick={() => handleUpdate(budgetItem.budget.id)}
            >
                <Edit class="w-5 h-5 mr-1" /> <span class="text-sm">Update</span>
            </button>
            <button
                class="flex items-center text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition duration-150 ease-in-out"
                onclick={() => handleDelete(budgetItem.budget.id)}
            >
                <Trash class="w-5 h-5 mr-1" /> <span class="text-sm">Delete</span>
            </button>
        </div>

        <!-- Expand/Collapse Button -->
        <div class="flex justify-center items-center mt-4">
            <button
              onclick={() => toggleExpand(budgetItem.budget.id)}
              class="text-blue-500 hover:underline dark:text-blue-400 flex items-center"
            >
              {#if expandedBudget === budgetItem.budget.id}
                Collapse <ChevronUp class="ml-2 w-4 h-4" />
              {:else}
                Expand <ChevronDown class="ml-2 w-4 h-4" />
              {/if}
            </button>
          </div>

        <!-- Expansion Panel for Goals, Recurring Expenses, and Total Summaries -->
        {#if expandedBudget === budgetItem.budget.id}
        <div in:fly={{ x: -200, duration: 1000 }} out:fade>
            <!-- Existing Expansion Content -->
            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Goal Summary Section -->
                <div class="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-md overflow-auto max-h-64">
                    <div class="flex items-center mb-4">
                        <Target class="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2" />
                        <h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">Goal Summary</h3>
                    </div>
                    <ul class="space-y-3">
                        {#each budgetItem.goal_summary as goal}
                            <li class="bg-gray-200 dark:bg-gray-700 rounded-lg p-3">
                                <p class="font-semibold text-gray-800 dark:text-white">{goal.name}</p>
                                <span class="bg-green-100 dark:bg-green-600 text-green-700 dark:text-green-100 px-2 py-1 rounded-full text-sm font-medium">
                                    Monthly Contribution: ${goal.monthly_contribution}
                                </span>
                            </li>
                        {/each}
                    </ul>
                </div>

                <!-- Recurring Expenses Section -->
                <div class="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-md overflow-auto max-h-64">
                    <div class="flex items-center mb-4">
                        <Repeat class="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2" />
                        <h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">Recurring Expenses</h3>
                    </div>
                    <ul class="space-y-3">
                        {#each budgetItem.recurring_expenses as expense}
                            <li class="bg-gray-200 dark:bg-gray-700 rounded-lg p-3">
                                <p class="font-semibold text-gray-800 dark:text-white">{expense.name}</p>
                                <span class="bg-red-100 dark:bg-red-600 text-red-700 dark:text-red-100 px-2 py-1 rounded-full text-sm font-medium">
                                    Amount: ${expense.amount}
                                </span>
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>

            <!-- Total Summary Section -->
            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-md text-center">
                <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span class="block text-sm text-gray-600 dark:text-gray-300">Total Budget Amount</span>
                  <p class="font-bold text-lg text-gray-900 dark:text-white">${budgetItem.goal_summary_totals.total_budget_amount}</p>
                </div>
                <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span class="block text-sm text-gray-600 dark:text-gray-300">Total Monthly Contribution</span>
                  <p class="font-bold text-lg text-gray-900 dark:text-white">${budgetItem.goal_summary_totals.total_monthly_contribution}</p>
                </div>
                <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span class="block text-sm text-gray-600 dark:text-gray-300">Total Expenses</span>
                  <p class="font-bold text-lg text-gray-900 dark:text-white">${budgetItem.goal_summary_totals.total_expenses}</p>
                </div>
                <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span class="block text-sm text-gray-600 dark:text-gray-300">Projected Recurring Expenses</span>
                  <p class="font-bold text-lg text-gray-900 dark:text-white">${budgetItem.goal_summary_totals.projected_recurring_expenses}</p>
                </div>
                <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span class="block text-sm text-gray-600 dark:text-gray-300">Total Surplus</span>
                  <p class="font-bold text-lg text-gray-900 dark:text-white">${budgetItem.goal_summary_totals.total_surplus}</p>
                </div>
              </div>

        </div>
        {/if}
    </div>
    {/each}
</div>

<style>
/* Custom styles for responsiveness */

@media (min-width: 1024px) {
  .container {
    max-width: 80%;
  }
}
</style>
