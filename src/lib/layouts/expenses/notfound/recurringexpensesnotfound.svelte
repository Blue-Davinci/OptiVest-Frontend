<script>
	import {
		RefreshCcw,
		ChartPieIcon as PieChartIcon,
    ChartPie,
	} from 'lucide-svelte';

</script>

    <section class="mb-12">
    <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <!-- Recurring Expenses Placeholder -->
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <!-- Left Column: Chart Placeholder -->
            <div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-700/50">
                <div class="mb-6">
                    <h3 class="flex items-center text-lg font-medium text-gray-800 dark:text-white">
                        <PieChartIcon class="mr-2 h-5 w-5 text-purple-500" />
                        Expenses Overview
                    </h3>
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Track your recurring expenses distribution
                    </p>
                </div>
                <div class="flex h-[300px] items-center justify-center">
                    <div class="h-64 w-64 flex flex-col items-center justify-center rounded-full border-2 border-dashed border-primary/30">
                        <ChartPie class="h-12 w-12 text-primary/50 mb-2" />
                        <p class="text-sm text-muted-foreground text-center px-4">
                            Add recurring expenses to view spending patterns
                        </p>
                    </div>
                </div>
            </div>

            <!-- Right Column: Stats Placeholder -->
            <div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-700/50">
                <div class="mb-6">
                    <h3 class="flex items-center text-lg font-medium text-gray-800 dark:text-white">
                        <RefreshCcw class="mr-2 h-5 w-5 text-purple-500" />
                        Monthly Summary
                    </h3>
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Your recurring financial commitments
                    </p>
                </div>
                <div class="space-y-6">
                    <!-- Placeholder Stats Grid -->
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                            <h4 class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                Monthly Total
                            </h4>
                            <div class="h-8 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                        <div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                            <h4 class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                Active Subscriptions
                            </h4>
                            <div class="h-8 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                    </div>

                    <!-- Placeholder Upcoming Renewals -->
                    <div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                        <h4 class="mb-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                            Upcoming Renewals
                        </h4>
                        <div class="space-y-3">
                            {#each Array(3) as _}
                                <div class="flex items-center justify-between">
                                    <div class="space-y-2">
                                        <div class="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
                                        <div class="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
                                    </div>
                                    <div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>