<script>
	import CreateRecurringExpense from '$lib/layouts/expenses/createrecurringexpense.svelte';
	import RecurringExpensesAnalytics from '$lib/layouts/expenses/recurringexpensesanalytics.svelte';
	import RecurringeExpensesNotFound from '$lib/layouts/expenses/notfound/recurringexpensesnotfound.svelte';
	import RecurringExpensesSection from '$lib/layouts/expenses/recurringexpensessection.svelte';
	import Recurringexpensessectionnotfound from '$lib/layouts/expenses/notfound/recurringexpensessectionnotfound.svelte';
	import ExpensesChartSection from '$lib/layouts/expenses/expenseschartsection.svelte';
	import ExpenseChartSectionNotFound from '$lib/layouts/expenses/notfound/expensechartsectionnotfound.svelte';
	import RegularExpenseSection from '$lib/layouts/expenses/regularexpensesection.svelte';
	import RegularExpensesNotFound from '$lib/layouts/expenses/notfound/regularexpensesnotfound.svelte';

	let { data } = $props();
	let expenses = $derived(data?.expenses?.data?.expenses ?? []);
	let recurringExpenses = $derived(data?.recurringExpenses?.data?.recurring_expenses ?? []);
	let expenseSearchQuery = $state('');
	let recurringSearchQuery = $state('');
	let budgetIDNames = $derived(data?.budgetIDNames?.data?.budget_id_names ?? []);
	let defaultCurrency = $state(data.userInformation?.currency_code === '' ? 'USD' : data.userInformation?.currency_code);

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
		<RecurringExpensesSection
			{filteredRecurringExpenses}
			{recurringSearchQuery}
			{formatAmount}
			{formatDate}
		/>
	{/if}

	<!-- Charts Section -->
	{#if expenses?.length > 0}
		<ExpensesChartSection {expenses} {recurringExpenses} {formatAmount} />
	{:else}
		<ExpenseChartSectionNotFound />
	{/if}

	<!-- Regular Expenses Section -->
	{#if filteredExpenses?.length > 0}
		<RegularExpenseSection {data} {defaultCurrency} {budgetIDNames} {filteredExpenses} {expenseSearchQuery} {formatAmount} {formatDate} />
	{:else}
		<RegularExpensesNotFound {expenseSearchQuery}/>
	{/if}
</main>
