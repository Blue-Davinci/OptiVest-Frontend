<script>
	import {
		Settings,
		User,
		TrendingUp,
	} from 'lucide-svelte';

    let {accountStats} = $props();
</script>


<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
    <!-- Financial Overview Stats -->
    <div class="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800 lg:col-span-2">
        <h2 class="mb-6 text-xl font-bold text-gray-900 dark:text-white">Financial Overview</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="rounded-xl bg-purple-50 p-6 dark:bg-purple-900/20">
                <h3 class="mb-4 text-lg font-semibold text-purple-900 dark:text-purple-100">
                    Income Sources
                </h3>
                <div class="space-y-4">
                    <div>
                        <div class="mb-1 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Total Sources</span>
                            <span>{accountStats.TotalIncomeSources}</span>
                        </div>
                        <div
                            class="flex justify-between text-lg font-semibold text-purple-900 dark:text-purple-100"
                        >
                            <span>Total Amount</span>
                            <span>${accountStats.TotalIncomeAmount}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rounded-xl bg-pink-50 p-6 dark:bg-pink-900/20">
                <h3 class="mb-4 text-lg font-semibold text-pink-900 dark:text-pink-100">Expenses</h3>
                <div class="space-y-4">
                    <div>
                        <div class="mb-1 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Total Expenses</span>
                            <span>{accountStats.TotalExpenses}</span>
                        </div>
                        <div
                            class="flex justify-between text-lg font-semibold text-pink-900 dark:text-pink-100"
                        >
                            <span>Total Amount</span>
                            <span>${accountStats.TotalExpenseAmount}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rounded-xl bg-emerald-50 p-6 dark:bg-emerald-900/20">
                <h3 class="mb-4 text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                    Budgets
                </h3>
                <div class="space-y-4">
                    <div>
                        <div class="mb-1 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Active Budgets</span>
                            <span>{accountStats.TotalBudgets}</span>
                        </div>
                        <div
                            class="flex justify-between text-lg font-semibold text-emerald-900 dark:text-emerald-100"
                        >
                            <span>Average Amount</span>
                            <span>${Number(accountStats.AvgBudgetAmount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rounded-xl bg-blue-50 p-6 dark:bg-blue-900/20">
                <h3 class="mb-4 text-lg font-semibold text-blue-900 dark:text-blue-100">Goals</h3>
                <div class="space-y-4">
                    <div>
                        <div class="mb-1 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Active Goals</span>
                            <span>{accountStats.TotalGoals}</span>
                        </div>
                        <div
                            class="flex justify-between text-lg font-semibold text-blue-900 dark:text-blue-100"
                        >
                            <span>Average Progress</span>
                            <span>{Number(accountStats.AvgGoalProgress).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Profile Completion -->
    <div class="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Profile Completion</h2>
        <div class="mb-4">
            <div class="mb-2 flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Overall Progress</span>
                <span class="font-medium dark:text-white">{accountStats.ProfileCompletion}%</span>
            </div>
            <div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                    class="h-2 rounded-full bg-purple-500"
                    style="width: {accountStats.ProfileCompletion}%"
                ></div>
            </div>
        </div>
        <ul class="space-y-3">
            <li class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <User size={16} />
                <span>Basic Info</span>
                <span class="ml-auto">✓</span>
            </li>
            <li class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Settings size={16} />
                <span>Preferences</span>
                <span class="ml-auto">✓</span>
            </li>
            <li class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <TrendingUp size={16} />
                <span>Investment Profile</span>
                <span class="ml-auto">...</span>
            </li>
        </ul>
    </div>
</div>