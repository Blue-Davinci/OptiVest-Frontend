<script>
    import { PieChart } from 'layerchart';
    import { schemeTableau10 } from 'd3-scale-chromatic';
	import {BUDGET_TIPS as budgetTips} from '$lib/settings/constants.js';
    import { ChartPie as PieChartIcon, Lightbulb, Receipt } from 'lucide-svelte';

    let { data } = $props();
	// Prepare data for pie chart
	function prepareBudgetDistribution(budgets) {
		if (!budgets?.length) return [];

		const categoryTotals = budgets.reduce((acc, item) => {
			const category = item.budget.category;
			acc[category] = (acc[category] || 0) + Number(item.budget.total_amount);
			return acc;
		}, {});

		return Object.entries(categoryTotals)
			.map(([name, value]) => ({ name, value }))
			.sort((a, b) => b.value - a.value);
	}

	function formatAmount(amount) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	}

	let pieData = $derived(prepareBudgetDistribution(data?.data?.budgets ?? []));
</script>

<div class="mb-8 space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
    <!-- Pie Chart Section -->
    <div class="rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
        <div class="mb-6">
            <h3 class="flex items-center text-xl font-semibold text-gray-800 dark:text-white">
                <PieChartIcon class="mr-3 h-6 w-6 text-purple-500" />
                Budget Distribution
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Visual breakdown of your budget allocations
            </p>
        </div>

        {#if pieData.length === 0}
            <div class="flex h-[300px] items-center justify-center">
                <div class="flex h-64 w-64 flex-col items-center justify-center rounded-full border-2 border-dashed border-purple-300/30">
                    <Receipt class="mb-3 h-12 w-12 text-purple-400/50" />
                    <p class="px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Add budget categories to see your distribution
                    </p>
                </div>
            </div>
        {:else}
            <div class="h-[300px]">
                <PieChart
                    data={pieData}
                    key="name"
                    value="value"
                    innerRadius={0.6}
                    cornerRadius={4}
                    padAngle={0.02}
                    cRange={schemeTableau10}
                />
            </div>
            <div class="mt-6 space-y-3">
                {#each pieData as category}
                    <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-purple-50 dark:bg-gray-700/50 dark:hover:bg-purple-900/20">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{category.name}</span>
                        <span class="font-semibold text-purple-600 dark:text-purple-400">
                            {formatAmount(category.value)}
                        </span>
                    </div>
                {/each}
            </div>
        {/if}
    </div>

    <!-- Tips Section -->
    <div class="rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
        <div class="mb-6">
            <h3 class="flex items-center text-xl font-semibold text-gray-800 dark:text-white">
                <Lightbulb class="mr-3 h-6 w-6 text-purple-500" />
                Smart Budget Tips
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Expert strategies for financial success
            </p>
        </div>
        <div class="space-y-4">
            {#each budgetTips as tip}
                <div class="group rounded-xl bg-gray-50 p-5 transition-all duration-300 hover:bg-purple-50 dark:bg-gray-700/50 dark:hover:bg-purple-900/20">
                    <div class="mb-3 flex items-center">
                        {#if tip.Icon}
                            <tip.Icon class="mr-3 h-5 w-5 {tip.color}" />
                        {/if}
                        <h4 class="font-medium text-gray-800 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300">
                            {tip.title}
                        </h4>
                    </div>
                    <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {tip.description}
                    </p>
                </div>
            {/each}
        </div>
    </div>
</div>