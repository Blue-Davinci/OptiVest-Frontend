<script>
    import { CreditCard, ChevronDown, ChevronUp, Search } from 'lucide-svelte';
    import { Progress } from "$lib/components/ui/progress";
    import { fly } from 'svelte/transition';
  
    let { data } = $props();
    let debts = $derived(data?.debts?.data?.debts || []);
    let searchQuery = $state('');
    let expandedDebt = $state(null);
    let fallback = $derived(debts.length === 0);
  
    const toggleExpanded = (id) => {
      expandedDebt = expandedDebt === id ? null : id;
    };
  
    const filterPayments = (payments) => {
      if (!searchQuery) return payments;
      return payments.filter(p => p.debt_payment.payment_date.includes(searchQuery));
    };
  
    const calculatePaymentProgress = (debt) => {
      const totalAmount = parseFloat(debt.debt.amount);
      const remainingBalance = parseFloat(debt.debt.remaining_balance);
      const paidAmount = totalAmount - remainingBalance;
      return (paidAmount / totalAmount) * 100;
    };
  
    const assessProgress = (debt) => {
      const progress = calculatePaymentProgress(debt);
      const now = new Date();
      const dueDate = new Date(debt.debt.due_date);
      const timeLeft = (dueDate - now) / (1000 * 60 * 60 * 24); // days left
      const timeElapsedPercentage = ((now - new Date(debt.debt.created_at)) / (dueDate - new Date(debt.debt.created_at))) * 100;
  
      if (progress >= timeElapsedPercentage) {
        return { status: 'On Track', color: 'text-green-600' };
      } else {
        return { status: 'Falling Behind', color: 'text-red-600' };
      }
    };
  
    const calculatePaymentProbability = (debt) => {
      const remainingBalance = parseFloat(debt.debt.remaining_balance);
      const minimumPayment = parseFloat(debt.debt.minimum_payment);
      const totalPaymentsMade = debt.payments.length;
      const averagePaymentAmount = totalPaymentsMade > 0 ? debt.payments.reduce((total, payment) => total + parseFloat(payment.debt_payment.payment_amount), 0) / totalPaymentsMade : 0;
  
      const estimatedPaymentsLeft = Math.ceil(remainingBalance / averagePaymentAmount);
      const nextPaymentDate = new Date(debt.debt.next_payment_date);
      const estimatedPayoffDate = new Date(debt.debt.estimated_payoff_date);
  
      return estimatedPaymentsLeft <= Math.ceil((estimatedPayoffDate - nextPaymentDate) / (1000 * 60 * 60 * 24 * 30)) ? 'Likely' : 'Unlikely';
    };
  </script>
<!-- Main Container -->
<div class="max-w-6xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6 flex items-center">
      <CreditCard class="mr-2" />
      Debts for {data?.userName || 'User'}
    </h1>

    <!-- Responsive Card Container -->
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-4 border border-gray-200 dark:border-gray-700">
      <!-- Header with Search Input -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold dark:text-gray-200">Your Debts Overview</h2>
        
        <!-- Search Input -->
        <div class="relative">
          <input
            type="text"
            placeholder="Search debts"
            bind:value={searchQuery}
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
          />
          <Search class="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>
  
    <!-- Fallback if no data is available -->
    {#if fallback}
      <div class="text-center mt-10">
        <CreditCard class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-600 text-lg dark:text-gray-400">No debts found. Please check back later.</p>
      </div>
    {/if}
  
    <!-- Debt Cards -->
    {#each debts as debtItem}
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-4 border border-gray-200 dark:border-gray-700">
        <!-- Debt Header -->
        <div class="flex justify-between items-center pb-4 border-b border-gray-300 dark:border-gray-600">
          <div>
            <h2 class="text-xl font-semibold flex items-center space-x-2 dark:text-gray-200">
              <CreditCard class="text-blue-500 w-5 h-5" />
              <span>{debtItem.debt.name}</span>
            </h2>
          </div>
          <div>
            <button onclick={() => toggleExpanded(debtItem.debt.id)}
              class="text-blue-600 focus:outline-none transition-transform transform hover:scale-110 dark:text-blue-400">
              {#if expandedDebt === debtItem.debt.id}
                <ChevronUp class="w-6 h-6" />
              {:else}
                <ChevronDown class="w-6 h-6" />
              {/if}
            </button>
          </div>
        </div>
  
        <!-- Three-Column Info Section -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Section 1: Payment Information -->
          <div>
            <h3 class="font-bold text-lg mb-2 dark:text-gray-200">Payment Info</h3>
            <p class="text-gray-600 dark:text-gray-400">Amount: 
              <span class="inline-block bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-md dark:bg-gray-700 dark:text-gray-200">
                ${debtItem.debt.amount}
              </span>
            </p>
            <p class="text-gray-600 dark:text-gray-400">Remaining Balance: 
              <span class="inline-block bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-md dark:bg-gray-700 dark:text-gray-200">
                ${debtItem.debt.remaining_balance}
              </span>
            </p>
            <p class="text-gray-600 dark:text-gray-400">Minimum Payment: 
              <span class="inline-block bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-md dark:bg-gray-700 dark:text-gray-200">
                ${debtItem.debt.minimum_payment}
              </span>
            </p>
          </div>
  
          <!-- Section 2: Interest Information -->
          <div>
            <h3 class="font-bold text-lg mb-2 dark:text-gray-200">Interest Info</h3>
            <p class="text-gray-600 dark:text-gray-400">Interest Rate: 
              <span class="inline-block bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-md dark:bg-gray-700 dark:text-gray-200">
                {debtItem.debt.interest_rate}%
              </span>
            </p>
            <p class="text-gray-600 dark:text-gray-400">Accrued Interest: 
              <span class="inline-block bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-md dark:bg-gray-700 dark:text-gray-200">
                ${debtItem.debt.accrued_interest}
              </span>
            </p>
          </div>
  
          <!-- Section 3: Date Information -->
          <div>
            <h3 class="font-bold text-lg mb-2 dark:text-gray-200">Date Info</h3>
            <p class="text-gray-600 dark:text-gray-400">Next Payment Date: 
              <span class="inline-block bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-md dark:bg-gray-700 dark:text-gray-200">
                {new Date(debtItem.debt.next_payment_date).toLocaleDateString()}
              </span>
            </p>
            <p class="text-gray-600 dark:text-gray-400">Estimated Payoff Date: 
              <span class="inline-block bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-md dark:bg-gray-700 dark:text-gray-200">
                {new Date(debtItem.debt.estimated_payoff_date).toLocaleDateString()}
              </span>
            </p>
            <p class="text-gray-600 dark:text-gray-400">Last Payment Date: 
              <span class="inline-block bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-md dark:bg-gray-700 dark:text-gray-200">
                {new Date(debtItem.debt.last_payment_date).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>
  
        <!-- Section: Status/Analysis -->
        <div class="mt-6">
          <h3 class="font-bold text-lg mb-2 dark:text-gray-200">Status/Analysis</h3>
          <p class="text-gray-600 dark:text-gray-400">
            Payment Progress: <span class={assessProgress(debtItem).color}>{assessProgress(debtItem).status}</span>
          </p>
          <p class="text-gray-600 dark:text-gray-400">
            Probability of Paying On Time: <span class="font-semibold">{calculatePaymentProbability(debtItem)}</span>
          </p>
          <p class="text-gray-600 dark:text-gray-400">
            Estimated Payoff Date: <span class="block bg-green-100 text-green-600 text-sm px-2 py-1 rounded-md mt-1 dark:bg-green-700 dark:text-green-200">
              {new Date(debtItem.debt.estimated_payoff_date).toLocaleDateString()}
            </span>
          </p>
        </div>
  
        <!-- Progress Bar Section -->
        <div class="mt-6">
          <p class="text-gray-600 dark:text-gray-400 mb-1">Payment Progress:</p>
          <Progress value={calculatePaymentProgress(debtItem)} />
          <p class="text-right text-sm text-gray-600 dark:text-gray-400">{calculatePaymentProgress(debtItem).toFixed(2)}% paid</p>
        </div>
  
        <!-- Expandable Payments Section -->
        {#if expandedDebt === debtItem.debt.id}
        <div in:fly="{{ y: -20 }}" class="mt-6">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-semibold dark:text-gray-200">Installments</h3>
  
            <!-- Search Input -->
            <div class="relative w-64">
              <input
                type="text"
                placeholder="Search by date"
                bind:value={searchQuery}
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
              />
              <Search class="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
  
          <!-- Payment List -->
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            {#each filterPayments(debtItem.payments) as payment}
              <li class="py-4">
                <div class="flex justify-between">
                  <p class="font-semibold dark:text-gray-200">Payment Date: {new Date(payment.debt_payment.payment_date).toLocaleDateString()}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Amount: ${payment.debt_payment.payment_amount}</p>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Interest: ${payment.debt_payment.interest_payment}, Principal: ${payment.debt_payment.principal_payment}</p>
              </li>
            {/each}
          </ul>
        </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
  

<style>
/* Add custom styles if needed */
</style>
