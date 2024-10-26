<script>
	import {
		DollarSign,
		Calendar,
		RefreshCcw,
		AlertCircle,
		TrendingUp,
		ChartPie as PieChartIcon,
    ClipboardList,
    ChartPie,
    ChartLine as LineChartIcon,
    Clock
	} from 'lucide-svelte';

</script>

<section class="mb-12">
    <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="grid gap-8">
            <!-- Header Section -->
            <div class="text-center">
                <div class="mb-6 flex justify-center space-x-4">
                    <ClipboardList class="h-12 w-12 text-purple-200 dark:text-purple-900" />
                    <RefreshCcw class="h-12 w-12 text-purple-300 dark:text-purple-800" />
                    <Clock class="h-12 w-12 text-purple-400 dark:text-purple-700" />
                </div>
                <h3 class="mb-3 text-xl font-semibold text-gray-800 dark:text-white">
                    Start Managing Recurring Expenses
                </h3>
                <p class="mx-auto mb-6 max-w-md text-gray-600 dark:text-gray-400">
                    Track your subscriptions, bills, and regular payments to optimize your monthly budget and identify savings opportunities.
                </p>
            </div>

            <!-- Placeholder Cards Grid -->
            <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                {#each [
                    { type: 'calendar', title: 'Monthly Overview', description: 'Track your monthly recurring expenses and payment schedules' },
                    { type: 'trending', title: 'Spending Insights', description: 'Analyze patterns and identify opportunities for optimization' },
                    { type: 'alert', title: 'Smart Reminders', description: 'Never miss a payment with automated notifications' }
                ] as { type, title, description }}
                    <div class="rounded-lg bg-purple-50 p-6 dark:bg-purple-900/20">
                        {#if type === 'calendar'}
                            <Calendar class="mb-4 h-8 w-8 text-purple-500" />
                        {:else if type === 'trending'}
                            <TrendingUp class="mb-4 h-8 w-8 text-purple-500" />
                        {:else if type === 'alert'}
                            <AlertCircle class="mb-4 h-8 w-8 text-purple-500" />
                        {/if}
                        <h4 class="mb-2 text-lg font-medium text-gray-800 dark:text-white">{title}</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {description}
                        </p>
                    </div>
                {/each}
            </div>

            <!-- Placeholder Charts Grid -->
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <!-- Distribution Chart Placeholder -->
                <div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-700/50">
                    <div class="mb-6">
                        <h3 class="flex items-center text-lg font-medium text-gray-800 dark:text-white">
                            <PieChartIcon class="mr-2 h-5 w-5 text-purple-500" />
                            Expense Distribution
                        </h3>
                        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            View your recurring expenses by category
                        </p>
                    </div>
                    <div class="flex h-[300px] items-center justify-center">
                        <div class="h-64 w-64 flex flex-col items-center justify-center rounded-full border-2 border-dashed border-primary/30">
                            <ChartPie class="h-12 w-12 text-primary/50 mb-2" />
                            <p class="text-sm text-muted-foreground text-center px-4">
                                Add expenses to visualize your spending distribution
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Timeline Chart Placeholder -->
                <div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-700/50">
                    <div class="mb-6">
                        <h3 class="flex items-center text-lg font-medium text-gray-800 dark:text-white">
                            <LineChartIcon class="mr-2 h-5 w-5 text-purple-500" />
                            Payment Timeline
                        </h3>
                        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Track upcoming payment schedules
                        </p>
                    </div>
                    <div class="flex h-[300px] items-center justify-center">
                        <div class="h-64 w-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/30">
                            <Calendar class="h-12 w-12 text-primary/50 mb-2" />
                            <p class="text-sm text-muted-foreground text-center px-4">
                                Add recurring expenses to view your payment timeline
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Stats Placeholder -->
            <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
                {#each [
                    { type: 'dollar', label: 'Monthly Total' },
                    { type: 'refresh', label: 'Active Subscriptions' },
                    { type: 'clock', label: 'Next Payment' },
                    { type: 'pie', label: 'Categories' }
                ] as { type, label }}
                    <div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                        <div class="flex items-center space-x-2">
                            {#if type === 'dollar'}
                                <DollarSign class="h-5 w-5 text-purple-500" />
                            {:else if type === 'refresh'}
                                <RefreshCcw class="h-5 w-5 text-purple-500" />
                            {:else if type === 'clock'}
                                <Clock class="h-5 w-5 text-purple-500" />
                            {:else if type === 'pie'}
                                <PieChartIcon class="h-5 w-5 text-purple-500" />
                            {/if}
                            <h4 class="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {label}
                            </h4>
                        </div>
                        <div class="mt-3 h-6 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</section>