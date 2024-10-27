<script>
	import { Search, Calendar, Briefcase } from 'lucide-svelte';

	let { filteredIncomes, searchQuery, formatCurrency, formatDate } = $$props;
</script>

<div
	class="rounded-xl border border-purple-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-purple-900 dark:bg-gray-800"
>
	<div class="border-b border-purple-100 p-6 dark:border-purple-900">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div class="flex items-center gap-2">
				<Calendar class="h-5 w-5 text-purple-600 dark:text-purple-400" />
				<h3 class="text-lg font-semibold dark:text-white">Income Transactions</h3>
			</div>
			<div class="relative">
				<Search
					class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400 dark:text-gray-500"
				/>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search incomes..."
					class="w-full rounded-lg border py-2 pl-10 pr-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:w-64"
				/>
			</div>
		</div>
	</div>

	{#if filteredIncomes.length}
		<div class="overflow-x-auto">
			<div class="inline-block min-w-full align-middle">
				<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
					<thead class="bg-gray-50 dark:bg-gray-900">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
								>Date</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
								>Source</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
								>Description</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
								>Amount</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
								>Currency</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
						{#each filteredIncomes as { income } (income.id)}
							<tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
									{formatDate(income.date_received)}
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<div class="flex items-center">
										<Briefcase class="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
										<span class="text-sm font-medium text-purple-600 dark:text-purple-400"
											>{income.source}</span
										>
									</div>
								</td>
								<td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
									{income.description}
								</td>
								<td
									class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-300"
								>
									{formatCurrency(income.amount_original, income.original_currency_code)}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
									{income.original_currency_code}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{:else}
		<div class="p-8 text-center">
			<p class="text-sm text-gray-500 dark:text-gray-400">
				No matching income records found. Try adjusting your search.
			</p>
		</div>
	{/if}
</div>
