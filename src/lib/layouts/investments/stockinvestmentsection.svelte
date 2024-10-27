<script>

import { ChartLine, Plus, Search, Building, ArrowUpRight, ArrowDownRight } from 'lucide-svelte';

let { formatCurrency, formatPercentage, stockInvestments, stockSearchQuery, filterStocks, getPerformanceColorClass } = $props();
</script>

{#if stockInvestments.length > 0}
	<section
		class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
		data-animate
	>
		<div class="mb-6 flex flex-col gap-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<ChartLine class="text-purple-500" size={24} />
					<h2 class="text-2xl font-bold">Stock Investments</h2>
				</div>
				<button
					class="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
				>
					<Plus size={16} />
					Add Stock
				</button>
			</div>
			<div class="relative">
				<Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
				<input
					type="text"
					bind:value={stockSearchQuery}
					placeholder="Search stocks by symbol or sector..."
					class="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800"
				/>
			</div>
		</div>
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
				<thead>
					<tr class="text-left text-sm font-medium text-gray-500 dark:text-gray-400">
						<th class="px-4 py-3">Symbol</th>
						<th class="px-4 py-3">Quantity</th>
						<th class="px-4 py-3">Purchase Price</th>
						<th class="px-4 py-3">Current Value</th>
						<th class="px-4 py-3">Sector</th>
						<th class="px-4 py-3">Performance</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
					{#each filterStocks(stockInvestments) as stock}
						<tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
							<td class="px-4 py-3 font-medium text-purple-600 dark:text-purple-400"
								>{stock.stock.stock_symbol}</td
							>
							<td class="px-4 py-3">{stock.stock.quantity}</td>
							<td class="px-4 py-3">{formatCurrency(stock.stock.purchase_price)}</td>
							<td class="px-4 py-3">{formatCurrency(stock.stock.current_value)}</td>
							<td class="px-4 py-3">
								<span class="inline-flex items-center gap-1">
									<Building size={14} />
									{stock.stock.sector}
								</span>
							</td>
							<td class="px-4 py-3">
								<span class="inline-flex items-center gap-1">
									{#if parseFloat(stock.analysis?.returns?.[0]) > 0}
										<ArrowUpRight class="text-emerald-500" size={16} />
									{:else}
										<ArrowDownRight class="text-rose-500" size={16} />
									{/if}
									<span class={getPerformanceColorClass(stock.analysis?.returns?.[0])}>
										{formatPercentage(stock.analysis?.returns?.[0] ?? 0)}
									</span>
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
{:else}
	<div
		class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
	>
		<p class="text-center text-gray-500 dark:text-gray-400">No stock investments found</p>
	</div>
{/if}
