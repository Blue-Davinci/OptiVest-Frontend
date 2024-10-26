<script>
	import {
		Search,
		DollarSign,
		Calendar,
		AlertCircle,
		TrendingUp
	} from 'lucide-svelte';

let { filteredRecurringExpenses, recurringSearchQuery, formatAmount, formatDate } = $$props;

</script>


<section class="mb-12">
    <div
        class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
        <div class="mb-8 flex items-center justify-between">
            <div>
                <h2 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">
                    Recurring Expenses
                </h2>
                <p class="text-gray-600 dark:text-gray-300">
                    Track your regular monthly and daily expenses
                </p>
            </div>
            <div class="relative">
                <input
                    type="text"
                    bind:value={recurringSearchQuery}
                    placeholder="Search recurring expenses..."
                    class="w-72 rounded-lg border border-gray-200 bg-white py-2.5 pl-10
               pr-4 text-gray-900 placeholder-gray-400 outline-none
               focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700
               dark:text-gray-100 dark:placeholder-gray-500"
                />
                <Search class="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#each filteredRecurringExpenses as recurring}
                <div
                    class="group relative overflow-hidden rounded-xl border border-purple-100
                  bg-white p-6 shadow-sm transition-all duration-300
                  hover:border-purple-300 hover:shadow-lg dark:border-purple-900
                  dark:bg-gray-800 dark:hover:border-purple-700"
                >
                    <div class="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent"></div>
                    <div class="relative">
                        <div class="mb-4 flex items-start justify-between">
                            <div>
                                <h3
                                    class="text-lg font-medium text-gray-900 transition-colors group-hover:text-purple-600
                         dark:text-white dark:group-hover:text-purple-400"
                                >
                                    {recurring.recurring_expense.name}
                                </h3>
                                <p class="text-sm text-gray-500 dark:text-gray-400">{recurring.budget_name}</p>
                            </div>
                            <span
                                class="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs
                       font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                            >
                                {recurring.recurring_expense.recurrence_interval}
                            </span>
                        </div>

                        <div class="space-y-4">
                            <div class="flex items-center text-gray-700 dark:text-gray-300">
                                <DollarSign class="mr-2 h-5 w-5 text-purple-500" />
                                <span class="font-medium"
                                    >{formatAmount(recurring.recurring_expense.amount)} per {recurring
                                        .recurring_expense.recurrence_interval}</span
                                >
                            </div>

                            <div class="flex items-center text-gray-700 dark:text-gray-300">
                                <Calendar class="mr-2 h-5 w-5 text-purple-500" />
                                <span>Next: {formatDate(recurring.recurring_expense.next_occurrence)}</span>
                            </div>

                            <div class="flex items-center text-gray-700 dark:text-gray-300">
                                <TrendingUp class="mr-2 h-5 w-5 text-purple-500" />
                                <span>Total spent: {formatAmount(recurring.overall_total_amount)}</span>
                            </div>

                            {#if recurring.recurring_expense.description}
                                <div class="flex items-start text-gray-600 dark:text-gray-400">
                                    <AlertCircle class="mr-2 mt-0.5 h-5 w-5 text-purple-500" />
                                    <p class="text-sm">{recurring.recurring_expense.description}</p>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>