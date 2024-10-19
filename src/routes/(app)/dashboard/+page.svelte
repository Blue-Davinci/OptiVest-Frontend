<script>
  import { getGoalProgressions } from '$lib/dataservice/dashboard/goalsDataService';
  import { onMount } from 'svelte';
  import { Search, Bell, ArrowDown, ArrowUp, MoreHorizontal, CreditCard  } from 'lucide-svelte';

  let stats = [
    { title: 'Total Users', value: 1200, icon: '👥' },
    { title: 'Revenue', value: '$45,000', icon: '💰' },
    { title: 'New Orders', value: 342, icon: '📦' },
    { title: 'Support Tickets', value: 18, icon: '🎫' }
  ];
  let transactions = [
    { name: 'Groceries', date: '01/10/2024', amount: -150, category: 'Food', account: 'Debit Card', status: 'Completed' },
    { name: 'Salary', date: '02/10/2024', amount: 4000, category: 'Income', account: 'Bank Transfer', status: 'Completed' }
  ];

  let { data } = $props();
  let goalsData = $state(data.data.goals);
  $inspect(data);

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
</script>

<div class="min-h-screen p-8 bg-gray-100 dark:bg-gray-900">
  <div class="max-w-7xl mx-auto">
    <header class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Hi, John! Welcome back.</h1>
        <p class="text-gray-600 dark:text-gray-300">Manage your cards and review recent transactions.</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <input type="text" placeholder="Search or type a command" class="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100" />
        </div>
        <button class="p-2 rounded-full shadow-md bg-gray-100 dark:bg-gray-800">
          <Bell size={20} class="text-gray-500 dark:text-gray-300" />
        </button>
      </div>
    </header>

    <div class="grid grid-cols-3 gap-6 mb-8">
      <!-- Income Tile -->
      <div class="rounded-xl p-6 shadow-md bg-white dark:bg-gray-800">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Income</h2>
          <MoreHorizontal size={20} class="text-gray-500 dark:text-gray-300" />
        </div>
        <div class="flex items-baseline space-x-2">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">$400,000</h3>
          <span class="text-green-500 flex items-center">
            <ArrowUp size={16} />
            10%
          </span>
        </div>
        <p class="text-sm mt-2 text-gray-600 dark:text-gray-300">You made an extra $12,345 this month</p>
      </div>

      <!-- Expense Tile -->
      <div class="rounded-xl p-6 shadow-md bg-white dark:bg-gray-800">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Expense</h2>
          <MoreHorizontal size={20} class="text-gray-500 dark:text-gray-300" />
        </div>
        <div class="flex items-baseline space-x-2">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">$30,000</h3>
          <span class="text-red-500 flex items-center">
            <ArrowDown size={16} />
            10%
          </span>
        </div>
        <p class="text-sm mt-2 text-gray-600 dark:text-gray-300">You overspent by $100 this month</p>
      </div>

      <!-- My Balance Tile -->
      <div class="rounded-xl p-6 shadow-md bg-white dark:bg-gray-800">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">My Balance</h2>
          <MoreHorizontal size={20} class="text-gray-500 dark:text-gray-300" />
        </div>
        <div class="flex items-baseline space-x-2">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">$100</h3>
          <span class="text-green-500 flex items-center">
            <ArrowUp size={16} />
            30%
          </span>
        </div>
        <p class="text-sm mt-2 text-gray-600 dark:text-gray-300">You made an extra $50 this month</p>
      </div>
    </div>

    <!-- Placeholder for Chart -->
    <div class="grid grid-cols-3 gap-6">
      <div class="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex justify-center items-center">
        <div class="text-gray-500 dark:text-gray-300">
          <p class="text-lg font-semibold mb-4">Performance Chart Placeholder</p>
          <!-- This section will host the chart in the future. -->
        </div>
      </div>

      <!-- Savings Goals -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Savings Goals</h2>
        {#each goalsData as goal}
          <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
              <span class="font-medium text-gray-700 dark:text-gray-300">{goal.goals.name}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">{goal.progress_percentage}%</span>
            </div>
            <!-- Progress Bar with color coding -->
            <div class="w-full bg-gray-200 rounded-full h-2 mb-2 dark:bg-gray-700">
              <div class="{getProgressColor(goal.progress_percentage)} h-2 rounded-full" style="width: {goal.progress_percentage}%"></div>
            </div>
            <!-- Goal Details -->
            <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Current: ${goal.goals.current_amount}</span>
              <span class="badge bg-gray-100 text-gray-500 px-2 py-1 rounded-md">Target: ${goal.goals.target_amount}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Transactions Table -->
    <!-- Transactions Table -->
    <div class="bg-white rounded-xl p-6 shadow-md">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search transactions" class="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <button class="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
            Filter
          </button>
        </div>
      </div>
      <table class="w-full">
        <thead>
          <tr class="text-left text-sm text-gray-500">
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
            <tr class="border-t border-gray-100">
              <td class="py-4">
                <div class="flex items-center space-x-3">
                  <div class="bg-pink-500 rounded-full p-2">
                    <CreditCard size={16} color="white" />
                  </div>
                  <span class="font-medium">{transaction.name}</span>
                </div>
              </td>
              <td class="py-4 text-sm text-gray-500">{transaction.date}</td>
              <td class="py-4 font-medium">${Math.abs(transaction.amount).toFixed(2)}</td>
              <td class="py-4">
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{transaction.category}</span>
              </td>
              <td class="py-4 text-sm">{transaction.account}</td>
              <td class="py-4">
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">{transaction.status}</span>
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
