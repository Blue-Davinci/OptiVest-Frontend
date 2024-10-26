<script>
    import { MoreHorizontal } from 'lucide-svelte';

    let {mostFrequentCurrency} = $props();
</script>

<div class="relative w-full overflow-hidden rounded-lg bg-gradient-to-br from-white to-purple-50 p-4 shadow-lg transition-all duration-300 hover:shadow-purple-100 dark:from-gray-800 dark:to-gray-750 dark:hover:shadow-purple-900/20">
    <div class="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent"></div>
    <div class="relative">
        <div class="mb-2 flex items-center justify-between">
            <h2 class="text-base font-semibold text-gray-900 dark:text-white">Most Frequent Currency</h2>
            <MoreHorizontal
                size={18}
                class="cursor-pointer text-purple-400 transition-colors duration-200 hover:text-purple-600 dark:text-purple-300 dark:hover:text-purple-200"
            />
        </div>
        <div class="flex items-baseline space-x-2">
            <h3 class="truncate text-2xl font-bold text-purple-600 dark:text-purple-300 lg:text-3xl">
                {mostFrequentCurrency}
            </h3>
        </div>
        <p class="mt-1.5 text-xs font-medium text-purple-500/80 dark:text-purple-300/80">
            Currency Code used across budgets
        </p>
        <div class="mt-3 h-0.5 w-full rounded-full bg-purple-100 dark:bg-purple-900/30">
            <div class="h-0.5 w-1/2 rounded-full bg-purple-500/50"></div>
        </div>
    </div>
</div>