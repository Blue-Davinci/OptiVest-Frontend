<script>
	import { financialTips } from '$lib/settings/constants.js';
    import { PieChart } from 'layerchart';
	import { schemeTableau10 } from 'd3-scale-chromatic';
    import {
		RefreshCcw,
		ChartPie as PieChartIcon,
    Clock
	} from 'lucide-svelte';

    
    let {recurringExpenses, formatAmount, formatDate} = $props();

    	// Add this function to prepare data for the recurring expenses pie chart
	function prepareRecurringExpensesPieChart(recurringExpenses) {
		if (!recurringExpenses?.length) return [];

		// Group by recurrence_interval and sum the amounts
		const intervalTotals = recurringExpenses.reduce((acc, item) => {
			const interval = item.recurring_expense.recurrence_interval;
			// Capitalize first letter of interval for better display
			const formattedInterval = interval.charAt(0).toUpperCase() + interval.slice(1);
			acc[formattedInterval] =
				(acc[formattedInterval] || 0) + Number(item.recurring_expense.amount);
			return acc;
		}, {});

		// Convert to array format needed for PieChart
		return Object.entries(intervalTotals)
			.map(([name, value]) => ({
				name,
				value,
				// Add count of expenses for this interval
				count: recurringExpenses.filter(
					(item) => item.recurring_expense.recurrence_interval.toLowerCase() === name.toLowerCase()
				).length
			}))
			.sort((a, b) => b.value - a.value);
	}

	let recurringExpensesPieData = $derived(prepareRecurringExpensesPieChart(recurringExpenses));
</script>

<section class="mb-12">
    <div
        class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
        <div class="mb-8 flex items-center justify-between">
            <div>
                <h2 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">
                    Recurring Expenses Analytics
                </h2>
                <p class="text-gray-600 dark:text-gray-300">
                    Analysis of your recurring monthly commitments
                </p>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <!-- Recurring Expenses Distribution -->
            <div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-700/50">
                <div class="mb-6">
                    <h3 class="flex items-center text-lg font-medium text-gray-800 dark:text-white">
                        <PieChartIcon class="mr-2 h-5 w-5 text-purple-500" />
                        Expenses by Frequency
                    </h3>
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Distribution of recurring expenses by payment interval
                    </p>
                </div>
                <div class="h-[300px]">
                    <PieChart
                        data={recurringExpensesPieData}
                        key="name"
                        value="value"
                        innerRadius={0.6}
                        cornerRadius={4}
                        padAngle={0.02}
                        cRange={schemeTableau10}
                    />
                </div>
                <div class="mt-4 space-y-2">
                    {#each recurringExpensesPieData as interval}
                        <div class="flex items-center justify-between text-sm">
                            <div class="flex items-center space-x-2">
                                <span class="text-gray-700 dark:text-gray-300">{interval.name}</span>
                                <span class="text-gray-500 dark:text-gray-400">
                                    ({interval.count}
                                    {interval.count === 1 ? 'expense' : 'expenses'})
                                </span>
                            </div>
                            <div class="text-right">
                                <span class="font-medium text-gray-900 dark:text-white">
                                    {formatAmount(interval.value)}
                                </span>
                                <span class="ml-2 text-gray-500 dark:text-gray-400">
                                    ({Math.round(
                                        (interval.value /
                                            recurringExpensesPieData.reduce((sum, t) => sum + t.value, 0)) *
                                            100
                                    )}%)
                                </span>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Recurring Expenses Summary -->
            <div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-700/50">
                <div class="mb-6">
                    <h3 class="flex items-center text-lg font-medium text-gray-800 dark:text-white">
                        <RefreshCcw class="mr-2 h-5 w-5 text-purple-500" />
                        Monthly Commitment Summary
                    </h3>
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Overview of your recurring financial commitments
                    </p>
                </div>
                <div class="space-y-6">
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                            <h4 class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Monthly
                            </h4>
                            <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {formatAmount(
                                    recurringExpenses.reduce(
                                        (sum, item) => sum + Number(item.recurring_expense.amount),
                                        0
                                    )
                                )}
                            </p>
                        </div>
                        <div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                            <h4 class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                Active Subscriptions
                            </h4>
                            <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {recurringExpenses.length}
                            </p>
                        </div>
                    </div>

                    <div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                        <h4 class="mb-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                            Upcoming Renewals
                        </h4>
                        <div class="space-y-3">
                            {#each recurringExpenses
                                .slice(0, 3)
                                .sort((a, b) => new Date(a.recurring_expense.next_occurrence) - new Date(b.recurring_expense.next_occurrence)) as recurring}
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {recurring.recurring_expense.name}
                                        </p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400">
                                            {formatDate(recurring.recurring_expense.next_occurrence)}
                                        </p>
                                    </div>
                                    <span class="text-sm font-medium text-purple-600 dark:text-purple-400">
                                        {formatAmount(recurring.recurring_expense.amount)}
                                    </span>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Tips Section -->
<section class="mb-12">
    <div
        class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
        <div class="mb-8 flex items-center justify-between">
            <div>
                <h2 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">
                    Smart Money Tips
                </h2>
                <p class="text-gray-600 dark:text-gray-300">
                    Expert advice to improve your financial health
                </p>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {#each financialTips as tip}
                <div
                    class="rounded-lg bg-gray-50 p-6 transition-all duration-300 hover:shadow-lg dark:bg-gray-700/50"
                >
                    <div
                        class="flex h-12 w-12 items-center justify-center rounded-full bg-{tip.color}-100 dark:bg-{tip.color}-900/20 mb-4"
                    >
                        <tip.icon class="h-6 w-6 text-{tip.color}-600 dark:text-{tip.color}-400" />
                    </div>
                    <h3 class="mb-2 text-lg font-medium text-gray-800 dark:text-white">{tip.title}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{tip.description}</p>
                </div>
            {/each}
        </div>
    </div>
</section>