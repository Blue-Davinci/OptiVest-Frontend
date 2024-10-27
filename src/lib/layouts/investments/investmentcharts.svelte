<script>
	import { LineChart, PieChart } from 'layerchart';
	import { schemeTableau10 } from 'd3-scale-chromatic';
    import {
		ChartLine,
		ChartPie,
	} from 'lucide-svelte';


    let {stockInvestments, bondInvestments, alternativeInvestments, formatCurrency, formatPercentage, calculateTotalPortfolioValue} = $props(); 

    function preparePortfolioValueData(stocks, bonds, alternatives) {
		// Create monthly data points for the last 12 months
		const dates = Array.from({ length: 12 }, (_, i) => {
			const date = new Date();
			date.setMonth(date.getMonth() - (11 - i));
			return date;
		});

		// Simulate historical values with some variation
		return dates.map((date) => ({
			date,
			value: calculateTotalPortfolioValue() * (0.9 + Math.random() * 0.2)
		}));
	}

	function prepareAssetAllocationData() {
		const stockValue = stockInvestments.reduce(
			(acc, stock) => acc + parseFloat(stock.total_transactions_sum || 0),
			0
		);
		const bondValue = bondInvestments.reduce(
			(acc, bond) => acc + parseFloat(bond.total_transactions_sum || 0),
			0
		);
		const altValue = alternativeInvestments.reduce(
			(acc, alt) => acc + parseFloat(alt.total_valuation_sum || 0),
			0
		);

		return [
			{ name: 'Stocks', value: stockValue },
			{ name: 'Bonds', value: bondValue },
			{ name: 'Alternatives', value: altValue }
		];
	}

	function prepareSectorDistributionData() {
		const sectorTotals = stockInvestments.reduce((acc, stock) => {
			const sector = stock.stock.sector;
			acc[sector] = (acc[sector] || 0) + parseFloat(stock.stock.current_value || 0);
			return acc;
		}, {});

		return Object.entries(sectorTotals)
			.map(([name, value]) => ({ name, value }))
			.sort((a, b) => b.value - a.value);
	}

	function preparePerformanceComparisonData() {
		// Simulate benchmark data (e.g., S&P 500)
		const dates = Array.from({ length: 12 }, (_, i) => {
			const date = new Date();
			date.setMonth(date.getMonth() - (11 - i));
			return date;
		});

		return dates.map((date) => ({
			date,
			portfolio: calculateTotalPortfolioValue() * (0.9 + Math.random() * 0.2),
			benchmark: calculateTotalPortfolioValue() * (0.85 + Math.random() * 0.3)
		}));
	}

	// Add these derived states
	let portfolioValueData = $derived(
		preparePortfolioValueData(stockInvestments, bondInvestments, alternativeInvestments)
	);
	let assetAllocationData = $derived(prepareAssetAllocationData());
	let sectorDistributionData = $derived(prepareSectorDistributionData());
	let performanceComparisonData = $derived(preparePerformanceComparisonData());


  function getGradientClass(value) {
    if (!value || isNaN(value)) return 'from-gray-500 to-gray-600';
    return parseFloat(value) >= 0 
      ? 'from-emerald-500 to-emerald-600' 
      : 'from-rose-500 to-rose-600';
  }

  function getStatusIndicator(status) {
    const statusMap = {
      high: 'bg-emerald-500',
      medium: 'bg-amber-500',
      low: 'bg-rose-500'
    };
    return statusMap[status.toLowerCase()] || 'bg-gray-500';
  }
</script>

<div class="mb-8 space-y-6">
    <!-- Main Charts Row -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Portfolio Value Trend -->
        <div
            class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
            <div class="mb-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <ChartLine class="text-purple-500" size={24} />
                    <h3 class="text-xl font-bold">Portfolio Value Trend</h3>
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Last 12 months</div>
            </div>
            <div class="h-[350px]">
                <LineChart
                    data={portfolioValueData}
                    x="date"
                    series={[{ key: 'value', color: 'hsl(270, 85%, 55%)' }]}
                    options={{
                        line: { strokeWidth: 3, curve: 'monotoneX' },
                        grid: true,
                        tooltip: true,
                        animate: true,
                        xAxis: { tickCount: 6 },
                        yAxis: { tickFormat: (v) => formatCurrency(v) }
                    }}
                    points
                />
            </div>
        </div>

        <!-- Performance Comparison -->
        <div
            class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
            <div class="mb-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <ChartLine class="text-purple-500" size={24} />
                    <h3 class="text-xl font-bold">Performance vs Market</h3>
                </div>
                <div class="flex items-center gap-2 text-sm">
                    <span class="flex items-center gap-1">
                        <div class="h-3 w-3 rounded-full bg-purple-500"></div>
                        Portfolio
                    </span>
                    <span class="flex items-center gap-1">
                        <div class="h-3 w-3 rounded-full bg-blue-500"></div>
                        S&P 500
                    </span>
                </div>
            </div>
            <div class="h-[350px]">
                <LineChart
                    data={performanceComparisonData}
                    x="date"
                    series={[
                        { key: 'portfolio', color: 'hsl(270, 85%, 55%)', name: 'Portfolio' },
                        { key: 'benchmark', color: 'hsl(200, 85%, 55%)', name: 'S&P 500' }
                    ]}
                    options={{
                        line: { strokeWidth: 3, curve: 'monotoneX' },
                        grid: true,
                        tooltip: true,
                        animate: true,
                        legend: true,
                        xAxis: { tickCount: 6 },
                        yAxis: { tickFormat: (v) => formatCurrency(v) }
                    }}
                    points
                />
            </div>
        </div>
    </div>

    <!-- Distribution Charts Row -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Asset Allocation -->
        <div
            class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
            <div class="mb-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <ChartPie class="text-purple-500" size={24} />
                    <h3 class="text-xl font-bold">Asset Allocation</h3>
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Current Distribution</div>
            </div>
            <div class="relative w-full overflow-hidden">
                <div class="mx-auto aspect-square h-auto w-full max-w-[300px]">
                    <PieChart
                        data={assetAllocationData}
                        key="name"
                        value="value"
                        innerRadius={0.6}
                        cornerRadius={4}
                        padAngle={0.02}
                        cRange={schemeTableau10}
                    />
                </div>
                <div class="mt-4 grid grid-cols-3 gap-2 text-sm">
                    {#each assetAllocationData as item}
                        <div class="flex items-center gap-2">
                            <div
                                class="h-3 w-3 rounded-full"
                                style="background-color: {schemeTableau10[assetAllocationData.indexOf(item)]}"
                            ></div>
                            <span
                                >{item.name}: {formatPercentage(
                                    item.value / calculateTotalPortfolioValue()
                                )}</span
                            >
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Sector Distribution -->
        <div
            class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
            <div class="mb-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <ChartPie class="text-purple-500" size={24} />
                    <h3 class="text-xl font-bold">Sector Distribution</h3>
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Stocks by Sector</div>
            </div>
            <div class="relative w-full overflow-hidden">
                <div class="mx-auto aspect-square h-auto w-full max-w-[300px]">
                    <PieChart
                        data={sectorDistributionData}
                        key="name"
                        value="value"
                        innerRadius={0.6}
                        cornerRadius={4}
                        padAngle={0.02}
                        cRange={schemeTableau10}
                    />
                </div>
                <div class="mt-4 grid grid-cols-2 gap-2 text-sm">
                    {#each sectorDistributionData as item}
                        <div class="flex items-center gap-2">
                            <div
                                class="h-3 w-3 rounded-full"
                                style="background-color: {schemeTableau10[
                                    sectorDistributionData.indexOf(item)
                                ]}"
                            ></div>
                            <span
                                >{item.name}: {formatPercentage(
                                    item.value / calculateTotalPortfolioValue()
                                )}</span
                            >
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>
