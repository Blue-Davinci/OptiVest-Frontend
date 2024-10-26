<script>
	import {
		Search
	} from 'lucide-svelte';

    let {expenseSearchQuery, filteredExpenses, formatAmount, formatDate} = $props();
</script>

<section>
			<div
				class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
			>
				<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">All Expenses</h2>
						<p class="text-gray-600 dark:text-gray-300">
							View and manage all your recorded expenses
						</p>
					</div>
					<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
						<div class="relative">
							<input
								type="text"
								bind:value={expenseSearchQuery}
								placeholder="Search expenses..."
								class="w-full sm:w-72 rounded-lg border border-gray-200 bg-white py-2.5 pl-10
                           pr-4 text-gray-900 placeholder-gray-400 outline-none
                           focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700
                           dark:text-gray-100 dark:placeholder-gray-500"
							/>
							<Search class="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
						</div>
						<button
							class="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2.5 text-sm
                       font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none
                       focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700
                       dark:hover:bg-purple-600"
						>
							Add Expense
						</button>
					</div>
				</div>

				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gray-50 dark:bg-gray-700">
							<tr>
								<th
									class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
									>Name</th
								>
								<th
									class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
									>Category</th
								>
								<th
									class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
									>Amount</th
								>
								<th
									class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
									>Date</th
								>
								<th
									class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
									>Description</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
							{#each filteredExpenses as expense}
								<tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
									<td class="px-6 py-4">
										<div class="text-sm font-medium text-gray-900 dark:text-white">
											{expense.name}
										</div>
									</td>
									<td class="px-6 py-4">
										<span
											class="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold
                                 leading-5 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
										>
											{expense.category}
										</span>
									</td>
									<td class="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-300">
										{formatAmount(expense.amount)}
									</td>
									<td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
										{formatDate(expense.date_occurred)}
									</td>
									<td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
										<div class="max-w-xs truncate">{expense.description}</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</section>