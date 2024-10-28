<script>
    import { AlertCircle, AlertTriangle, DollarSign, Scale, Target } from 'lucide-svelte';

    let { formatCurrency, formatPercentage, safeGet, investmentAnalysis } = $props();

    // Helper function to determine risk level class
    const getRiskLevelClass = (risk) => {
        if (risk >= 0.75) return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400';
        if (risk >= 0.5) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400';
    };
</script>

{#if safeGet(investmentAnalysis, 'Analysis.summary.red_flags', []).length > 0}
    <div class="space-y-6 transition-all duration-300 ease-in-out">
        <div
            class="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-50/50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-amber-800/50 dark:from-amber-900/20 dark:to-amber-900/10"
            data-animate
        >
            <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex items-center gap-3">
                    <div class="rounded-full bg-amber-100 p-2 dark:bg-amber-900/50">
                        <AlertCircle class="text-amber-600 dark:text-amber-400" size={24} />
                    </div>
                    <h3 class="text-xl font-bold text-amber-800 dark:text-amber-300">Portfolio Risk Alerts</h3>
                </div>
                <span
                    class={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-300 ${getRiskLevelClass(
                        safeGet(investmentAnalysis, 'Analysis.overall_summary.portfolio_risk', 0)
                    )}`}
                >
                    Risk Level: {formatPercentage(
                        safeGet(investmentAnalysis, 'Analysis.overall_summary.portfolio_risk', 0)
                    )}
                </span>
            </div>

            <div class="grid gap-8 md:grid-cols-2">
                <!-- Risk Alerts -->
                <div class="space-y-4">
                    <h4 class="font-semibold text-amber-900 dark:text-amber-200">Identified Risks</h4>
                    <ul class="space-y-3">
                        {#each investmentAnalysis.Analysis.summary.red_flags as flag}
                            <li
                                class="group flex items-start gap-3 rounded-lg bg-white/70 p-4 shadow-sm transition-all duration-300 hover:bg-white/90 hover:shadow-md dark:bg-amber-900/20 dark:hover:bg-amber-900/30"
                            >
                                <AlertTriangle class="mt-0.5 text-amber-500 transition-colors group-hover:text-amber-600 dark:text-amber-400" size={18} />
                                <span class="text-gray-700 dark:text-amber-100">{flag}</span>
                            </li>
                        {/each}
                    </ul>
                </div>

                <!-- Action Items -->
                <div class="space-y-4">
                    <h4 class="font-semibold text-amber-900 dark:text-amber-200">Recommended Actions</h4>
                    <ul class="space-y-3">
                        {#if safeGet(investmentAnalysis, 'Analysis.actions.diversification', []).length > 0}
                            <li
                                class="group flex items-start gap-3 rounded-lg bg-white/70 p-4 shadow-sm transition-all duration-300 hover:bg-white/90 hover:shadow-md dark:bg-amber-900/20 dark:hover:bg-amber-900/30"
                            >
                                <Target class="mt-0.5 text-amber-500 transition-colors group-hover:text-amber-600 dark:text-amber-400" size={18} />
                                <div class="flex-1">
                                    <p class="text-gray-800 dark:text-amber-100">
                                        Rebalance {investmentAnalysis.Analysis.actions.diversification[0].asset_class}
                                    </p>
                                    <p class="mt-2 text-sm text-gray-600 dark:text-amber-300/80">
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
                                    class="group flex items-start gap-3 rounded-lg bg-white/70 p-4 shadow-sm transition-all duration-300 hover:bg-white/90 hover:shadow-md dark:bg-amber-900/20 dark:hover:bg-amber-900/30"
                                >
                                    <Scale class="mt-0.5 text-amber-500 transition-colors group-hover:text-amber-600 dark:text-amber-400" size={18} />
                                    <div class="flex-1">
                                        <p class="text-gray-800 dark:text-amber-100">
                                            Adjust {action.asset_class} Allocation
                                        </p>
                                        <p class="mt-2 text-sm text-gray-600 dark:text-amber-300/80">
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
                                    class="group flex items-start gap-3 rounded-lg bg-white/70 p-4 shadow-sm transition-all duration-300 hover:bg-white/90 hover:shadow-md dark:bg-amber-900/20 dark:hover:bg-amber-900/30"
                                >
                                    <DollarSign class="mt-0.5 text-amber-500 transition-colors group-hover:text-amber-600 dark:text-amber-400" size={18} />
                                    <div class="flex-1">
                                        <p class="text-gray-800 dark:text-amber-100">
                                            Consider Tax Loss Harvesting for {action.stock_symbol}
                                        </p>
                                        <p class="mt-2 text-sm text-gray-600 dark:text-amber-300/80">
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
            <div class="mt-8 overflow-hidden rounded-lg bg-gradient-to-br from-white/90 to-white/70 p-5 shadow-sm dark:from-amber-900/40 dark:to-amber-900/30">
                <h4 class="mb-3 font-semibold text-amber-900 dark:text-amber-200">Recommended Next Steps</h4>
                <p class="text-sm leading-relaxed text-gray-700 dark:text-amber-100/90">
                    {safeGet(investmentAnalysis, 'Analysis.overall_summary.text_summary', '')}
                </p>
            </div>
        </div>
    </div>
{/if}
