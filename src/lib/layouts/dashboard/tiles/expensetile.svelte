<script>
    import { ArrowDown, ArrowUp, MoreHorizontal, Minus } from 'lucide-svelte';
  
    let { getArrowClass, formatNumber, expenses, expensePercentageChange } = $props();
  
    // Constructing the dynamic expense statement
    let beforeAmount = expensePercentageChange > 0
      ? "Your expenses have increased by "
      : expensePercentageChange < 0
      ? "Your expenses have decreased by "
      : "Your expenses remain the same at ";
    
    let afterAmount = " compared to last month.";
    let amount = `$${formatNumber(Math.abs(expenses))}`;
  </script>
  
  <!-- Improved Expenses Tile with Badge for Amount -->
  <div class="rounded-xl p-6 shadow-md bg-white dark:bg-gray-800 transition-transform transform hover:scale-105 hover:shadow-lg">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Expenses</h2>
      <MoreHorizontal
        size={20}
        class="text-gray-500 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
      />
    </div>
  
    <!-- Expenses Value and Percentage Change -->
    <div class="flex items-baseline space-x-2">
      <!-- Expenses value with larger font size -->
      <h3 class="text-3xl font-extrabold text-gray-900 dark:text-white">${formatNumber(expenses)}</h3>
  
      <!-- Percentage change with dynamic icon and transition effect -->
      <span class={getArrowClass(expensePercentageChange) + ' flex items-center transition-colors duration-300'}>
        {#if expensePercentageChange > 0}
          <ArrowUp size={18} class="text-red-500" /> <!-- Red arrow for increasing expenses -->
          <span class="ml-1 rounded-lg bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
            {Math.abs(expensePercentageChange).toFixed(2)}%
          </span>
          <!-- Red badge for negative change -->
        {:else if expensePercentageChange < 0}
          <ArrowDown size={18} class="text-green-500" /> <!-- Green arrow for decreasing expenses -->
          <span class="ml-1 rounded-lg bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
            {Math.abs(expensePercentageChange).toFixed(2)}%
          </span>
          <!-- Green badge for positive change -->
        {:else}
          <Minus size={18} class="text-yellow-500" /> <!-- Yellow dash for no change -->
          <span class="ml-1 rounded-lg bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-600">
            {Math.abs(expensePercentageChange).toFixed(2)}%
          </span>
          <!-- Yellow badge for no change -->
        {/if}
      </span>
    </div>
  
    <!-- Statement with dynamically colored amount -->
    <p class="text-sm mt-3 text-gray-500 dark:text-gray-400 font-light">
      {beforeAmount}
      {#if expensePercentageChange > 0}
        <span class="text-red-500">{amount}</span> <!-- Red color for increased expenses -->
      {:else if expensePercentageChange < 0}
        <span class="text-green-500">{amount}</span> <!-- Green color for decreased expenses -->
      {:else}
        <span class="text-yellow-500">{amount}</span> <!-- Yellow color for no change -->
      {/if}
      {afterAmount}
    </p>
  </div>
  