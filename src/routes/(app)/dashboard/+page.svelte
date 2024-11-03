<script>
	import { fly, slide } from 'svelte/transition';
	import ExpensesNotFound from '$lib/layouts/dashboard/notfound/expensesnotfound.svelte';
	import DashchartsNotFound from '$lib/layouts/dashboard/notfound/dashchartsnotfound.svelte';
	import DashGoalsNotFound from '$lib/layouts/dashboard/notfound/dashgoalsnotfound.svelte';
	import DashInvAnalysisNotFound from '$lib/layouts/dashboard/notfound/dashinvanalysisnotfound.svelte';
	import DashTransactionsNotFound from '$lib/layouts/dashboard/notfound/dashtransactionsnotfound.svelte';
	import ExpenseIncomeSummary from '$lib/layouts/dashboard/expenseincomesummary.svelte';
	import WelcomeHeader from '$lib/layouts/dashboard/welcomeheader.svelte';
	import ChartSummary from '$lib/layouts/dashboard/chartsummary.svelte';
	import GoalProgressions from '$lib/layouts/dashboard/goalprogressions.svelte';
	import Expensetransactiontable from '$lib/layouts/expenses/expensetransactiontable.svelte';
	import InvestmentAnalysisSummary from '$lib/layouts/financemanager/investmentanalysissummary.svelte';

	let { data } = $props();
	let userInfo = $derived(data.userInformation);
	let goalsData = $derived(data?.goalData?.data?.goals ?? []);
	let expenseTransactions = $derived(data?.expenses?.data && !data.expenses.data.error ? data.expenses.data : {});
	let expenseIncomeSummary = $derived(data.expenseIncomeSummary?.data?.expense_income_summary_report ?? []);
	let investmentAnalysisSummary = $derived(data.personalFinanceSummary?.data?.investment_analysis ?? []);
	$inspect({"Expense Transactions: ": expenseTransactions});

	function getProgressColor(percentage) {
		if (percentage < 10) return 'bg-red-500';
		if (percentage >= 10 && percentage < 50) return 'bg-yellow-500';
		if (percentage >= 50 && percentage < 80) return 'bg-blue-500';
		return 'bg-green-500';
	}
</script>

<div class="min-h-screen bg-gray-100 p-8 dark:bg-gray-900" in:fly={{ y: 200, duration: 400 }} out:slide={{ y: -200, duration: 400 }}>
	<div class="mx-auto max-w-7xl space-y-6">
		
		<WelcomeHeader {userInfo} />

		<!-- Expense Income Summary Fallback -->
		{#if expenseIncomeSummary.length === 0}
			<ExpensesNotFound />
		{:else}
			<ExpenseIncomeSummary {expenseIncomeSummary} />
		{/if}

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-full">
			<!-- Chart Summary Section -->
			<div class="lg:col-span-2 rounded-lg shadow h-full">
			  {#if expenseIncomeSummary.length === 0}
				<DashchartsNotFound />
			  {:else}
				<ChartSummary {expenseIncomeSummary} class="h-full" />
			  {/if}
			</div>
		  
			<!-- Goal Progressions Section -->
			<div class="rounded-lg shadow h-full">
			  {#if goalsData.length === 0}
				<DashGoalsNotFound />
			  {:else}
				<GoalProgressions 
				  {goalsData} 
				  {getProgressColor}
				  class="h-full" 
				/>
			  {/if}
			</div>
		  </div>

		<!-- Investment Analysis Summary Fallback -->
		{#if investmentAnalysisSummary.length === 0}
			<DashInvAnalysisNotFound />
		{:else}
			<InvestmentAnalysisSummary {investmentAnalysisSummary} />
		{/if}

		<!-- Expense Transaction Table Fallback -->
		{#if !expenseTransactions || (Object.keys(expenseTransactions).length === 0 && (!expenseTransactions.metadata || expenseTransactions.metadata.length === 0))}
			<DashTransactionsNotFound />
		{:else}
			<Expensetransactiontable {expenseTransactions} />
		{/if}
	</div>
</div>

<style>
	/* additional styling for improved responsiveness */
</style>
