<script>
    import TrackingHistorynNotFound from './notfound/trackinghistorynotfound.svelte';
	import {
		Search,
		Target,
		Calendar,
		DollarSign,
		Clock,
		ArrowUpCircle,
		ArrowDownCircle
	} from 'lucide-svelte';
    
    let {historySearchQuery, filteredHistory, formatCurrency} = $props();
</script>


<section class="rounded-xl border bg-card p-6 shadow-md">
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-2">
            <Clock class="h-6 w-6 text-primary" />
            <h2 class="text-xl font-semibold">Tracking History</h2>
        </div>
        <div class="relative w-full max-w-md sm:w-auto">
            <Search
                class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground"
            />
            <input
                type="text"
                placeholder="Search history..."
                bind:value={historySearchQuery}
                class="w-full rounded-lg border bg-background py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
        </div>
    </div>

    {#if filteredHistory.length > 0}
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b bg-muted/30">
                        <th class="px-6 py-4 text-left font-semibold">Goal Name</th>
                        <th class="px-6 py-4 text-left font-semibold">Contribution</th>
                        <th class="px-6 py-4 text-left font-semibold">Date</th>
                        <th class="px-6 py-4 text-left font-semibold">Type</th>
                    </tr>
                </thead>
                <tbody>
                    {#each filteredHistory as history}
                        <tr class="border-b transition-colors hover:bg-muted/30">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <Target class="h-4 w-4 text-primary" />
                                    {history.goal_name}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <DollarSign class="h-4 w-4 text-muted-foreground" />
                                    {formatCurrency(history.tracked_goal.contributed_amount)}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <Calendar class="h-4 w-4 text-muted-foreground" />
                                    {new Date(history.tracked_goal.tracking_date).toLocaleDateString()}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    {#if history.tracked_goal.tracking_type === 'deposit'}
                                        <ArrowUpCircle class="h-4 w-4 text-green-500" />
                                    {:else}
                                        <ArrowDownCircle class="h-4 w-4 text-red-500" />
                                    {/if}
                                    <span class="capitalize">{history.tracked_goal.tracking_type}</span>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {:else}
        <TrackingHistorynNotFound {historySearchQuery} />
    {/if}
</section>