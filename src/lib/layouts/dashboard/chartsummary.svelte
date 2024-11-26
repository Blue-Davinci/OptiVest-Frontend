<script>
	import { AreaChart } from 'layerchart';

	// Incoming data from props
	let { expenseIncomeSummary } = $props();

	// Transform data for the chart
	let chartData = expenseIncomeSummary.map((item) => ({
		month: item?.month ?? 'Unknown', // Fallback to 'Unknown' if month is not available
		income: isNaN(parseFloat(item?.total_income)) ? 0 : parseFloat(item?.total_income), // Ensure total_income is a valid number or default to 0
		expenses: isNaN(parseFloat(item?.total_expenses)) ? 0 : -parseFloat(item?.total_expenses) // Ensure total_expenses is a valid number or default to 0, and make it negative
	}));

	// Get the current year dynamically
	const currentYear = new Date().getFullYear();

	// Helper function to map month names to numbers (January = 0, December = 11)
	const monthMap = {
		January: 0,
		February: 1,
		March: 2,
		April: 3,
		May: 4,
		June: 5,
		July: 6,
		August: 7,
		September: 8,
		October: 9,
		November: 10,
		December: 11
	};

	// Ensure data is correctly transformed for the chart
	let processedChartData = chartData.map((item) => {
		// Default to 0 if parsing fails or the value is missing
		let income = parseFloat(item.income) || 0;
		let expenses = parseFloat(item.expenses) || 0;

		// Get the correct month number using the monthMap
		let monthNumber = monthMap[item.month] || 0; // Fallback to January (0) if month not found

		return {
			date: new Date(currentYear, monthNumber, 1), // Use current year and month number
			income: income,
			expenses: expenses
		};
	});
</script>

<div class="h-full w-full text-gray-500 dark:text-gray-300">
	<p class="mb-4 text-center text-lg font-semibold">Performance Chart</p>

	<div class="chart-container">
		{#if processedChartData && processedChartData.length > 0}
			<div
				class="h-[550px] rounded border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
			>
				<AreaChart
					data={processedChartData}
					x="date"
					series={[
						{
							key: 'income', // Plot income
							color: 'hsl(218, 85%, 55%)' // Light blue for income
						},
						{
							key: 'expenses', // Plot expenses
							color: 'hsl(10, 80%, 55%)' // Red for expenses
						}
					]}
					seriesLayout="stackDiverging"
					props={{
						xAxis: {
							class: 'text-gray-800 dark:text-gray-200' // Customize x-axis label color
						},
						yAxis: {
							class: 'text-gray-800 dark:text-gray-200' // Customize y-axis label color
						}
					}}
				/>
			</div>
		{:else}
			<p class="text-center text-gray-600 dark:text-gray-400">No data available for the chart.</p>
		{/if}
	</div>
</div>

<style>
	.chart-container {
		width: 100%;
		height: 100%;
	}

	@media (min-width: 640px) {
		.chart-container {
			height: 320px;
		}
	}

	@media (min-width: 768px) {
		.chart-container {
			height: 400px;
		}
	}
</style>
