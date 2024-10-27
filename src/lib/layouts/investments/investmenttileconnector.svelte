<script>
import { DollarSign, TrendingUp, AlertTriangle, Calendar } from 'lucide-svelte';

let {formatCurrency, formatDate, formatPercentage, safeGet, totalPortfolioValue, investmentAnalysis} = $props();

</script>

<!-- Portfolio Summary Cards -->
<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
    <div
    class="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
    data-animate
  >
    <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
    <div class="relative">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold">Total Portfolio Value</h3>
        <div class="rounded-full bg-purple-100 p-2 dark:bg-purple-900/30">
          <DollarSign class="text-purple-500" size={20} />
        </div>
      </div>
      <p class="text-3xl font-bold text-purple-600 dark:text-purple-400">
        {formatCurrency(totalPortfolioValue)}
      </p>
      <div class="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Calendar size={14} />
        <span>Updated {formatDate(new Date())}</span>
      </div>
    </div>
  </div>

  <div
  class="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
  data-animate
>
<div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
              <div class="mb-4 flex items-center justify-between">
                  <h3 class="text-lg font-semibold">Expected Return</h3>
        <div class="rounded-full bg-purple-100 p-2 dark:bg-purple-900/30">
                  <TrendingUp class="text-emerald-500" size={20} />
        </div>
              </div>
              <p class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatPercentage(
                      safeGet(investmentAnalysis, 'Analysis.overall_summary.expected_return', 0)
                  )}
              </p>
      <div class="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Calendar size={14} />
        <span>Updated {formatDate(new Date())}</span>
      </div>
          </div>

    <div
    class="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
    data-animate
  >
  <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
              <div class="mb-4 flex items-center justify-between">
                  <h3 class="text-lg font-semibold">Portfolio Risk</h3>
        <div class="rounded-full bg-purple-100 p-2 dark:bg-purple-900/30">
                  <AlertTriangle class="text-amber-500" size={20} />
        </div>
              </div>
              <p class="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {formatPercentage(
                      safeGet(investmentAnalysis, 'Analysis.overall_summary.portfolio_risk', 0)
                  )}
              </p>
      <div class="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Calendar size={14} />
        <span>Updated {formatDate(new Date())}</span>
      </div>
          </div>
      </div>
