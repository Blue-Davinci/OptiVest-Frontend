<script>
    import GoalChartNotFound from './notfound/goalchartnotfound.svelte';
	import { LineChart } from 'layerchart';
	import {
		TrendingUp,
		ChartLine as ChartIcon
	} from 'lucide-svelte';
    import { fly, slide } from 'svelte/transition';

    let {goalTrackingHistory} = $props();

    function prepareChartData(historyData) {
		if (!historyData?.data?.goal_tracking_history?.length) {
			return [];
		}

		const groupedByDate = historyData.data.goal_tracking_history.reduce((acc, item) => {
			const date = new Date(item.tracked_goal.truncated_tracking_date).toISOString().split('T')[0];
			acc[date] = (acc[date] || 0) + Number(item.tracked_goal.contributed_amount);
			return acc;
		}, {});

		return Object.entries(groupedByDate)
			.map(([date, value]) => ({
				date: new Date(date),
				value: value
			}))
			.sort((a, b) => a.date - b.date);
	}
    let chartData = $derived(prepareChartData(goalTrackingHistory));
</script>

<section class="mb-12 rounded-xl border bg-card p-6 shadow-md">
    <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-2">
            <TrendingUp class="h-6 w-6 text-primary" />
            <h2 class="text-xl font-semibold">Contribution Trends</h2>
        </div>
    </div>

    {#if chartData.length > 0}
        <div class="h-[400px] w-full">
            <LineChart
                data={chartData}
                x="date"
                series={[
                    {
                        key: 'value',
                        color: 'hsl(270, 85%, 55%)' // Primary blue color
                    }
                ]}
                options={{
                    line: {
                        strokeWidth: 2,
                        curve: 'monotoneX'
                    }
                }}
                points
            />
        </div>
    {:else}
        <GoalChartNotFound />
    {/if}
</section>