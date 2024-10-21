<script>
	import { onMount } from 'svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import {
		ChartPie,
		AlertCircle,
		TrendingUp,
		RotateCw,
		ChartBar,
		Shield,
		FileText
	} from 'lucide-svelte';
	import { getInvestmentAnalysisSummary } from '$lib/dataservice/investments/investment';

	let analysisSummary = $state(null);
	let error = $state(null);

	async function fetchData() {
		try {
			let data = await getInvestmentAnalysisSummary();
			analysisSummary = data?.data?.llm_analysis ?? null;
			console.log(analysisSummary);
		} catch (err) {
			error = 'Failed to load the analysis summary.';
			console.error(err);
		}
	}

	onMount(() => {
		fetchData();
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="/css/loader.css" />
</svelte:head>

<Drawer.Root>
	<Drawer.Trigger>
		<button
			class="flex transform items-center rounded-lg bg-gradient-to-r from-green-500 to-teal-500 p-3 text-white shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
		>
			<ChartPie class="mr-2" size={20} />
			<span class="font-semibold">Investment Portfolio AI</span>
		</button>
	</Drawer.Trigger>

	<!-- Drawer content with fixed height and scrollable body -->
	<Drawer.Content
		class="fixed inset-x-0 bottom-0 flex h-3/5 flex-col rounded-t-lg bg-white shadow-lg dark:bg-gray-900"
	>
		<Drawer.Header class="bg-white p-6 dark:bg-gray-900">
			<div class="mx-auto max-w-3xl">
				<Drawer.Title class="text-2xl font-bold text-gray-800 dark:text-gray-200">
					Investment Portfolio Analysis
				</Drawer.Title>
				<Drawer.Description class="text-gray-600 dark:text-gray-400">
					A detailed analysis of your portfolio, powered by AI.
				</Drawer.Description>
			</div>
		</Drawer.Header>

		{#if error}
			<div class="flex items-center justify-center p-6 text-red-500">
				<AlertCircle class="mr-2" size={20} />
				{error}
			</div>
		{:else if !analysisSummary}
			<div class="flex flex-grow items-center justify-center">
				<div class="loader"></div>
				<div class="mt-2 text-gray-600 dark:text-gray-400">Loading investment analysis...</div>
			</div>
		{:else}
			<!-- Scrollable content area -->
			<div class="flex-grow space-y-8 overflow-y-auto px-6">
				<!-- Summary Section -->
				<div class="mx-auto max-w-3xl space-y-8">
					<div class="rounded-lg bg-gray-100 p-6 shadow-lg dark:bg-gray-800">
						<div class="mb-4 flex items-center">
							<FileText class="mr-3 text-blue-500" size={24} />
							<h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">
								Overall Summary
							</h3>
						</div>
						<p class="text-gray-600 dark:text-gray-400">
							{analysisSummary.Analysis.overall_summary.text_summary}
						</p>
					</div>

					<!-- Diversification Section -->
					{#if analysisSummary.Analysis?.actions?.diversification?.length}
						<div class="rounded-lg bg-gray-100 p-6 shadow-lg dark:bg-gray-800">
							<div class="mb-4 flex items-center">
								<TrendingUp class="mr-3 text-green-500" size={24} />
								<h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">
									Diversification
								</h3>
							</div>
							<ul class="space-y-2">
								{#each analysisSummary.Analysis.actions.diversification as { asset_class, current_diversification, recommended_diversification }}
									<li class="flex items-center justify-between">
										<span>{asset_class}</span>
										<span>Current: {current_diversification * 100}%</span>
										<span>Recommended: {recommended_diversification * 100}%</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					<!-- Rebalancing Section -->
					{#if analysisSummary.Analysis?.actions?.rebalancing?.length}
						<div class="rounded-lg bg-gray-100 p-6 shadow-lg dark:bg-gray-800">
							<div class="mb-4 flex items-center">
								<RotateCw class="mr-3 text-teal-500" size={24} />
								<h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Rebalancing</h3>
							</div>
							<ul class="space-y-2">
								{#each analysisSummary.Analysis.actions.rebalancing as { asset_class, current_allocation, recommended_allocation }}
									<li class="flex items-center justify-between">
										<span>{asset_class}</span>
										<span>Current: {current_allocation * 100}%</span>
										<span>Recommended: {recommended_allocation * 100}%</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					<!-- Sector Rotation Section -->
					{#if analysisSummary.Analysis?.actions?.sector_rotation?.length}
						<div class="rounded-lg bg-gray-100 p-6 shadow-lg dark:bg-gray-800">
							<div class="mb-4 flex items-center">
								<ChartBar class="mr-3 text-purple-500" size={24} />
								<h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">
									Sector Rotation
								</h3>
							</div>
							<ul class="space-y-2">
								{#each analysisSummary.Analysis.actions.sector_rotation as { sector, recommendation }}
									<li class="flex items-center justify-between">
										<span>{sector}</span>
										<span>{recommendation}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					<!-- Tax Loss Harvesting Section -->
					{#if analysisSummary.Analysis?.actions?.tax_loss_harvesting?.length}
						<div class="rounded-lg bg-gray-100 p-6 shadow-lg dark:bg-gray-800">
							<div class="mb-4 flex items-center">
								<Shield class="mr-3 text-yellow-500" size={24} />
								<h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">
									Tax Loss Harvesting
								</h3>
							</div>
							<ul class="space-y-2">
								{#each analysisSummary.Analysis.actions.tax_loss_harvesting as { stock_symbol, current_price, purchase_price }}
									<li class="flex items-center justify-between">
										<span>{stock_symbol}</span>
										<span>Current Price: ${current_price}</span>
										<span>Purchase Price: ${purchase_price}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<Drawer.Footer class="bg-white p-6 dark:bg-gray-900">
			<Drawer.Close
				class="rounded-lg bg-gray-300 px-4 py-2 font-semibold text-gray-800 transition hover:bg-gray-400"
			>
				Close
			</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>

<style>
	/* Responsiveness */
</style>
