<script>
	import { 
		Building2, Plus, Search, Briefcase, MapPin, 
		BadgeDollarSign, Percent, DollarSign, Calendar,
		TrendingUp, Filter
	} from 'lucide-svelte';
	import CreateAlternative from './createalternative.svelte';
	import { fade, slide } from 'svelte/transition';
	
	let { data, formatCurrency, formatPercentage, alternativeInvestments, altSearchQuery, filterAlternatives, formatDate } = $props();
	
	// State management
	let sortBy = $state('valuation');
	let sortOrder = $state('desc');
	let showBusinessOnly = $state(false);
	
	function calculateTotalPortfolioValue(investments) {
    return investments.reduce((total, inv) => {
        const value = parseFloat(inv.alternative.valuation) || 0;
        return total + value;
    }, 0);
}

function calculateTotalAnnualRevenue(investments) {
    return investments.reduce((total, inv) => {
        const revenue = parseFloat(inv.alternative.annual_revenue) || 0;
        return total + revenue;
    }, 0);
}

function calculateAverageProfitMargin(investments) {
    // Filter out investments with zero or invalid profit margins
    const validMargins = investments.filter(inv => {
        const margin = parseFloat(inv.alternative.profit_margin);
        return margin > 0 && !isNaN(margin);
    });

    if (validMargins.length === 0) return 0;

    const totalMargin = validMargins.reduce((sum, inv) => {
        return sum + (parseFloat(inv.alternative.profit_margin) || 0);
    }, 0);

    return totalMargin / validMargins.length;
}

// In your component, replace the derived values with:
let totalPortfolioValue = $derived(calculateTotalPortfolioValue(alternativeInvestments));
let totalAnnualRevenue = $derived(calculateTotalAnnualRevenue(alternativeInvestments));
let averageProfitMargin = $derived(calculateAverageProfitMargin(alternativeInvestments))
	
	// Enhanced filter function
	function enhancedFilter() {
		let filtered = filterAlternatives(alternativeInvestments);
		
		if (showBusinessOnly) {
			filtered = filtered.filter(inv => inv.alternative.is_business);
		}
		
		return filtered.sort((a, b) => {
			const aValue = a.alternative[sortBy];
			const bValue = b.alternative[sortBy];
			return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
		});
	}
	</script>
	
	<div class="min-h-screen space-y-6 p-6">
		<!-- Stats Overview -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<div class="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
				<div class="absolute right-0 top-0 h-24 w-24 transform translate-x-8 -translate-y-8">
					<div class="absolute inset-0 bg-purple-50 opacity-50 dark:bg-purple-900/10"></div>
				</div>
				<div class="relative">
					<h3 class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Portfolio Value</h3>
					<p class="mt-2 truncate text-2xl font-bold text-gray-900 dark:text-white" title={formatCurrency(totalPortfolioValue)}>
						{formatCurrency(totalPortfolioValue)}
					</p>
					<div class="mt-4 flex items-center text-sm text-gray-500">
						<TrendingUp size={16} class="mr-1.5 text-purple-500" />
						<span>Real-time value</span>
					</div>
				</div>
			</div>
			
			<div class="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
				<div class="absolute right-0 top-0 h-24 w-24 transform translate-x-8 -translate-y-8">
					<div class="absolute inset-0 bg-purple-50 opacity-50 dark:bg-purple-900/10"></div>
				</div>
				<div class="relative">
					<h3 class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Annual Revenue</h3>
					<p class="mt-2 truncate text-2xl font-bold text-gray-900 dark:text-white" title={formatCurrency(totalAnnualRevenue)}>
						{formatCurrency(totalAnnualRevenue)}
					</p>
					<div class="mt-4 flex items-center text-sm text-gray-500">
						<BadgeDollarSign size={16} class="mr-1.5 text-purple-500" />
						<span>All investments</span>
					</div>
				</div>
			</div>
			
			<div class="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 sm:col-span-2 lg:col-span-1">
				<div class="absolute right-0 top-0 h-24 w-24 transform translate-x-8 -translate-y-8">
					<div class="absolute inset-0 bg-purple-50 opacity-50 dark:bg-purple-900/10"></div>
				</div>
				<div class="relative">
					<h3 class="text-sm font-medium text-gray-600 dark:text-gray-300">Average Profit Margin</h3>
					<p class="mt-2 truncate text-2xl font-bold text-gray-900 dark:text-white" title={formatPercentage(averageProfitMargin / 100)}>
						{formatPercentage(averageProfitMargin / 100)}
					</p>
					<div class="mt-4 flex items-center text-sm text-gray-500">
						<Percent size={16} class="mr-1.5 text-purple-500" />
						<span>Portfolio average</span>
					</div>
				</div>
			</div>
		</div>
	
		{#if alternativeInvestments.length > 0}
			<section class="rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
				<!-- Header -->
				<div class="mb-6 space-y-4">
					<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div class="flex items-center gap-3">
							<div class="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/50">
								<Building2 class="text-purple-500" size={24} />
							</div>
							<h2 class="text-2xl font-bold">Alternative Investments</h2>
						</div>
						<CreateAlternative {data} />
					</div>
					
					<!-- Search and Filters -->
					<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
						<div class="relative flex-1">
							<Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
							<input
								type="text"
								bind:value={altSearchQuery}
								placeholder="Search by type, name, or location..."
								class="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-800"
							/>
						</div>
						
						<div class="flex flex-wrap items-center gap-4">
							<div class="flex items-center gap-2">
								<Filter size={18} class="text-gray-500" />
								<select
									bind:value={sortBy}
									class="rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
								>
									<option value="valuation">Sort by Valuation</option>
									<option value="annual_revenue">Sort by Revenue</option>
									<option value="profit_margin">Sort by Profit Margin</option>
									<option value="acquired_at">Sort by Date</option>
								</select>
							</div>
							
							<label class="flex items-center gap-2">
								<input
									type="checkbox"
									bind:checked={showBusinessOnly}
									class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
								/>
								<span class="text-sm">Business Only</span>
							</label>
						</div>
					</div>
				</div>
	
				<!-- Investment Cards Grid -->
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
					{#each enhancedFilter() as alt}
						<div class="group relative rounded-xl border border-gray-200 bg-gray-50 p-6 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-600 dark:bg-gray-700/50">
							<div class="mb-4 flex items-center justify-between">
								<h3 class="text-xl font-semibold text-purple-600 dark:text-purple-400">
									{alt.alternative.investment_name || alt.alternative.investment_type}
								</h3>
								<span class="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-600 dark:bg-purple-900/50">
									{alt.alternative.is_business ? 'Business' : 'Investment'}
								</span>
							</div>
	
							<div class="space-y-3">
								<div class="flex items-center justify-between border-b border-gray-100 pb-2 dark:border-gray-700">
									<p class="flex items-center gap-2">
										<Briefcase size={16} class="text-gray-400" />
										<span class="text-sm text-gray-600 dark:text-gray-300">{alt.alternative.investment_type}</span>
									</p>
									<p class="flex items-center gap-2">
										<MapPin size={16} class="text-gray-400" />
										<span class="text-sm text-gray-600 dark:text-gray-300">{alt.alternative.location}</span>
									</p>
								</div>
	
								<div class="grid grid-cols-2 gap-4">
									<div>
										<p class="text-sm text-gray-500">Annual Revenue</p>
										<p class="mt-1 font-semibold">{formatCurrency(alt.alternative.annual_revenue)}</p>
									</div>
									<div>
										<p class="text-sm text-gray-500">Profit Margin</p>
										<p class="mt-1 font-semibold">{formatPercentage(alt.alternative.profit_margin / 100)}</p>
									</div>
								</div>
	
								<div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
									<div>
										<p class="text-sm text-gray-500">Valuation</p>
										<p class="mt-1 text-lg font-bold text-purple-600">{formatCurrency(alt.alternative.valuation)}</p>
									</div>
									<div class="text-right">
										<p class="text-sm text-gray-500">Acquired</p>
										<p class="mt-1 font-medium">{formatDate(alt.alternative.acquired_at)}</p>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{:else}
			<div class="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
				<Building2 size={48} class="mb-4 text-gray-400" />
				<p class="text-xl font-medium text-gray-600 dark:text-gray-300">No alternative investments found</p>
				<p class="mt-2 text-gray-500 dark:text-gray-400">Start by adding your first investment</p>
				<CreateAlternative {data} />
			</div>
		{/if}
	</div>