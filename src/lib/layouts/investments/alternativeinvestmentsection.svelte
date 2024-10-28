<script>
import { Building2, Plus, Search, Briefcase, MapPin, BadgeDollarSign, Percent, DollarSign, Calendar } from 'lucide-svelte';
import CreateAlternative from './createalternative.svelte';

let { data, formatCurrency, formatPercentage, alternativeInvestments, altSearchQuery, filterAlternatives, formatDate } = $props();
</script>

{#if alternativeInvestments.length > 0}
			<section
				class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
			>
				<div class="mb-6 flex flex-col gap-4">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<Building2 class="text-purple-500" size={24} />
							<h2 class="text-2xl font-bold">Alternative Investments</h2>
						</div>
						<CreateAlternative {data} />
					</div>
					<div class="relative">
						<Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
						<input
							type="text"
							bind:value={altSearchQuery}
							placeholder="Search alternative investments..."
							class="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800"
						/>
					</div>
				</div>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					{#each filterAlternatives(alternativeInvestments) as alt}
						<div
							class="rounded-lg border border-gray-200 bg-gray-50 p-6 transition-all hover:shadow-md dark:border-gray-600 dark:bg-gray-700/50"
						>
							<h3 class="mb-4 text-xl font-semibold text-purple-600 dark:text-purple-400">
								{alt.alternative.investment_name ? alt.alternative.investment_name : alt.alternative.investment_type}
							</h3>
							<div class="space-y-3">
								<p class="flex items-center gap-2">
									<Briefcase size={16} class="text-gray-400" />
									<span class="font-medium">Type:</span>
									{alt.alternative.investment_type}
								</p>
								<p class="flex items-center gap-2">
									<MapPin size={16} class="text-gray-400" />
									<span class="font-medium">Location:</span>
									{alt.alternative.location}
								</p>
								<p class="flex items-center gap-2">
									<BadgeDollarSign size={16} class="text-gray-400" />
									<span class="font-medium">Annual Revenue:</span>
									{formatCurrency(alt.alternative.annual_revenue)}
								</p>
								<p class="flex items-center gap-2">
									<Percent size={16} class="text-gray-400" />
									<span class="font-medium">Profit Margin:</span>
									{formatPercentage(alt.alternative.profit_margin / 100)}
								</p>
								<p class="flex items-center gap-2">
									<DollarSign size={16} class="text-gray-400" />
									<span class="font-medium">Valuation:</span>
									{formatCurrency(alt.alternative.valuation)}
								</p>
								<p class="flex items-center gap-2">
									<Calendar size={16} class="text-gray-400" />
									<span class="font-medium">Acquired:</span>
									{formatDate(alt.alternative.acquired_at)}
								</p>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{:else}
			<div
				class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
			>
				<p class="text-center text-gray-500 dark:text-gray-400">No alternative investments found</p>
			</div>
		{/if}