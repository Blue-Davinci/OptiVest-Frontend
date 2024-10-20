<script>
	import { Search, Bell, CreditCard } from 'lucide-svelte';
	import ExpenseIncomeSummary from '$lib/layouts/dashboard/expenseincomesummary.svelte';
	import WelcomeHeader from '$lib/layouts/dashboard/welcomeheader.svelte';
	import ChartSummary from '$lib/layouts/dashboard/chartsummary.svelte';

	let stats = [
		{ title: 'Total Users', value: 1200, icon: '👥' },
		{ title: 'Revenue', value: '$45,000', icon: '💰' },
		{ title: 'New Orders', value: 342, icon: '📦' },
		{ title: 'Support Tickets', value: 18, icon: '🎫' }
	];
	let transactions = [
		{
			name: 'Groceries',
			date: '01/10/2024',
			amount: -150,
			category: 'Food',
			account: 'Debit Card',
			status: 'Completed'
		},
		{
			name: 'Salary',
			date: '02/10/2024',
			amount: 4000,
			category: 'Income',
			account: 'Bank Transfer',
			status: 'Completed'
		}
	];

	let { data } = $props();
	let firstName = $state(data.userInformation.first_name);
	let goalsData = $state(data.goalData.data.goals);
	let expenseIncomeSummary = $state(data.expenseIncomeSummary.data.expense_income_summary_report);
	$inspect(expenseIncomeSummary);

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

	// Transform data for the chart
	let chartData = expenseIncomeSummary.map((item) => ({
		month: item.month,
		income: parseFloat(item.total_income), // Make sure values are numbers
		expenses: -parseFloat(item.total_expenses) // Expenses as negative for diverging bars
	}));
</script>

<div class="min-h-screen bg-gray-100 p-8 dark:bg-gray-900">
	<div class="mx-auto max-w-7xl">
		<!-- Welcome Header -->
		<WelcomeHeader {firstName} />
		<!-- Updated Component -->
		<ExpenseIncomeSummary {expenseIncomeSummary} />
		<!-- Placeholder for Chart -->
		<div class="grid grid-cols-3 gap-6">
      <div class="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md" style="height: 400px;">
        <ChartSummary {chartData} />
      </div>

			<!-- Savings Goals -->
			<div class="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
				<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Savings Goals</h2>
				{#each goalsData as goal}
					<div class="mb-6">
						<div class="mb-2 flex items-center justify-between">
							<span class="font-medium text-gray-700 dark:text-gray-300">{goal.goals.name}</span>
							<span class="text-sm text-gray-500 dark:text-gray-400"
								>{goal.progress_percentage}%</span
							>
						</div>
						<!-- Progress Bar with color coding -->
						<div class="mb-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
							<div
								class="{getProgressColor(goal.progress_percentage)} h-2 rounded-full"
								style="width: {goal.progress_percentage}%"
							></div>
						</div>
						<!-- Goal Details -->
						<div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
							<span>Current: ${goal.goals.current_amount}</span>
							<span class="badge rounded-md bg-gray-100 px-2 py-1 text-gray-500"
								>Target: ${goal.goals.target_amount}</span
							>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Transactions Table -->
		<div class="mt-4 rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
				<div class="flex items-center space-x-4">
					<div class="relative">
						<Search
							class="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400 dark:text-gray-500"
							size={16}
						/>
						<input
							type="text"
							placeholder="Search transactions"
							class="rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
						/>
					</div>
					<button
						class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-gray-200"
					>
						Filter
					</button>
				</div>
			</div>
			<table class="w-full">
				<thead>
					<tr class="text-left text-sm text-gray-500 dark:text-gray-400">
						<th class="pb-4">Transaction</th>
						<th class="pb-4">Date</th>
						<th class="pb-4">Amount</th>
						<th class="pb-4">Category</th>
						<th class="pb-4">Account</th>
						<th class="pb-4">Status</th>
					</tr>
				</thead>
				<tbody>
					{#each transactions as transaction}
						<tr class="border-t border-gray-100 dark:border-gray-700">
							<td class="py-4">
								<div class="flex items-center space-x-3">
									<div class="rounded-full bg-pink-500 p-2">
										<CreditCard size={16} color="white" />
									</div>
									<span class="font-medium text-gray-900 dark:text-gray-100"
										>{transaction.name}</span
									>
								</div>
							</td>
							<td class="py-4 text-sm text-gray-500 dark:text-gray-400">{transaction.date}</td>
							<td class="py-4 font-medium text-gray-900 dark:text-gray-100"
								>${Math.abs(transaction.amount).toFixed(2)}</td
							>
							<td class="py-4">
								<span
									class="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-800 dark:text-blue-100"
									>{transaction.category}</span
								>
							</td>
							<td class="py-4 text-sm text-gray-900 dark:text-gray-100">{transaction.account}</td>
							<td class="py-4">
								<span
									class="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-800 dark:text-green-100"
									>{transaction.status}</span
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<style>
	/* additional styling for improved responsiveness */
</style>
