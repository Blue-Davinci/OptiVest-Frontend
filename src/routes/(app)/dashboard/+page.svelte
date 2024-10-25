<script>
	import { fly, slide } from 'svelte/transition';
	import { CreditCard, TrendingUp, Target, PieChart, List } from 'lucide-svelte';
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
	let expenseIncomeSummary = $derived(data.expenseIncomeSummary?.data.expense_income_summary_report ?? []);
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
		<a href="#1" class="block">
			<div class="group relative flex flex-col items-center justify-center py-12 text-center rounded-xl border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] dark:border-gray-700" transition:fly={{ y: 20, duration: 300 }}>
				<div class="mb-4 rounded-full bg-blue-500/20 p-5 group-hover:bg-blue-500/30 transition-colors duration-300">
					<CreditCard class="h-8 w-8 text-blue-500 dark:text-blue-400" />
				</div>
				<h3 class="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">No Income/Expense Data Found</h3>
				<p class="max-w-md text-gray-600 dark:text-gray-300">
					Track your finances here once you start adding income and expenses!
				</p>
				<span class="mt-4 text-sm text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					Click to add your first transaction →
				</span>
			</div>
		</a>
		{:else}
			<ExpenseIncomeSummary {expenseIncomeSummary} />
		{/if}

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Chart Summary Fallback -->
			<div class="lg:col-span-2">
				{#if expenseIncomeSummary.length === 0}
				<a href="#1" class="block">
					<div class="group relative flex flex-col items-center justify-center py-12 text-center rounded-xl bg-white dark:bg-gray-800 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02]" transition:fly={{ y: 20, duration: 300 }}>
						<div class="mb-4 rounded-full bg-purple-500/20 p-5 group-hover:bg-purple-500/30 transition-colors duration-300">
							<PieChart class="h-8 w-8 text-purple-500 dark:text-purple-400" />
						</div>
						<h3 class="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">No Chart Data Available</h3>
						<p class="max-w-md text-gray-600 dark:text-gray-300">
							Visual summaries of your financial activities will appear here.
						</p>
						<span class="mt-4 text-sm text-purple-500 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							Add transactions to see charts →
						</span>
					</div>
				</a>
				{:else}
					<ChartSummary {expenseIncomeSummary} />
				{/if}
			</div>

			<!-- Goal Progressions Fallback -->
			{#if goalsData.length === 0}
			<a href="#1" class="block">
				<div class="group relative flex flex-col items-center justify-center py-12 text-center rounded-xl bg-white dark:bg-gray-800 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02]" transition:fly={{ y: 20, duration: 300 }}>
					<div class="mb-4 rounded-full bg-green-500/20 p-5 group-hover:bg-green-500/30 transition-colors duration-300">
						<Target class="h-8 w-8 text-green-500 dark:text-green-400" />
					</div>
					<h3 class="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">No Goals Found</h3>
					<p class="max-w-md text-gray-600 dark:text-gray-300">
						Set your financial goals to start tracking your progress here.
					</p>
					<span class="mt-4 text-sm text-green-500 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
						Create your first goal →
					</span>
				</div>
			</a>
			{:else}
				<GoalProgressions {goalsData} {getProgressColor} />
			{/if}
		</div>

		<!-- Investment Analysis Summary Fallback -->
		{#if investmentAnalysisSummary.length === 0}
		<a href="#1" class="block">
			<div class="group relative flex flex-col items-center justify-center py-12 text-center rounded-xl bg-white dark:bg-gray-800 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02]" transition:fly={{ y: 20, duration: 300 }}>
				<div class="mb-4 rounded-full bg-amber-500/20 p-5 group-hover:bg-amber-500/30 transition-colors duration-300">
					<TrendingUp class="h-8 w-8 text-purple-500 dark:text-purple-400text-amber-500 dark:text-amber-400" />
				</div>
				<h3 class="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">No Investment Analysis Data</h3>
				<p class="max-w-md text-gray-600 dark:text-gray-300">
					Your investment performance will be summarized here.
				</p>
				<span class="mt-4 text-sm text-amber-500 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					Start tracking investments →
				</span>
			</div>
		</a>
		{:else}
			<InvestmentAnalysisSummary {investmentAnalysisSummary} />
		{/if}

		<!-- Expense Transaction Table Fallback -->
		{#if !expenseTransactions || (Object.keys(expenseTransactions).length === 0 && (!expenseTransactions.metadata || expenseTransactions.metadata.length === 0))}
		<a href="#1" class="block">
			<div class="group relative flex flex-col items-center justify-center py-12 text-center rounded-xl bg-white dark:bg-gray-800 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02]" transition:fly={{ y: 20, duration: 300 }}>
				<div class="mb-4 rounded-full bg-cyan-500/20 p-5 group-hover:bg-cyan-500/30 transition-colors duration-300">
					<List class="h-8 w-8 text-purple-500 dark:text-purple-400" />
				</div>
				<h3 class="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">No Transactions Found</h3>
				<p class="max-w-md text-gray-600 dark:text-gray-300">
					As you log expenses, they'll show up in your transactions here.
				</p>
				<span class="mt-4 text-sm text-cyan-500 dark:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					Record your first transaction →
				</span>
			</div>
		</a>
		{:else}
			<Expensetransactiontable {expenseTransactions} />
		{/if}
	</div>
</div>

<style>
	/* additional styling for improved responsiveness */
</style>
