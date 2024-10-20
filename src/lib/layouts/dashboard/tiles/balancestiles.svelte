<script>
    import { ArrowDown, ArrowUp, Minus, MoreHorizontal } from 'lucide-svelte';
  
    let { getArrowClass, formatNumber, balance, budgetPercentageChange } = $props();
  
    // Statement parts for balance changes
    let balanceChangeStatement = budgetPercentageChange > 0
      ? `You saved `
      : budgetPercentageChange < 0
      ? `You spent `
      : `Your balance remains the same: `;
  </script>
  
  <!-- My Balance Tile with Enhanced Design and Dynamic Badge for Amount -->
  <div class="rounded-xl p-6 shadow-md bg-white dark:bg-gray-800 transition-transform transform hover:scale-105 hover:shadow-lg">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">My Balance</h2>
      <MoreHorizontal
        size={20}
        class="text-gray-500 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
      />
    </div>
  
    <!-- Balance Value and Percentage Change -->
    <div class="flex items-baseline space-x-2">
      <!-- Balance value with bold and larger font size -->
      <h3 class="text-3xl font-extrabold text-gray-900 dark:text-white">
        ${formatNumber(balance)}
      </h3>
  
      <!-- Percentage change with dynamic icon and color -->
      <span
        class={getArrowClass(budgetPercentageChange) + ' flex items-center transition-colors duration-300'}
      >
        {#if budgetPercentageChange > 0}
          <ArrowUp size={18} class="text-green-500" /> <!-- Green arrow for increasing balance -->
          <span class="ml-1 rounded-lg bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
            {Math.abs(budgetPercentageChange).toFixed(2)}%
          </span>
        {:else if budgetPercentageChange < 0}
          <ArrowDown size={18} class="text-red-500" /> <!-- Red arrow for decreasing balance -->
          <span class="ml-1 rounded-lg bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
            {Math.abs(budgetPercentageChange).toFixed(2)}%
          </span>
        {:else}
          <Minus size={18} class="text-yellow-500" /> <!-- Yellow dash for no change -->
          <span class="ml-1 rounded-lg bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-600">
            {Math.abs(budgetPercentageChange).toFixed(2)}%
          </span>
        {/if}
      </span>
    </div>
  
    <!-- Statement with dynamic coloring for amount -->
    <p class="text-sm mt-3 text-gray-500 dark:text-gray-400 font-light">
      {balanceChangeStatement}
      <span
        class={budgetPercentageChange > 0
          ? 'text-green-500'
          : budgetPercentageChange < 0
          ? 'text-red-500'
          : 'text-yellow-500'}
      >
        ${formatNumber(Math.abs(balance))}
      </span>
      this month.
    </p>
  </div>
  