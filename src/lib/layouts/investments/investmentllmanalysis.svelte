<script>
    import { ChartLine, BarChart4, Building2, Target, TrendingUp, ChevronRight } from 'lucide-svelte';

    let {investmentAnalysis, formatPercentage, getPerformanceColorClass } = $props();
</script>

{#if investmentAnalysis?.Analysis}
	<section class="space-y-6">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<Target class="text-purple-500" size={24} />
				<h2 class="text-2xl font-bold">Portfolio Analysis Dashboard</h2>
			</div>
			<div class="flex items-center gap-2">
				<span class="text-sm text-gray-500">Last Updated:</span>
				<span
					class="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
				>
					{new Date(investmentAnalysis.CreatedAt).toLocaleDateString()}
				</span>
			</div>
		</div>

		<!-- Performance Metrics Grid -->
		<div class="grid gap-6 md:grid-cols-3">
			{#each ['stocks', 'bonds', 'alternative_investments'] as category}
				{#if investmentAnalysis.Analysis.metrics[category]?.length > 0}
					<div
						class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
					>
						<h3 class="mb-4 flex items-center gap-2 text-lg font-semibold capitalize">
							{#if category === 'stocks'}
								<ChartLine class="text-purple-500" size={20} />
							{:else if category === 'bonds'}
								<BarChart4 class="text-purple-500" size={20} />
							{:else}
								<Building2 class="text-purple-500" size={20} />
							{/if}
							{category.replace('_', ' ')} Metrics
						</h3>
						<div class="space-y-3">
							{#each investmentAnalysis.Analysis.metrics[category] as metric}
								<div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
									<div class="flex items-center justify-between">
										<span class="font-medium text-gray-700 dark:text-gray-300">
											{metric.stock_symbol || metric.bond_symbol || metric.investment_name}
										</span>
										{#if metric.sentiment_label}
											<span
												class="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
											>
												{metric.sentiment_label}
											</span>
										{/if}
									</div>
									<div class="mt-2 grid grid-cols-2 gap-2 text-sm">
										{#if metric.roi !== undefined}
											<div>
												<span class="text-gray-500">ROI:</span>
												<span class={getPerformanceColorClass(metric.roi)}>
													{formatPercentage(metric.roi)}
												</span>
											</div>
										{/if}
										{#if metric.sharpe_ratio}
											<div>
												<span class="text-gray-500">Sharpe:</span>
												<span class={getPerformanceColorClass(metric.sharpe_ratio)}>
													{metric.sharpe_ratio.toFixed(2)}
												</span>
											</div>
										{/if}
										{#if metric.volatility}
											<div>
												<span class="text-gray-500">Volatility:</span>
												<span>{formatPercentage(metric.volatility)}</span>
											</div>
										{/if}
										{#if metric.sector_performance}
											<div>
												<span class="text-gray-500">Sector:</span>
												<span class={getPerformanceColorClass(metric.sector_performance)}>
													{formatPercentage(metric.sector_performance)}
												</span>
											</div>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			{/each}
		</div>

		<!-- Market Insights -->
		<div class="grid gap-6 md:grid-cols-2">
			<!-- Trends and Insights -->
			<div
				class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
			>
				<h3 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<TrendingUp class="text-purple-500" size={20} />
					Market Insights
				</h3>
				<div class="grid gap-4">
					<div
						class="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
					>
						<span class="text-gray-700 dark:text-gray-300">Market Sentiment</span>
						<span class="font-medium text-purple-600 dark:text-purple-400">
							{investmentAnalysis.Analysis.overall_summary.market_sentiment}
						</span>
					</div>
					<div
						class="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
					>
						<span class="text-gray-700 dark:text-gray-300">Interest Rate Outlook</span>
						<span class="font-medium text-purple-600 dark:text-purple-400">
							{investmentAnalysis.Analysis.overall_summary.interest_rate_outlook}
						</span>
					</div>
					<div
						class="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
					>
						<span class="text-gray-700 dark:text-gray-300">Inflation Outlook</span>
						<span class="font-medium text-purple-600 dark:text-purple-400">
							{investmentAnalysis.Analysis.overall_summary.inflation_outlook}
						</span>
					</div>
				</div>
			</div>

			<!-- Investment Recommendations -->
			<div
				class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
			>
				<h3 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<Target class="text-purple-500" size={20} />
					Recommended Investments
				</h3>
				<div class="space-y-4">
					{#each Object.entries(investmentAnalysis.Analysis.recommended_investment) as [type, investments]}
						<div>
							<h4 class="mb-2 text-sm font-medium uppercase text-gray-500">
								{type}
							</h4>
							<div class="space-y-2">
								{#each investments as investment}
									<div
										class="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
									>
										<span class="font-medium text-gray-700 dark:text-gray-300">
											{investment.stock_symbol ||
												investment.bond_symbol ||
												investment.investment_name}
										</span>
										<span
											class="rounded-full bg-purple-100 px-2 py-0.5 text-sm font-medium text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
										>
											Weight: {formatPercentage(investment.weight)}
										</span>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Significant Trends -->
		<div
			class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
		>
			<h3 class="mb-4 flex items-center gap-2 text-lg font-semibold">
				<ChartLine class="text-purple-500" size={20} />
				Portfolio Trends
			</h3>
			<div class="grid gap-4 md:grid-cols-2">
				{#each investmentAnalysis.Analysis.summary.significant_trends as trend}
					<div class="flex items-center gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
						<ChevronRight class="text-purple-500" size={16} />
						<span class="text-gray-700 dark:text-gray-300">{trend}</span>
					</div>
				{/each}
			</div>
		</div>
	</section>
{:else}
	<div
		class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
	>
		<p class="text-center text-gray-500 dark:text-gray-400">No investment analysis available</p>
	</div>
{/if}
