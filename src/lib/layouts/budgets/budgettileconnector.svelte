<script>
	import HighestBudget from './tiles/highestbudget.svelte';
	import FrequentCurrencyBudget from './tiles/frequentcurrencybudget.svelte';
	import MostGoalsBudget from './tiles/mostgoalsbudget.svelte';

	let { budgets = [] } = $props();

	// Calculate the budget with the highest amount safely
	let highestBudget = budgets.reduce((prev, current) => {
		const prevAmount = prev?.budget?.total_amount || 0;
		const currentAmount = current?.budget?.total_amount || 0;
		return prevAmount > currentAmount ? prev : current;
	}, {});

	// Get the most frequent currency code or fallback to USD safely
	let mostFrequentCurrency = budgets.reduce((acc, curr) => {
		const currencyCode = curr?.budget?.currency_code;
		return currencyCode && currencyCode !== '' ? currencyCode : acc;
	}, 'USD');

	// Calculate the budget with the most goals set safely
	let mostGoalsBudget = budgets.reduce((prev, current) => {
		const prevGoalCount = prev?.goal_summary?.length || 0;
		const currentGoalCount = current?.goal_summary?.length || 0;
		return prevGoalCount > currentGoalCount ? prev : current;
	}, {});

	// Format numbers safely with a fallback for invalid inputs
	let formatNumber = (num) => parseFloat(num || 0).toLocaleString();
</script>

<!-- Tile for Highest Budget -->
<HighestBudget {formatNumber} {highestBudget} />
<!-- Tile for Most Frequent Currency -->
<FrequentCurrencyBudget {mostFrequentCurrency} />
<!-- Tile for Most Goals -->
<MostGoalsBudget {mostGoalsBudget} />
