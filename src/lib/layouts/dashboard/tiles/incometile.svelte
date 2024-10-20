<script>
	import { ArrowDown, ArrowUp, MoreHorizontal, Minus } from 'lucide-svelte';

	let { getArrowClass, formatNumber, income, prevIncome, incomePercentageChange } =
		$props();
</script>

<!-- Improved Income Tile with Badge and Colored Amount in Statement -->
<div
	class="transform rounded-xl bg-white p-6 shadow-md transition-transform hover:scale-105 hover:shadow-lg dark:bg-gray-800"
>
	<!-- Header Section -->
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-lg font-semibold text-gray-900 dark:text-white">Income</h2>
		<MoreHorizontal
			size={20}
			class="cursor-pointer text-gray-500 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
		/>
	</div>

	<!-- Income Value and Percentage Change -->
	<div class="flex items-baseline space-x-2">
		<!-- Income value with larger font size -->
		<h3 class="text-3xl font-extrabold text-gray-900 dark:text-white">${formatNumber(income)}</h3>

		<!-- Percentage change with dynamic icon and transition effect, including the badge -->
		<span
			class={getArrowClass(incomePercentageChange) +
				' flex items-center transition-colors duration-300'}
		>
			{#if incomePercentageChange > 0}
				<ArrowUp size={18} class="text-green-500" />
				<span class="ml-1 rounded-lg bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
					{Math.abs(incomePercentageChange).toFixed(2)}%
				</span>
			{:else if incomePercentageChange < 0}
				<ArrowDown size={18} class="text-red-500" />
				<span class="ml-1 rounded-lg bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
					{Math.abs(incomePercentageChange).toFixed(2)}%
				</span>
			{:else}
				<Minus size={18} class="text-yellow-500" />
				<span class="ml-1 rounded-lg bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-600">
					{Math.abs(incomePercentageChange).toFixed(2)}%
				</span>
			{/if}
		</span>
	</div>

	<!-- Dynamic Statement with Conditional Text Color Only on the Amount -->
	<p class="mt-3 text-sm font-light">
		{#if income - prevIncome > 0}
			You made an extra 
			<span class="text-green-500">${formatNumber(income - prevIncome)}</span>
			this month.
		{:else if income - prevIncome < 0}
			You made 
			<span class="text-red-500">${formatNumber(Math.abs(income - prevIncome))}</span>
			less this month.
		{:else}
			You made the same income as last month.
		{/if}
	</p>
</div>
