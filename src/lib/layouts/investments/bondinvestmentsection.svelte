<script>
    import { BarChart4, Plus, Search, Percent, Calendar } from 'lucide-svelte';

    let { formatCurrency, formatPercentage, bondInvestments, bondSearchQuery, filterBonds, formatDate } = $props();
</script>

{#if bondInvestments.length > 0}
	<section
		class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
	>
		<div class="mb-6 flex flex-col gap-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<BarChart4 class="text-purple-500" size={24} />
					<h2 class="text-2xl font-bold">Bond Investments</h2>
				</div>
				<button
					class="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
				>
					<Plus size={16} />
					Add Bond
				</button>
			</div>
			<div class="relative">
				<Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
				<input
					type="text"
					bind:value={bondSearchQuery}
					placeholder="Search bonds by symbol..."
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
						<th class="px-4 py-3">Coupon Rate</th>
						<th class="px-4 py-3">Maturity Date</th>
						<th class="px-4 py-3">YTM</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
					{#each filterBonds(bondInvestments) as bond}
						<tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
							<td class="px-4 py-3 font-medium text-purple-600 dark:text-purple-400"
								>{bond.bond.bond_symbol}</td
							>
							<td class="px-4 py-3">{bond.bond.quantity}</td>
							<td class="px-4 py-3">{formatCurrency(bond.bond.purchase_price)}</td>
							<td class="px-4 py-3">
								<span class="inline-flex items-center gap-1">
									<Percent size={14} />
									{formatPercentage(bond.bond.coupon_rate / 100)}
								</span>
							</td>
							<td class="px-4 py-3">
								<span class="inline-flex items-center gap-1">
									<Calendar size={14} />
									{formatDate(bond.bond.maturity_date)}
								</span>
							</td>
							<td class="px-4 py-3">{formatPercentage(bond.analysis?.ytm / 100 ?? 0)}</td>
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
		<p class="text-center text-gray-500 dark:text-gray-400">No bond investments found</p>
	</div>
{/if}
