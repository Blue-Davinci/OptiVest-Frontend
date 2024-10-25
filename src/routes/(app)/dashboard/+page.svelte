<script>
	import { fly, slide } from 'svelte/transition';
	import ExpenseIncomeSummary from '$lib/layouts/dashboard/expenseincomesummary.svelte';
	import WelcomeHeader from '$lib/layouts/dashboard/welcomeheader.svelte';
	import ChartSummary from '$lib/layouts/dashboard/chartsummary.svelte';
	import GoalProgressions from '$lib/layouts/dashboard/goalprogressions.svelte';
	import Expensetransactiontable from '$lib/layouts/expenses/expensetransactiontable.svelte';
	import InvestmentAnalysisSummary from '$lib/layouts/financemanager/investmentanalysissummary.svelte';

	let { data } = $props();
	let userInfo = $derived(data.userInformation);
	let goalsData = $derived(data.goalData.data.goals);
	let expenseTransactions = $derived(data.expenses.data);
	let expenseIncomeSummary = $derived(data.expenseIncomeSummary.data.expense_income_summary_report);
	let investmentAnalysisSummary = $derived(data.personalFinanceSummary?.data?.investment_analysis ?? []);
	$inspect(investmentAnalysisSummary);
	// page metadata
	function getProgressColor(percentage) {
		if (percentage < 10) {
			return 'bg-red-500';
		} else if (percentage >= 10 && percentage < 50) {
			return 'bg-yellow-500';
		} else if (percentage >= 50 && percentage < 80) {
			return 'bg-blue-500';
		} else {
			return 'bg-green-500';
		}
	}
</script>
<div class="min-h-screen bg-gray-100 p-8 dark:bg-gray-900"
in:fly={{ y: 200, duration: 400 }}
out:slide={{ y: -200, duration: 400 }}
>
	<div class="mx-auto max-w-7xl">
		<!-- Welcome Header -->
		<WelcomeHeader {userInfo} />
		<!-- Updated Component -->
		<ExpenseIncomeSummary {expenseIncomeSummary} />
		<!-- Placeholder for Chart -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<div class="lg:col-span-2 rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
			  <ChartSummary {expenseIncomeSummary} />
			</div>
			<!-- Savings Goals -->
			<GoalProgressions {goalsData} {getProgressColor} />
		  </div>
		<InvestmentAnalysisSummary  {investmentAnalysisSummary}/>
		<!-- Transactions Table -->
		<Expensetransactiontable {expenseTransactions} />
	</div>
</div>
<style>
	/* additional styling for improved responsiveness */
</style>
