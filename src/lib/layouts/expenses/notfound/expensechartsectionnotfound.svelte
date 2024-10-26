<script>
	import {
		ChartPie as PieChartIcon,
    Receipt,
    ChartLine as LineChartIcon,
	} from 'lucide-svelte';


</script>

<section class="mb-12">
    <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="grid gap-8 lg:grid-cols-2">
            <!-- Line Chart Placeholder -->
            <div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-700/50">
                <div class="mb-6">
                    <h3 class="flex items-center text-lg font-medium text-gray-800 dark:text-white">
                        <LineChartIcon class="mr-2 h-5 w-5 text-purple-500" />
                        Monthly Trends
                    </h3>
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Track your spending patterns
                    </p>
                </div>
                <div class="flex h-[300px] items-center justify-center">
                    <div class="h-64 w-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/30">
                        <LineChartIcon class="h-12 w-12 text-primary/50 mb-2" />
                        <p class="text-sm text-muted-foreground text-center px-4">
                            Add expenses to view spending trends
                        </p>
                    </div>
                </div>
            </div>

            <!-- Category Distribution Placeholder -->
            <div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-700/50">
                <div class="mb-6">
                    <h3 class="flex items-center text-lg font-medium text-gray-800 dark:text-white">
                        <PieChartIcon class="mr-2 h-5 w-5 text-purple-500" />
                        Category Distribution
                    </h3>
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        View spending by category
                    </p>
                </div>
                <div class="flex h-[300px] items-center justify-center">
                    <div class="h-64 w-64 flex flex-col items-center justify-center rounded-full border-2 border-dashed border-primary/30">
                        <Receipt class="h-12 w-12 text-primary/50 mb-2" />
                        <p class="text-sm text-muted-foreground text-center px-4">
                            Categorize expenses to see distribution
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Stats Placeholder -->
        <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {#each ['Total Expenses', 'Monthly Average', 'Categories'] as stat}
                <div class="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                    <h4 class="mb-2 text-sm font-medium text-purple-600 dark:text-purple-300">
                        {stat}
                    </h4>
                    <div class="h-8 w-32 rounded bg-purple-200/50 dark:bg-purple-800/50"></div>
                </div>
            {/each}
        </div>
    </div>
</section>