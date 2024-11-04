<script>
    import { Search, Filter } from 'lucide-svelte';
    
    let searchQuery = $state('');
    let selectedDateRange = $state('all');
    let selectedType = $state('all');

    const dateRanges = [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' }
    ];

    const notificationTypes = [
        { value: 'all', label: 'All Types' },
        { value: 'default', label: 'Default' },
        { value: 'alert', label: 'Alerts' },
        { value: 'info', label: 'Information' }
    ];

    function handleFilter() {
        // Placeholder function for backend request
        console.log('Filtering with:', { searchQuery, selectedDateRange, selectedType });
        // Here you would typically dispatch an event or call a parent function
        // to handle the actual filtering
    }
</script>

<div class="mb-6 space-y-4 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800/90">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        <!-- Search Bar -->
        <div class="relative flex-1">
            <div class="relative">
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search notifications..."
                    class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />
                <Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
        </div>

        <!-- Quick Filters -->
        <div class="flex flex-wrap gap-3">
            <select
                bind:value={selectedDateRange}
                class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
                {#each dateRanges as range}
                    <option value={range.value}>{range.label}</option>
                {/each}
            </select>

            <select
                bind:value={selectedType}
                class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
                {#each notificationTypes as type}
                    <option value={type.value}>{type.label}</option>
                {/each}
            </select>

            <button
                onclick={handleFilter}
                class="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-6 py-3 font-medium text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:bg-purple-600 hover:shadow-purple-500/35 dark:bg-purple-600 dark:shadow-purple-600/25 dark:hover:bg-purple-700"
            >
                <Filter class="h-5 w-5" />
                Apply Filters
            </button>
        </div>
    </div>
</div>