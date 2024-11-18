<script>
    import {Receipt} from 'lucide-svelte';

    let expenseSearch = $state('');
    let filteredExpenses = $derived(
      () => groupExpenses?.group_expense?.filter(
        (expense) =>
          expense.description.toLowerCase().includes(expenseSearch.toLowerCase()) ||
          expense.category.toLowerCase().includes(expenseSearch.toLowerCase())
      ) ?? []
    );
    
    let {groupExpenses, formatDate} = $props();
</script>

<div class="mt-12">
    <div class="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <!-- Header and Stats -->
        <div class="space-y-6">
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 class="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
                    <Receipt class="h-6 w-6" />
                    Group Expenses
                </h2>
                <!-- Stats Cards -->
                <div class="flex flex-wrap gap-4">
                    <div class="min-w-[200px] flex-1 rounded-lg bg-purple-50 p-4 dark:bg-purple-900/50">
                        <p class="text-sm text-purple-600 dark:text-purple-300">Total Expenses</p>
                        <p class="text-2xl font-bold text-purple-700 dark:text-purple-200">
                            ${parseFloat(groupExpenses?.total_group_expenses ?? 0).toFixed(2)}
                        </p>
                    </div>
                    <div class="min-w-[200px] flex-1 rounded-lg bg-green-50 p-4 dark:bg-green-900/50">
                        <p class="text-sm text-green-600 dark:text-green-300">Latest Expense</p>
                        <p class="text-2xl font-bold text-green-700 dark:text-green-200">
                            ${parseFloat(groupExpenses?.latest_expense_amount ?? 0).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Search Input -->
            <div class="relative">
                <input
                    type="text"
                    bind:value={expenseSearch}
                    placeholder="Search expenses..."
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-purple-400"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                        class="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Table -->
        <div class="mt-6 overflow-x-auto">
            <div class="inline-block min-w-full align-middle">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                                >Description</th
                            >
                            <th
                                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                                >Amount</th
                            >
                            <th
                                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                                >Category</th
                            >
                            <th
                                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                                >Member ID</th
                            >
                            <th
                                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                                >Date</th
                            >
                        </tr>
                    </thead>
                    <tbody
                        class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
                    >
                        {#each filteredExpenses() as expense}
                            <tr
                                class="transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white"
                                    >{expense.description}</td
                                >
                                <td
                                    class="whitespace-nowrap px-6 py-4 text-sm font-medium text-green-600 dark:text-green-400"
                                    >${parseFloat(expense.amount).toFixed(2)}</td
                                >
                                <td
                                    class="whitespace-nowrap px-6 py-4 text-sm capitalize text-gray-900 dark:text-white"
                                    >{expense.category}</td
                                >
                                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white"
                                    >{expense.member_id}</td
                                >
                                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white"
                                    >{formatDate(expense.created_at)}</td
                                >
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>