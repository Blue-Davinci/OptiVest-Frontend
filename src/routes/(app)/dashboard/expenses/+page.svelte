<script>
	import {
		Search,
		ChartPie as PieChartIcon,
    Receipt,
    Wallet,
    ChartLine as LineChartIcon,
    Clock
	} from 'lucide-svelte';

    import CreateRecurringExpense from '$lib/layouts/expenses/createrecurringexpense.svelte';
    import RecurringExpensesAnalytics from '$lib/layouts/expenses/recurringexpensesanalytics.svelte';
    import RecurringeExpensesNotFound from '$lib/layouts/expenses/notfound/recurringexpensesnotfound.svelte';
    import RecurringExpensesSection from '$lib/layouts/expenses/recurringexpensessection.svelte';
    import Recurringexpensessectionnotfound from '$lib/layouts/expenses/notfound/recurringexpensessectionnotfound.svelte';
    import ExpensesChartSection from '$lib/layouts/expenses/expenseschartsection.svelte';


	let { data } = $props();
	let expenses = $derived(data?.expenses?.data?.expenses ?? []);
	let recurringExpenses = $derived(data?.recurringExpenses?.data?.recurring_expenses ?? []);
	let expenseSearchQuery = $state('');
	let recurringSearchQuery = $state('');
    let budgetIDNames =$derived(data?.budgetIDNames?.data?.budget_id_names ?? []);	
    let defaultCurrency = $state(data.userInformation.currency_code);

    $inspect(data);

	let filteredExpenses = $derived(
		expenses.filter(
			(expense) =>
				expense.name.toLowerCase().includes(expenseSearchQuery.toLowerCase()) ||
				expense.description.toLowerCase().includes(expenseSearchQuery.toLowerCase()) ||
				expense.category.toLowerCase().includes(expenseSearchQuery.toLowerCase())
		)
	);

	let filteredRecurringExpenses = $derived(
		recurringExpenses.filter(
			(recurring) =>
				recurring.recurring_expense.name
					.toLowerCase()
					.includes(recurringSearchQuery.toLowerCase()) ||
				recurring.recurring_expense.description
					.toLowerCase()
					.includes(recurringSearchQuery.toLowerCase()) ||
				recurring.budget_name.toLowerCase().includes(recurringSearchQuery.toLowerCase())
		)
	);

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	const formatAmount = (amount) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: data?.userInformation?.currency_code ?? 'USD'
		}).format(Number(amount));
	};
	/// =========================================
	



</script>

<CreateRecurringExpense {data} {budgetIDNames} {defaultCurrency} />

<!-- Recurring Expenses Analytics -->
{#if recurringExpenses?.length > 0}
    <RecurringExpensesAnalytics {recurringExpenses} {formatAmount} {formatDate} />
{:else}
    <RecurringeExpensesNotFound />
{/if}

<main class="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
	<!-- Recurring Expenses Section -->
	{#if !recurringExpenses?.length}
        <Recurringexpensessectionnotfound />
	{:else}
		<RecurringExpensesSection {filteredRecurringExpenses} {recurringSearchQuery} {formatAmount} {formatDate} />
	{/if}

	<!-- Charts Section -->
	{#if expenses?.length > 0}
        <ExpensesChartSection {expenses} {recurringExpenses} {formatAmount} />
	{:else}
    <section class="mb-12">
        <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div class="grid gap-8 lg:grid-cols-2">
                <!-- Line Chart Placeholder -->
                <div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-700/50">
                    <div class="mb-6">
                        <h3 class="flex items-center text-lg font-medium text-gray-800 dark:text-white">
                            <LineChartIcon class="mr-2 h-5 w-5 text-purple-500" />
                            Monthly Trends
                        </h3>
                        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Track your spending patterns
                        </p>
                    </div>
                    <div class="flex h-[300px] items-center justify-center">
                        <div class="h-64 w-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/30">
                            <LineChartIcon class="h-12 w-12 text-primary/50 mb-2" />
                            <p class="text-sm text-muted-foreground text-center px-4">
                                Add expenses to view spending trends
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Category Distribution Placeholder -->
                <div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-700/50">
                    <div class="mb-6">
                        <h3 class="flex items-center text-lg font-medium text-gray-800 dark:text-white">
                            <PieChartIcon class="mr-2 h-5 w-5 text-purple-500" />
                            Category Distribution
                        </h3>
                        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            View spending by category
                        </p>
                    </div>
                    <div class="flex h-[300px] items-center justify-center">
                        <div class="h-64 w-64 flex flex-col items-center justify-center rounded-full border-2 border-dashed border-primary/30">
                            <Receipt class="h-12 w-12 text-primary/50 mb-2" />
                            <p class="text-sm text-muted-foreground text-center px-4">
                                Categorize expenses to see distribution
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Stats Placeholder -->
            <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                {#each ['Total Expenses', 'Monthly Average', 'Categories'] as stat}
                    <div class="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                        <h4 class="mb-2 text-sm font-medium text-purple-600 dark:text-purple-300">
                            {stat}
                        </h4>
                        <div class="h-8 w-32 rounded bg-purple-200/50 dark:bg-purple-800/50"></div>
                    </div>
                {/each}
            </div>
        </div>
    </section>
	{/if}

	<!-- Regular Expenses Section -->
	{#if filteredExpenses?.length > 0}
		<section>
			<div
				class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
			>
				<div class="mb-8 flex items-center justify-between">
					<div>
						<h2 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">All Expenses</h2>
						<p class="text-gray-600 dark:text-gray-300">
							View and manage all your recorded expenses
						</p>
					</div>
					<div class="relative">
						<input
							type="text"
							bind:value={expenseSearchQuery}
							placeholder="Search expenses..."
							class="w-72 rounded-lg border border-gray-200 bg-white py-2.5 pl-10
                       pr-4 text-gray-900 placeholder-gray-400 outline-none
                       focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700
                       dark:text-gray-100 dark:placeholder-gray-500"
						/>
						<Search class="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
					</div>
				</div>

				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gray-50 dark:bg-gray-700">
							<tr>
								<th
									class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
									>Name</th
								>
								<th
									class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
									>Category</th
								>
								<th
									class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
									>Amount</th
								>
								<th
									class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
									>Date</th
								>
								<th
									class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
									>Description</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
							{#each filteredExpenses as expense}
								<tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
									<td class="px-6 py-4">
										<div class="text-sm font-medium text-gray-900 dark:text-white">
											{expense.name}
										</div>
									</td>
									<td class="px-6 py-4">
										<span
											class="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold
                                 leading-5 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
										>
											{expense.category}
										</span>
									</td>
									<td class="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-300">
										{formatAmount(expense.amount)}
									</td>
									<td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
										{formatDate(expense.date_occurred)}
									</td>
									<td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
										<div class="max-w-xs truncate">{expense.description}</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	{:else}
    <section>
        <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div class="flex flex-col items-center justify-center py-12">
                <div class="mb-6 grid grid-cols-3 gap-4">
                    <Receipt class="h-12 w-12 text-purple-200 dark:text-purple-900" />
                    <Wallet class="h-12 w-12 text-purple-300 dark:text-purple-800" />
                    <Clock class="h-12 w-12 text-purple-400 dark:text-purple-700" />
                </div>
                <h3 class="mb-3 text-xl font-semibold text-gray-800 dark:text-white">
                    {expenseSearchQuery ? 'No Matching Expenses Found' : 'Ready to Track Your Expenses'}
                </h3>
                <p class="mx-auto mb-6 max-w-md text-center text-gray-600 dark:text-gray-400">
                    {expenseSearchQuery
                        ? 'Try adjusting your search terms or clear the search to see all expenses.'
                        : 'Start recording your expenses to gain insights into your spending habits and make informed financial decisions.'}
                </p>
                
                <!-- Placeholder Table Header -->
                <div class="mt-8 w-full max-w-4xl rounded-lg border border-gray-200 dark:border-gray-700">
                    <div class="grid grid-cols-5 gap-4 bg-gray-50 p-4 dark:bg-gray-700">
                        {#each ['Name', 'Category', 'Amount', 'Date', 'Description'] as header}
                            <div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-600"></div>
                        {/each}
                    </div>
                    <div class="p-8 text-center">
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            Your expense records will appear here
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
	{/if}
</main>
