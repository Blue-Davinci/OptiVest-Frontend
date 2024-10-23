<script>
    import { MoreHorizontal } from 'lucide-svelte';

    let {mostGoalsBudget} = $props();

</script>

<div
class="w-full max-w-xs transform rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105 hover:shadow-lg dark:bg-gray-800"
>
<div class="mb-4 flex items-center justify-between">
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Most Goals Set</h2>
    <MoreHorizontal
        size={20}
        class="cursor-pointer text-gray-500 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
    />
</div>
<div class="flex items-baseline space-x-2">
    <h3
        class="truncate text-3xl font-extrabold text-gray-900 dark:text-white sm:text-2xl md:text-3xl lg:text-4xl"
    >
        {mostGoalsBudget.goal_summary.length} Goals
    </h3>
</div>
<p class="mt-3 text-sm font-light text-gray-600 dark:text-gray-300">
    {mostGoalsBudget.budget.name}
</p>
</div>