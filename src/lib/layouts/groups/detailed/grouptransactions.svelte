<script>
    import {CreditCard} from 'lucide-svelte';
    let transactionSearch = $state('');
    let filteredTransactions = $derived(
      () => groupTransactions?.group_transaction?.filter((transaction) =>
        transaction.group_transaction.description
          .toLowerCase()
          .includes(transactionSearch.toLowerCase())
      ) ?? []
    );
    let {groupTransactions, formatDate} = $props();
</script>

<div class="mt-12">
    <div class="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <!-- Header and Stats -->
        <div class="space-y-6">
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 class="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
                    <CreditCard class="h-6 w-6" />
                    Group Transactions
                </h2>
                <!-- Stats Cards -->
                <div class="flex flex-wrap gap-4">
                    <div class="min-w-[200px] flex-1 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/50">
                        <p class="text-sm text-blue-600 dark:text-blue-300">Total Transactions</p>
                        <p class="text-2xl font-bold text-blue-700 dark:text-blue-200">
                            ${parseFloat(groupTransactions?.total_transaction_amount ?? 0).toFixed(2)}
                        </p>
                    </div>
                    <div class="min-w-[200px] flex-1 rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/50">
                        <p class="text-sm text-indigo-600 dark:text-indigo-300">Latest Transaction</p>
                        <p class="text-2xl font-bold text-indigo-700 dark:text-indigo-200">
                            ${parseFloat(groupTransactions?.latest_transaction_amount ?? 0).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Search Input -->
            <div class="relative">
                <input
                    type="text"
                    bind:value={transactionSearch}
                    placeholder="Search transactions..."
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400"
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
                                >Member ID</th
                            >
                            <th
                                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                                >Goal</th
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
                        {#each filteredTransactions() as transaction}
                            <tr
                                class="transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                                    {transaction.group_transaction.description}
                                </td>
                                <td
                                    class="whitespace-nowrap px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400"
                                >
                                    ${parseFloat(transaction.group_transaction.amount).toFixed(2)}
                                </td>
                                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                                    {transaction.group_transaction.member_id}
                                </td>
                                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                                    {transaction.goal_name}
                                </td>
                                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                                    {formatDate(transaction.group_transaction.created_at)}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>