<script>
	import { ChartLine, BarChart4, Building2, Target, TrendingUp, ChevronRight } from 'lucide-svelte';

	let { investmentAnalysis, formatPercentage, getPerformanceColorClass, formatCurrency } = $props();

	//console.log('Investment Analysis: ', investmentAnalysis);
</script>

{#if investmentAnalysis?.Analysis}
	<section class="space-y-6">
		<!-- Header Section -->
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div class="flex items-center gap-3">
				<Target class="text-purple-500" size={24} />
				<div>
					<h2 class="text-2xl font-bold">Portfolio Analysis Dashboard</h2>
					<p class="text-sm text-gray-500">
						Total Portfolio Value: {formatCurrency(investmentAnalysis.Analysis.summary?.portfolio_value || 0)}
					</p>
				</div>
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
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each ['stocks', 'bonds', 'alternatives'] as category}
				<div
					class="group relative rounded-xl border border-gray-100/50 bg-gradient-to-br from-white to-gray-50/50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700/50 dark:from-gray-800 dark:to-gray-900/50 dark:hover:border-purple-500/30"
				>
					<!-- Category Header -->
					<div class="mb-6">
						<h3 class="mb-2 flex items-center gap-3 text-lg font-semibold capitalize">
							{#if category === 'stocks'}
								<ChartLine
									class="text-purple-500 transition-transform duration-300 group-hover:scale-110"
									size={24}
								/>
							{:else if category === 'bonds'}
								<BarChart4
									class="text-purple-500 transition-transform duration-300 group-hover:scale-110"
									size={24}
								/>
							{:else}
								<Building2
									class="text-purple-500 transition-transform duration-300 group-hover:scale-110"
									size={24}
								/>
							{/if}
							<div class="flex flex-col">
								<span class="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
									{category.replace('_', ' ')}
								</span>
								{#if investmentAnalysis.Analysis.summary?.asset_allocation?.[category]}
									<span class="text-sm text-gray-500">
										{formatPercentage(investmentAnalysis.Analysis.summary.asset_allocation[category])} of
										portfolio
									</span>
								{/if}
							</div>
						</h3>
						<div
							class="h-1 w-20 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 opacity-75"
						></div>
					</div>

					<!-- Content Area -->
					{#if investmentAnalysis.Analysis.metrics[category]?.length > 0}
						<div class="space-y-4">
							{#each investmentAnalysis.Analysis.metrics[category] as metric}
								<div
									class="group/card relative overflow-hidden rounded-lg border border-gray-100/50 bg-white p-4 shadow-sm transition-all duration-300 hover:border-purple-200 hover:shadow-md dark:border-gray-700/50 dark:bg-gray-800/50 dark:hover:border-purple-500/30"
								>
									<!-- Metric Header -->
									<div class="mb-3 flex items-center justify-between">
										<div class="flex items-center gap-2">
											<span class="font-semibold text-gray-800 dark:text-gray-200">
												{metric.stock_symbol || metric.bond_symbol || metric.investment_name}
											</span>
											{#if metric.roi !== undefined}
												<span
													class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
														metric.roi >= 0
															? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
															: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
													}`}
												>
													{formatPercentage(metric.roi)}
												</span>
											{/if}
										</div>
									</div>

									<!-- Metrics Grid -->
									<div class="grid grid-cols-2 gap-3">
										{#each Object.entries(metric).filter(([key]) =>
											['sharpe_ratio', 'volatility', 'beta'].includes(key)
										) as [key, value]}
											{#if value !== undefined && value !== null}
												<div
													class="relative overflow-hidden rounded-md bg-gray-50 p-2.5 dark:bg-gray-700/30"
												>
													<div class="flex items-center justify-between">
														<span class="text-sm font-medium text-gray-500 dark:text-gray-400">
															{key.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
														</span>
														<span class="text-sm font-semibold text-gray-700 dark:text-gray-300">
															{typeof value === 'number' ? value.toFixed(2) : value}
														</span>
													</div>
													<div
														class="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-300"
														style={`width: ${Math.min(Math.abs(Number(value)) * 50, 100)}%`}
													></div>
												</div>
											{/if}
										{/each}
									</div>

									<!-- Hover Effect -->
									<div
										class="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/0 to-purple-400/0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-5"
									></div>
								</div>
							{/each}
						</div>
					{:else}
						<!-- Empty State -->
						<div class="flex flex-col items-center justify-center space-y-3 py-8 text-center">
							<div class="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
								<Building2 class="text-purple-500" size={24} />
							</div>
							<div class="space-y-1">
								<h4 class="font-medium text-gray-900 dark:text-gray-100">No {category} Found</h4>
								<p class="text-sm text-gray-500 dark:text-gray-400">
									{#if category === 'alternatives'}
										Consider diversifying your portfolio with alternative investments
									{:else if category === 'bonds'}
										Add some bonds to balance your portfolio risk
									{:else}
										Start building your portfolio by adding some stocks
									{/if}
								</p>
							</div>
							<button
								class="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-600 transition-colors hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50"
							>
								<Plus size={16} />
								Add {category.slice(0, -1)}
							</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Market Insights and Recommendations -->
		<div class="grid gap-6 md:grid-cols-2">
			<!-- Market Insights -->
			<div
				class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
			>
				<h3 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<TrendingUp class="text-purple-500" size={20} />
					Market Insights
				</h3>
				{#if investmentAnalysis.Analysis.overall_summary}
					<div class="grid gap-4">
						{#each ['market_sentiment', 'interest_rate_outlook', 'inflation_outlook'] as insight}
							{#if investmentAnalysis.Analysis.overall_summary[insight]}
								<div
									class="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
								>
									<span class="text-gray-700 dark:text-gray-300">
										{insight.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
									</span>
									<span class="font-medium text-purple-600 dark:text-purple-400">
										{investmentAnalysis.Analysis.overall_summary[insight]}
									</span>
								</div>
							{/if}
						{/each}
					</div>
				{:else}
					<div class="text-center text-gray-500 dark:text-gray-400">
						<p>No market insights available at this time</p>
					</div>
				{/if}
			</div>

			<!-- Recommendations -->
			<div
				class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
			>
				<h3 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<Target class="text-purple-500" size={20} />
					Investment Recommendations
				</h3>
				{#if Object.keys(investmentAnalysis.Analysis.recommended_investment || {}).length > 0}
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
												{formatPercentage(investment.weight)}
											</span>
										</div>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-center text-gray-500 dark:text-gray-400">
						<p>No recommendations available at this time</p>
					</div>
				{/if}
			</div>
		</div>
	</section>
{:else}
	<!-- Loading State -->
	<div class="space-y-6">
		<div class="animate-pulse space-y-4">
			<div class="h-8 w-64 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each Array(3) as _}
					<div class="h-[400px] rounded-xl bg-gray-200 dark:bg-gray-700"></div>
				{/each}
			</div>
			<div class="grid gap-6 md:grid-cols-2">
				{#each Array(2) as _}
					<div class="h-[300px] rounded-xl bg-gray-200 dark:bg-gray-700"></div>
				{/each}
			</div>
		</div>
	</div>
{/if}