<script>
    import { MoreHorizontal } from 'lucide-svelte';

    let {mostFrequentCurrency} = $props();
</script>

<div class="relative w-full overflow-hidden rounded-lg bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-lg dark:bg-gray-800">
    <div class="relative">
        <div class="mb-2 flex items-center justify-between">
            <h2 class="text-base font-semibold text-gray-900 dark:text-white">Most Frequent Currency</h2>
            <MoreHorizontal
                size={18}
                class="cursor-pointer text-gray-400 transition-colors duration-200 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
            />
        </div>
        <div class="flex items-baseline space-x-2">
            <h3 class="truncate text-2xl font-bold text-purple-600 dark:text-purple-400 lg:text-3xl">
                {mostFrequentCurrency}
            </h3>
        </div>
        <p class="mt-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
            Currency Code used across budgets
        </p>
        <div class="mt-3 h-0.5 w-full rounded-full bg-gray-100 dark:bg-gray-700">
            <div class="h-0.5 w-1/2 rounded-full bg-purple-500"></div>
        </div>
    </div>
</div>