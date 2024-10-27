<script>
import {
		ChartPie as PieChartIcon,
		ChartBar,
	} from 'lucide-svelte';

</script>

<div
class="rounded-lg border border-purple-100 bg-white p-6 transition-all duration-300 hover:border-purple-200 hover:shadow-md dark:border-purple-900 dark:bg-gray-800 dark:hover:border-purple-700"
>
<div class="mb-6">
    <h3 class="flex items-center text-lg font-medium text-gray-800 dark:text-white">
        <PieChartIcon class="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
        Income Distribution
    </h3>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">View income by source</p>
</div>
<div class="flex h-[400px] items-center justify-center">
    <div
        class="flex h-64 w-64 flex-col items-center justify-center rounded-full border-2 border-dashed border-purple-300 dark:border-purple-700"
    >
        <ChartBar class="mb-2 h-12 w-12 text-purple-400 dark:text-purple-600" />
        <p class="px-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Add income from different sources to see distribution
        </p>
    </div>
</div>
</div>