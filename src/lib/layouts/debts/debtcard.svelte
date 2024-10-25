<script>
	import { Progress } from '$lib/components/ui/progress';
	import CreateDebtInstallment from './createdebtinstallment.svelte';
	import { fly } from 'svelte/transition';
	import { CreditCard, ChevronDown, ChevronUp, Search , CheckCircle} from 'lucide-svelte';

	let { data, defaultCurrency, debtItem, searchQuery, expandedDebt } = $props();

	const toggleExpanded = (id) => {
		expandedDebt = expandedDebt === id ? null : id;
	};

	const filterPayments = (payments) => {
		if (!searchQuery) return payments;
		return payments.filter((p) => p.debt_payment.payment_date.includes(searchQuery));
	};

	const calculatePaymentProgress = (debt) => {
		// Ensure totalAmount and remainingBalance are valid numbers
		const totalAmount = parseFloat(debt.debt.amount);
		const remainingBalance = parseFloat(debt.debt.remaining_balance);

		if (isNaN(totalAmount) || isNaN(remainingBalance) || totalAmount === 0) {
			return 0; // Return 0% progress if inputs are invalid or totalAmount is zero
		}

		const paidAmount = totalAmount - remainingBalance;
		return (paidAmount / totalAmount) * 100;
	};

	const assessProgress = (debt) => {
		const progress = calculatePaymentProgress(debt);
		const now = new Date();

		// Ensure dueDate and created_at are valid dates
		const dueDate = new Date(debt.debt.due_date);
		const createdAt = new Date(debt.debt.created_at);

		if (isNaN(dueDate) || isNaN(createdAt) || dueDate <= createdAt) {
			return { status: 'Invalid Dates', color: 'text-gray-600' }; // Handle invalid date range
		}

		const timeLeft = (dueDate - now) / (1000 * 60 * 60 * 24); // Days left

		const timeElapsedPercentage = ((now - createdAt) / (dueDate - createdAt)) * 100;

		if (progress >= timeElapsedPercentage) {
			return { status: 'On Track', color: 'text-green-600' };
		} else {
			return { status: 'Falling Behind', color: 'text-red-600' };
		}
	};

	const calculatePaymentProbability = (debt) => {
		const remainingBalance = parseFloat(debt.debt.remaining_balance);
		const minimumPayment = parseFloat(debt.debt.minimum_payment);

		// Ensure debt.payments is defined and is an array
		const totalPaymentsMade = Array.isArray(debt.payments) ? debt.payments.length : 0;

		const averagePaymentAmount =
			totalPaymentsMade > 0
				? debt.payments.reduce(
						(total, payment) => total + parseFloat(payment.debt_payment.payment_amount),
						0
					) / totalPaymentsMade
				: 0;

		const estimatedPaymentsLeft =
			averagePaymentAmount > 0 ? Math.ceil(remainingBalance / averagePaymentAmount) : Infinity; // Handle case where averagePaymentAmount is 0

		const nextPaymentDate = new Date(debt.debt.next_payment_date);
		const estimatedPayoffDate = new Date(debt.debt.estimated_payoff_date);

		// Calculate months between nextPaymentDate and estimatedPayoffDate
		const monthsBetween = Math.ceil(
			(estimatedPayoffDate - nextPaymentDate) / (1000 * 60 * 60 * 24 * 30)
		);

		return estimatedPaymentsLeft <= monthsBetween ? 'Likely' : 'Unlikely';
	};

	function addInstallment(){
		console.log('Add Installment');
	}
</script>

<div
	class="mb-4 rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800"
>
	<!-- Debt Header -->
	<div class="flex items-center justify-between border-b border-gray-300 pb-4 dark:border-gray-600">
		<div>
			<h2 class="flex items-center space-x-2 text-xl font-semibold dark:text-gray-200">
				<CreditCard class="h-5 w-5 text-blue-500" />
				<span>{debtItem.debt.name}</span>
			</h2>
		</div>
		<div>
			<button
				onclick={() => toggleExpanded(debtItem.debt.id)}
				class="transform text-blue-600 transition-transform hover:scale-110 focus:outline-none dark:text-blue-400"
			>
				{#if expandedDebt === debtItem.debt.id}
					<ChevronUp class="h-6 w-6" />
				{:else}
					<ChevronDown class="h-6 w-6" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Three-Column Info Section -->
	<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
		<!-- Section 1: Payment Information -->
		<div>
			<h3 class="mb-2 text-lg font-bold dark:text-gray-200">Payment Info</h3>
			<p class="text-gray-600 dark:text-gray-400">
				Amount:
				<span
					class="inline-block rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-200"
				>
					${debtItem.debt.amount}
				</span>
			</p>
			<p class="text-gray-600 dark:text-gray-400">
				Remaining Balance:
				<span
					class="inline-block rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-200"
				>
					${debtItem.debt.remaining_balance}
				</span>
			</p>
			<p class="text-gray-600 dark:text-gray-400">
				Minimum Payment:
				<span
					class="inline-block rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-200"
				>
					${debtItem.debt.minimum_payment}
				</span>
			</p>
		</div>

		<!-- Section 2: Interest Information -->
		<div>
			<h3 class="mb-2 text-lg font-bold dark:text-gray-200">Interest Info</h3>
			<p class="text-gray-600 dark:text-gray-400">
				Interest Rate:
				<span
					class="inline-block rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-200"
				>
					{debtItem.debt.interest_rate}%
				</span>
			</p>
			<p class="text-gray-600 dark:text-gray-400">
				Accrued Interest:
				<span
					class="inline-block rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-200"
				>
					${debtItem.debt.accrued_interest}
				</span>
			</p>
		</div>

		<!-- Section 3: Date Information -->
		<div>
			<h3 class="mb-2 text-lg font-bold dark:text-gray-200">Date Info</h3>
			<p class="text-gray-600 dark:text-gray-400">
				Next Payment Date:
				<span
					class="inline-block rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-200"
				>
					{new Date(debtItem.debt.next_payment_date).toLocaleDateString()}
				</span>
			</p>
			<p class="text-gray-600 dark:text-gray-400">
				Estimated Payoff Date:
				<span
					class="inline-block rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-200"
				>
					{new Date(debtItem.debt.estimated_payoff_date).toLocaleDateString()}
				</span>
			</p>
			<p class="text-gray-600 dark:text-gray-400">
				Last Payment Date:
				<span
					class="inline-block rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-200"
				>
					{new Date(debtItem.debt.last_payment_date).toLocaleDateString()}
				</span>
			</p>
		</div>
	</div>

	<!-- Section: Status/Analysis -->
	<div class="mt-6">
		<h3 class="mb-2 text-lg font-bold dark:text-gray-200">Status/Analysis</h3>
		<p class="text-gray-600 dark:text-gray-400">
			Payment Progress: <span class={assessProgress(debtItem).color}
				>{assessProgress(debtItem).status}</span
			>
		</p>
		<p class="text-gray-600 dark:text-gray-400">
			Probability of Paying On Time: <span class="font-semibold"
				>{calculatePaymentProbability(debtItem)}</span
			>
		</p>
		<p class="text-gray-600 dark:text-gray-400">
			Estimated Payoff Date: <span
				class="mt-1 block rounded-md bg-green-100 px-2 py-1 text-sm text-green-600 dark:bg-green-700 dark:text-green-200"
			>
				{new Date(debtItem.debt.estimated_payoff_date).toLocaleDateString()}
			</span>
		</p>
	</div>

	<!-- Progress Bar Section -->
	<div class="mt-6">
		<p class="mb-1 text-gray-600 dark:text-gray-400">Payment Progress:</p>
		<Progress value={calculatePaymentProgress(debtItem)} />
		<p class="text-right text-sm text-gray-600 dark:text-gray-400">
			{calculatePaymentProgress(debtItem).toFixed(2)}% paid
		</p>
	</div>

	<!-- Expandable Payments Section -->
	{#if expandedDebt === debtItem.debt.id}
	<div in:fly={{ y: -20 }} class="mt-6">
		<div class="mb-2 flex items-center justify-between">
			<h3 class="text-lg font-semibold dark:text-gray-200">Installments</h3>

			<!-- Search Input -->
			<div class="relative w-64">
				<input
					type="text"
					placeholder="Search by date"
					bind:value={searchQuery}
					class="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-300 focus:outline-none focus:ring dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
				/>
				<Search
					class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400"
				/>
			</div>
		</div>

		<!-- Add Installment Button If Progress is <100 -->
<div class="flex flex-col items-center mt-6"> <!-- Center the content with margin-top -->
    {#if calculatePaymentProgress(debtItem) < 100}
        <CreateDebtInstallment {data} {defaultCurrency} budgetID={debtItem.debt.id} />
    {:else}
	<div class="bg-green-50 dark:bg-green-700 p-4 rounded-lg shadow-md text-center mt-4 flex flex-col items-center space-y-1.5">
		<!-- Success Icon -->
		<CheckCircle class="h-6 w-6 text-green-500 dark:text-green-300" />
	
		<!-- Success Message -->
		<p class="text-green-700 dark:text-green-100 font-semibold text-md">
			You have paid off this debt!
		</p>
	</div>
	
	
    {/if}
</div>

		<!-- Payment List -->
		<ul class="divide-y divide-gray-200 dark:divide-gray-700">
			{#each filterPayments(debtItem.payments) as payment}
				<li class="py-4">
					<div class="flex justify-between">
						<p class="font-semibold dark:text-gray-200">
							Payment Date: {new Date(payment.debt_payment.payment_date).toLocaleDateString()}
						</p>
						<p class="text-sm text-gray-600 dark:text-gray-400">
							Amount: ${payment.debt_payment.payment_amount}
						</p>
					</div>
					<p class="text-sm text-gray-600 dark:text-gray-400">
						Interest: ${payment.debt_payment.interest_payment}, Principal: ${payment.debt_payment
							.principal_payment}
					</p>
				</li>
			{/each}
		</ul>
	</div>
{/if}

</div>
