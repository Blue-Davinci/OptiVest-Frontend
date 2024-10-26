<script>
	import { RefreshCcw, TrendingUp, ChartPie as PieChartIcon } from 'lucide-svelte';

	import { LineChart, PieChart } from 'layerchart';
	import { schemeTableau10 } from 'd3-scale-chromatic';

	let { expenses, recurringExpenses, formatAmount } = $props();
	// Prepare Line Chart Data - Monthly Expense Trends
	function prepareLineChartData(expenses) {
		if (!expenses?.length) return [];

		const groupedByMonth = expenses.reduce((acc, expense) => {
			const date = new Date(expense.date_occurred).toISOString().slice(0, 7); // YYYY-MM
			acc[date] = (acc[date] || 0) + Number(expense.amount);
			return acc;
		}, {});

		return Object.entries(groupedByMonth)
			.map(([date, value]) => ({
				date: new Date(date + '-01'), // Add day for valid date
				value: value
			}))
			.sort((a, b) => a.date - b.date);
	}

	// Prepare Category Distribution Pie Chart
	function prepareCategoryPieChart(expenses) {
		if (!expenses?.length) return [];

		const categoryTotals = expenses.reduce((acc, expense) => {
			const category = expense.category;
			acc[category] = (acc[category] || 0) + Number(expense.amount);
			return acc;
		}, {});

		return Object.entries(categoryTotals)
			.map(([name, value]) => ({ name, value }))
			.sort((a, b) => b.value - a.value);
	}

	// Prepare Recurring vs Non-recurring Pie Chart
	function prepareRecurringPieChart(expenses, recurringExpenses) {
		const recurringTotal = recurringExpenses.reduce(
			(sum, item) => sum + Number(item.recurring_expense.amount),
			0
		);

		const nonRecurringTotal = expenses
			.filter((expense) => !expense.is_recurring)
			.reduce((sum, expense) => sum + Number(expense.amount), 0);

		return [
			{ name: 'Recurring', value: recurringTotal },
			{ name: 'Non-recurring', value: nonRecurringTotal }
		];
	}

	let lineChartData = $derived(prepareLineChartData(expenses));
	let categoryPieData = $derived(prepareCategoryPieChart(expenses));
	let recurringPieData = $derived(prepareRecurringPieChart(expenses, recurringExpenses));
</script>

<section class="mb-12">
	<div
		class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
	>
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h2 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">Expense Analytics</h2>
				<p class="text-gray-600 dark:text-gray-300">
					Comprehensive overview of your spending patterns
				</p>
			</div>
		</div>

		<!-- Summary Cards -->
		<div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
			<div class="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
				<h4 class="mb-2 text-sm font-medium text-purple-600 dark:text-purple-300">
					Total Expenses
				</h4>
				<p class="text-2xl font-bold text-gray-900 dark:text-white">
					{formatAmount(expenses.reduce((sum, exp) => sum + Number(exp.amount), 0))}
				</p>
			</div>
			<div class="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
				<h4 class="mb-2 text-sm font-medium text-purple-600 dark:text-purple-300">
					Monthly Average
				</h4>
				<p class="text-2xl font-bold text-gray-900 dark:text-white">
					{formatAmount(
						expenses.reduce((sum, exp) => sum + Number(exp.amount), 0) /
							(new Set(expenses.map((exp) => new Date(exp.date_occurred).toISOString().slice(0, 7)))
								.size || 1)
					)}
				</p>
			</div>
			<div class="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
				<h4 class="mb-2 text-sm font-medium text-purple-600 dark:text-purple-300">
					Total Categories
				</h4>
				<p class="text-2xl font-bold text-gray-900 dark:text-white">
					{new Set(expenses.map((exp) => exp.category)).size}
				</p>
			</div>
		</div>

		<div class="space-y-8">
			<!-- Monthly Trend Line Chart - Full Width -->
			<div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-700/50">
				<div class="mb-6 flex items-start justify-between">
					<div>
						<h3 class="flex items-center text-lg font-medium text-gray-800 dark:text-white">
							<TrendingUp class="mr-2 h-5 w-5 text-purple-500" />
							Monthly Expense Trend
						</h3>
						<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
							Track your spending patterns over time
						</p>
					</div>
				</div>
				<div class="h-[400px] w-full">
					<LineChart
						data={lineChartData}
						x="date"
						series={[
							{
								key: 'value',
								color: 'hsl(270, 85%, 55%)'
							}
						]}
						options={{
							line: {
								strokeWidth: 3,
								curve: 'monotoneX'
							},
							grid: true,
							tooltip: true,
							animate: true
						}}
						points
					/>
				</div>
			</div>

			<!-- Pie Charts Grid -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Category Distribution Pie Chart -->
				<div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-700/50">
					<div class="mb-6">
						<h3 class="flex items-center text-lg font-medium text-gray-800 dark:text-white">
							<PieChartIcon class="mr-2 h-5 w-5 text-purple-500" />
							Expense Categories
						</h3>
						<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
							Distribution of expenses across categories
						</p>
					</div>
					<div class="h-[300px]">
						<PieChart
							data={categoryPieData}
							key="name"
							value="value"
							innerRadius={0.6}
							cornerRadius={4}
							padAngle={0.02}
							cRange={schemeTableau10}
						/>
					</div>
					<div class="mt-4 space-y-2">
						{#each categoryPieData as category}
							<div class="flex items-center justify-between text-sm">
								<span class="text-gray-700 dark:text-gray-300">{category.name}</span>
								<span class="font-medium text-gray-900 dark:text-white">
									{formatAmount(category.value)}
								</span>
							</div>
						{/each}
					</div>
				</div>

				<!-- Recurring vs Non-recurring Pie Chart -->
				<div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-700/50">
					<div class="mb-6">
						<h3 class="flex items-center text-lg font-medium text-gray-800 dark:text-white">
							<RefreshCcw class="mr-2 h-5 w-5 text-purple-500" />
							Recurring vs One-time Expenses
						</h3>
						<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
							Balance between recurring and one-time expenses
						</p>
					</div>
					<div class="h-[300px]">
						<PieChart
							data={recurringPieData}
							key="name"
							value="value"
							innerRadius={0.6}
							cornerRadius={4}
							padAngle={0.02}
							cRange={['hsl(270, 85%, 55%)', 'hsl(270, 85%, 75%)']}
						/>
					</div>
					<div class="mt-4 space-y-2">
						{#each recurringPieData as type}
							<div class="flex items-center justify-between text-sm">
								<span class="text-gray-700 dark:text-gray-300">{type.name}</span>
								<div class="text-right">
									<span class="font-medium text-gray-900 dark:text-white">
										{formatAmount(type.value)}
									</span>
									<span class="ml-2 text-gray-500 dark:text-gray-400">
										({Math.round(
											(type.value / recurringPieData.reduce((sum, t) => sum + t.value, 0)) * 100
										)}%)
									</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
