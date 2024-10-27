<script>
	import { LineChart, PieChart } from 'layerchart';
	import { schemeTableau10 } from 'd3-scale-chromatic';
	import Piechartnotfound from './notfound/piechartnotfound.svelte';
	import LineChartNotFound from './notfound/linechatnotfound.svelte';
	import { TrendingUp, ChartPie as PieChartIcon } from 'lucide-svelte';

	let { incomeData } = $props();
	// Chart data preparation functions
	function prepareLineChartData(incomes) {
		if (!incomes?.length) return [];

		const groupedByMonth = incomes.reduce((acc, item) => {
			const date = new Date(item.income.date_received).toISOString().slice(0, 7);
			acc[date] = (acc[date] || 0) + Number(item.income.amount);
			return acc;
		}, {});

		return Object.entries(groupedByMonth)
			.map(([date, value]) => ({
				date: new Date(date + '-01'),
				value: value
			}))
			.sort((a, b) => a.date - b.date);
	}

	function prepareSourcePieChart(incomes) {
		if (!incomes?.length) return [];

		const sourceTotals = incomes.reduce((acc, item) => {
			const source = item.income.source;
			acc[source] = (acc[source] || 0) + Number(item.income.amount);
			return acc;
		}, {});

		return Object.entries(sourceTotals)
			.map(([name, value]) => ({ name, value }))
			.sort((a, b) => b.value - a.value);
	}

	let lineChartData = $derived(prepareLineChartData(incomeData));
	let sourcePieData = $derived(prepareSourcePieChart(incomeData));
</script>

<div class="mb-8 grid gap-6 lg:grid-cols-2">
    {#if lineChartData.length}
        <div class="rounded-xl border border-purple-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-purple-200 hover:shadow-md dark:border-purple-900 dark:bg-gray-800 dark:hover:border-purple-700">
            <div class="mb-6 flex items-center gap-2">
                <TrendingUp class="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h3 class="text-lg font-semibold dark:text-white">Income Trends</h3>
            </div>
            <div class="h-[400px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
                <LineChart
                    data={lineChartData}
                    x="date"
                    series={[
                        {
                            key: 'value',
                            color: 'hsl(270, 85%, 55%)'
                        }
                    ]}
                    options={{
                        line: {
                            strokeWidth: 3,
                            curve: 'monotoneX'
                        },
                        grid: true,
                        tooltip: true,
                        animate: true
                    }}
                    points
                />
            </div>
        </div>
    {:else}
        <Piechartnotfound />
    {/if}

    {#if sourcePieData.length}
        <div class="rounded-xl border border-purple-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-purple-200 hover:shadow-md dark:border-purple-900 dark:bg-gray-800 dark:hover:border-purple-700">
            <div class="mb-6 flex items-center gap-2">
                <PieChartIcon class="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h3 class="text-lg font-semibold dark:text-white">Income by Source</h3>
            </div>
            <div class="relative w-full overflow-hidden">
                <div class="aspect-square h-auto w-full max-w-[400px] mx-auto">
                    <PieChart
                        data={sourcePieData}
                        key="name"
                        value="value"
                        innerRadius={0.6}
                        cornerRadius={4}
                        padAngle={0.02}
                        cRange={schemeTableau10}
                    />
                </div>
            </div>
        </div>
    {:else}
        <LineChartNotFound />
    {/if}
</div>