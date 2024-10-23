<script>
	import AlertConfirmationDialog from '../common/alertconfirmationdialog.svelte';
	import BudgetsGoalsNotFound from './notfound/budgetsgoalsnotfound.svelte';
	import BudgetsRecurringExpensesNotFound from './notfound/budgetsrecurringexpensesnotfound.svelte';
	import {deleteBudgetByBudgetID} from '$lib/dataservice/budgets/budgetsDataService';
	import { PieChart } from 'layerchart';
	import { schemeTableau10 } from 'd3-scale-chromatic';
	import { TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS } from '$lib/settings/constants.js';
	import { toastManager } from '$lib/helpers/utilities.js';
	import {
		ChevronDown,
		ChevronUp,
		FileText,
		Target,
		Repeat,
		Edit,
	} from 'lucide-svelte';
	import { fly, fade, slide } from 'svelte/transition';

	let { defaultCurrency, budgetItem, performDelete } = $props();
	let expandedBudget = $state(null);
	let hasData = $state(budgetItem.goal_summary.length > 0 || budgetItem.recurring_expenses.length > 0);

	const prepareChartData = (goalContribution, recurringExpenses, totalExpenses) => {
		// Handle null or NaN values safely by providing default numbers
		const safeGoalContribution = parseFloat(goalContribution) || 0;
		const safeRecurringExpenses = parseFloat(recurringExpenses) || 0;
		const safeTotalExpenses = parseFloat(totalExpenses) || 0;

		return [
			{ name: 'Goal Monthly Contribution', value: safeGoalContribution },
			{ name: 'Projected Recurring Expenses', value: safeRecurringExpenses },
			{ name: 'Other Expenses', value: safeTotalExpenses - safeRecurringExpenses }
		];
	};

	// Toggling expanded budget with null/undefined checks
	function toggleExpand(budgetId) {
		if (budgetId) {
			expandedBudget = expandedBudget === budgetId ? null : budgetId;
		}
	}

	// Safely handle update actions
	function handleUpdate(budgetId) {
		if (budgetId) {
			console.log(`Update budget: ${budgetId}`);
		} else {
			console.error('Budget ID is invalid.');
		}
	}

	// Safely handle delete actions
	async function handleDelete(budgetId) {
		// verify if budget id is a valid number and not <= 0
		if (budgetId && budgetId > 0) {
			try{
				const response = await deleteBudgetByBudgetID(budgetId);
				if(response.success){
					toastManager(TOAST_TYPE_SUCCESS, response.message);
					// remove the budget from the list
					performDelete(budgetId);
					
				}else{
					toastManager(TOAST_TYPE_ERROR, response.message);
				}
			} catch (error) {
				console.error('Error deleting budget:', error);
			}
		} else {
			console.error('Budget ID is invalid.');
		}
	}

</script>

<div
	class="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-600 dark:bg-gray-800"
>
	<div class="flex flex-col justify-between lg:flex-row lg:items-center">
		<!-- Left: Budget Details -->
		<div class="mb-4 flex items-center space-x-4 lg:mb-0">
			<FileText class="h-6 w-6 text-gray-600 dark:text-gray-300" />
			<div class="space-y-2">
				<h2 class="flex items-center text-xl font-semibold text-gray-900 dark:text-gray-200">
					{budgetItem.budget.name}
				</h2>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					Created: {new Date(budgetItem.budget.created_at).toLocaleDateString()}
				</p>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					Category: {budgetItem.budget.category}
				</p>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					Total Amount: ${budgetItem.budget.total_amount}
				</p>
			</div>
		</div>

		<!-- Middle: Default Currency, Conversion Rate, and is_strict Badge -->
		<div class="mb-4 text-center lg:mb-0">
			<p class="text-lg text-gray-500 dark:text-gray-400">Currency</p>
			<p class="text-xl font-semibold text-gray-900 dark:text-gray-200">
				{budgetItem.budget.currency_code || defaultCurrency}
			</p>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				Conversion Rate: {budgetItem.budget.conversion_rate}
			</p>
			<span
				class={`rounded-full px-2 py-1 text-sm font-medium ${budgetItem.budget.is_strict ? 'bg-green-100 text-green-700 dark:bg-green-600 dark:text-green-100' : 'bg-red-100 text-red-700 dark:bg-red-600 dark:text-red-100'}`}
			>
				{budgetItem.budget.is_strict ? 'Strict Budget' : 'Flexible Budget'}
			</span>
		</div>

		<!-- Right: Pie Chart, Summary, and Actions -->
		<div class="flex w-full flex-col items-center space-x-6 lg:w-auto lg:flex-row">
			{#if hasData}
				<!-- Pie Chart -->
				<div class="mb-4 h-40 w-full lg:mb-0 lg:w-40">
					<PieChart
						data={prepareChartData(
							budgetItem.goal_summary_totals.total_monthly_contribution,
							budgetItem.goal_summary_totals.projected_recurring_expenses,
							budgetItem.goal_summary_totals.total_expenses
						)}
						key="name"
						value="value"
						innerRadius={-10}
						cornerRadius={5}
						padAngle={0.02}
						cRange={schemeTableau10}
					/>
				</div>
			{:else}
				<!-- Fallback section -->
				<div class="flex justify-center items-center w-full h-auto py-8">
					<div class="flex flex-col items-center justify-center w-auto max-w-sm text-center p-4 ml-2 dark:bg-gray-800 bg-gray-50 rounded-md shadow-sm">
					  <svg class="w-12 h-12 text-gray-400 dark:text-gray-600 mb-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3M5 3h14l2 6H3l2-6z" />
					  </svg>
					  <h2 class="text-base font-semibold text-gray-600 dark:text-gray-300 mb-1">No Budget Data</h2>
					  <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">It looks like you haven't set any goals or expenses yet.</p>
					  <div class="flex space-x-4">
						<a href="/dashboard/goals" 
						  class="text-blue-600 dark:text-blue-400 text-sm font-medium underline hover:text-blue-500 dark:hover:text-blue-300 transition duration-300">
						  Create Goals
						</a>
						<a href="/dashboard/expenses" 
						  class="text-blue-600 dark:text-blue-400 text-sm font-medium underline hover:text-blue-500 dark:hover:text-blue-300 transition duration-300">
						  Create Expenses
						</a>
					  </div>
					</div>
				  </div>
				  
			{/if}

			<!-- Summary -->
			<div
				class="mb-4 w-full rounded-lg bg-gray-50 p-4 text-center shadow-md dark:bg-gray-700 lg:mb-0 lg:w-40"
			>
				<div class="mb-3">
					<span class="block text-sm text-gray-600 dark:text-gray-300"
						>Total Recurring Expenses</span
					>
					<p class="text-lg font-bold text-gray-900 dark:text-white">
						${budgetItem.goal_summary_totals.projected_recurring_expenses}
					</p>
				</div>
				<div>
					<span class="block text-sm text-gray-600 dark:text-gray-300">Total Goals</span>
					<p class="text-lg font-bold text-gray-900 dark:text-white">
						${budgetItem.goal_summary_totals.total_monthly_contribution}
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Actions -->
	<div class="mt-4 flex flex-wrap justify-end space-x-4">
		<button
			class="flex items-center text-gray-500 transition duration-150 ease-in-out hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
			onclick={() => handleUpdate(budgetItem.budget.id)}
		>
			<Edit class="mr-1 h-5 w-5" /> <span class="text-sm">Update</span>
		</button>
		<AlertConfirmationDialog alertHandleContinue={() => handleDelete(budgetItem.budget.id)} />
	</div>

	<!-- Expand/Collapse Button -->
	<div class="mt-4 flex items-center justify-center">
		<button
			onclick={() => toggleExpand(budgetItem.budget.id)}
			class="flex items-center text-blue-500 hover:underline dark:text-blue-400"
		>
			{#if expandedBudget === budgetItem.budget.id}
				Collapse <ChevronUp class="ml-2 h-4 w-4" />
			{:else}
				Expand <ChevronDown class="ml-2 h-4 w-4" />
			{/if}
		</button>
	</div>

	<!-- Expansion Panel for Goals, Recurring Expenses, and Total Summaries -->
	{#if expandedBudget === budgetItem.budget.id}
		<div in:fly={{ x: -200, duration: 1000 }} out:fade>
			<!-- Existing Expansion Content -->
			<div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Goal Summary Section -->
				<div class="max-h-64 overflow-auto rounded-lg bg-gray-100 p-4 shadow-md dark:bg-gray-900">
					<div class="mb-4 flex items-center">
						<Target class="mr-2 h-5 w-5 text-gray-600 dark:text-gray-300" />
						<h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">Goal Summary</h3>
					</div>
					<ul class="space-y-3">
						{#if budgetItem.goal_summary.length === 0}
							<BudgetsGoalsNotFound />
						{:else}
							{#each budgetItem.goal_summary as goal}
								<li class="rounded-lg bg-gray-200 p-3 dark:bg-gray-700">
									<p class="font-semibold text-gray-800 dark:text-white">{goal.name}</p>
									<span
										class="rounded-full bg-green-100 px-2 py-1 text-sm font-medium text-green-700 dark:bg-green-600 dark:text-green-100"
									>
										Monthly Contribution: ${goal.monthly_contribution}
									</span>
								</li>
							{/each}
						{/if}
					</ul>
				</div>

				<!-- Recurring Expenses Section -->
				<div class="max-h-64 overflow-auto rounded-lg bg-gray-100 p-4 shadow-md dark:bg-gray-900">
					<div class="mb-4 flex items-center">
						<Repeat class="mr-2 h-5 w-5 text-gray-600 dark:text-gray-300" />
						<h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">Recurring Expenses</h3>
					</div>
					<ul class="space-y-3">
						{#if budgetItem.recurring_expenses.length === 0}
							<BudgetsRecurringExpensesNotFound />
						{:else}
							{#each budgetItem.recurring_expenses as expense}
								<li class="rounded-lg bg-gray-200 p-3 dark:bg-gray-700">
									<p class="font-semibold text-gray-800 dark:text-white">{expense.name}</p>
									<span
										class="rounded-full bg-red-100 px-2 py-1 text-sm font-medium text-red-700 dark:bg-red-600 dark:text-red-100"
									>
										Amount: ${expense.amount}
									</span>
								</li>
							{/each}
						{/if}
					</ul>
				</div>
			</div>

			<!-- Total Summary Section -->
			<div
				class="mt-6 grid grid-cols-1 gap-6 rounded-lg bg-gray-100 p-4 text-center shadow-md dark:bg-gray-900 md:grid-cols-2 lg:grid-cols-5"
			>
				<div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
					<span class="block text-sm text-gray-600 dark:text-gray-300">Total Budget Amount</span>
					<p class="text-lg font-bold text-gray-900 dark:text-white">
						${budgetItem.goal_summary_totals.total_budget_amount}
					</p>
				</div>
				<div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
					<span class="block text-sm text-gray-600 dark:text-gray-300"
						>Total Monthly Contribution</span
					>
					<p class="text-lg font-bold text-gray-900 dark:text-white">
						${budgetItem.goal_summary_totals.total_monthly_contribution}
					</p>
				</div>
				<div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
					<span class="block text-sm text-gray-600 dark:text-gray-300">Total Expenses</span>
					<p class="text-lg font-bold text-gray-900 dark:text-white">
						${budgetItem.goal_summary_totals.total_expenses}
					</p>
				</div>
				<div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
					<span class="block text-sm text-gray-600 dark:text-gray-300"
						>Projected Recurring Expenses</span
					>
					<p class="text-lg font-bold text-gray-900 dark:text-white">
						${budgetItem.goal_summary_totals.projected_recurring_expenses}
					</p>
				</div>
				<div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
					<span class="block text-sm text-gray-600 dark:text-gray-300">Total Surplus</span>
					<p class="text-lg font-bold text-gray-900 dark:text-white">
						${budgetItem.goal_summary_totals.total_surplus}
					</p>
				</div>
			</div>
		</div>
	{/if}
</div>
