<script>
	import { AlertCircle, AlertTriangle, DollarSign, Scale, Target } from 'lucide-svelte';

    let {formatCurrency, formatPercentage, safeGet, investmentAnalysis} = $props();
</script>

{#if safeGet(investmentAnalysis, 'Analysis.summary.red_flags', []).length > 0}
	<div class="space-y-6">
		<div
			class="rounded-xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-800 dark:bg-rose-900/20"
			data-animate
		>
			<div class="mb-6 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<AlertCircle class="text-rose-500" size={24} />
					<h3 class="text-xl font-bold text-rose-700 dark:text-rose-400">Portfolio Risk Alerts</h3>
				</div>
				<span
					class="rounded-full bg-rose-200 px-3 py-1 text-sm font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
				>
					Risk Level: {formatPercentage(
						safeGet(investmentAnalysis, 'Analysis.overall_summary.portfolio_risk', 0)
					)}
				</span>
			</div>

			<div class="grid gap-6 md:grid-cols-2">
				<!-- Risk Alerts -->
				<div class="space-y-4">
					<h4 class="font-semibold text-rose-800 dark:text-rose-300">Identified Risks</h4>
					<ul class="space-y-3">
						{#each investmentAnalysis.Analysis.summary.red_flags as flag}
							<li
								class="flex items-start gap-2 rounded-lg bg-white/50 p-3 shadow-sm dark:bg-rose-900/10"
							>
								<AlertTriangle class="mt-0.5 text-rose-500" size={18} />
								<span class="text-rose-700 dark:text-rose-400">{flag}</span>
							</li>
						{/each}
					</ul>
				</div>

				<!-- Action Items -->
				<div class="space-y-4">
					<h4 class="font-semibold text-rose-800 dark:text-rose-300">Recommended Actions</h4>
					<ul class="space-y-3">
						{#if safeGet(investmentAnalysis, 'Analysis.actions.diversification', []).length > 0}
							<li
								class="flex items-start gap-2 rounded-lg bg-white/50 p-3 shadow-sm dark:bg-rose-900/10"
							>
								<Target class="mt-0.5 text-rose-500" size={18} />
								<div class="flex-1">
									<p class="text-rose-700 dark:text-rose-400">
										Rebalance {investmentAnalysis.Analysis.actions.diversification[0].asset_class}
									</p>
									<p class="mt-1 text-sm text-rose-600/80">
										Current: {formatPercentage(
											investmentAnalysis.Analysis.actions.diversification[0].current_diversification
										)} → Target: {formatPercentage(
											investmentAnalysis.Analysis.actions.diversification[0]
												.recommended_diversification
										)}
									</p>
								</div>
							</li>
						{/if}

						{#if safeGet(investmentAnalysis, 'Analysis.actions.rebalancing', []).length > 0}
							{#each investmentAnalysis.Analysis.actions.rebalancing as action}
								<li
									class="flex items-start gap-2 rounded-lg bg-white/50 p-3 shadow-sm dark:bg-rose-900/10"
								>
									<Scale class="mt-0.5 text-rose-500" size={18} />
									<div class="flex-1">
										<p class="text-rose-700 dark:text-rose-400">
											Adjust {action.asset_class} Allocation
										</p>
										<p class="mt-1 text-sm text-rose-600/80">
											Current: {formatPercentage(action.current_allocation)} → Target: {formatPercentage(
												action.recommended_allocation
											)}
										</p>
									</div>
								</li>
							{/each}
						{/if}

						{#if safeGet(investmentAnalysis, 'Analysis.actions.tax_loss_harvesting', []).length > 0}
							{#each investmentAnalysis.Analysis.actions.tax_loss_harvesting as action}
								<li
									class="flex items-start gap-2 rounded-lg bg-white/50 p-3 shadow-sm dark:bg-rose-900/10"
								>
									<DollarSign class="mt-0.5 text-rose-500" size={18} />
									<div class="flex-1">
										<p class="text-rose-700 dark:text-rose-400">
											Consider Tax Loss Harvesting for {action.stock_symbol}
										</p>
										<p class="mt-1 text-sm text-rose-600/80">
											Unrealized Loss: {formatCurrency(
												action.purchase_price - action.current_price
											)}
										</p>
									</div>
								</li>
							{/each}
						{/if}
					</ul>
				</div>
			</div>

			<!-- Summary and Next Steps -->
			<div class="mt-6 rounded-lg bg-white/70 p-4 dark:bg-rose-900/30">
				<h4 class="mb-2 font-semibold text-rose-800 dark:text-rose-300">Recommended Next Steps</h4>
				<p class="text-sm text-rose-700/90 dark:text-rose-400/90">
					{safeGet(investmentAnalysis, 'Analysis.overall_summary.text_summary', '')}
				</p>
			</div>
		</div>
	</div>
{/if}
