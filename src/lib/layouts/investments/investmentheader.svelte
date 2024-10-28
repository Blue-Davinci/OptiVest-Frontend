<script>
	import { Target, RefreshCw, MoreVertical, ChevronDown } from 'lucide-svelte';

	let { data, investmentAnalysis, defaultCurrency, formatDate, handleNewAnalysis } = $props();
	let showOptions = $state(false);
	let isLoading = $state(false);

	async function performAnalysis() {
		isLoading = true;
		try {
			await handleNewAnalysis();
		} finally {
			isLoading = false;
		}
	}
</script>

<header
	class="relative mb-8 rounded-2xl bg-gradient-to-r from-white to-purple-50 p-6 shadow-lg transition-all duration-300 dark:from-gray-800 dark:to-gray-900"
>
	<div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
		<!-- Left side - Title and Status -->
		<div class="space-y-4">
			<div class="flex items-center gap-3">
				<div class="relative">
					<Target class="h-8 w-8 text-purple-500" />
					<span class="absolute -right-1 -top-1 flex h-3 w-3">
						<span
							class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"
						></span>
						<span class="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
					</span>
				</div>
				<div>
					<h1
						class="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-3xl font-bold text-transparent"
					>
						Portfolio Analysis Dashboard
					</h1>
					<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
						Powered by AI-driven insights and real-time market data
					</p>
				</div>
			</div>

			<!-- Last Updated Badge -->
			<div class="flex flex-wrap items-center gap-3">
				<div class="flex items-center gap-2">
					<span class="text-sm text-gray-500 dark:text-gray-400">Last Updated:</span>
					<span
						class="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-600 transition-colors dark:bg-purple-900/30 dark:text-purple-400"
					>
						{formatDate(investmentAnalysis.CreatedAt)}
					</span>
				</div>
				<span class="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
				<span class="text-sm text-gray-500 dark:text-gray-400">
					Analysis ID: {investmentAnalysis.id?.slice(0, 8)}
				</span>
			</div>
		</div>

		<!-- Right side - Action Buttons -->
		<div class="flex items-center gap-4">
			<button
				onclick={performAnalysis}
				class="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-400 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:translate-y-[-1px] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
				disabled={isLoading}
			>
				<span class="relative flex items-center gap-2">
					<RefreshCw
						class="h-5 w-5 transition-transform duration-500 {isLoading
							? 'animate-spin'
							: 'group-hover:rotate-180'}"
					/>
					<span class="font-semibold">
						{isLoading ? 'Processing...' : 'New Analysis'}
					</span>
				</span>
				<div
					class="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/0 to-purple-400/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"
				></div>
			</button>

			<!-- Quick Actions Dropdown -->
			<div class="relative">
				<button
					onclick={() => (showOptions = !showOptions)}
					class="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
				>
					<MoreVertical class="h-5 w-5" />
				</button>

				{#if showOptions}
					<div
						class="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800"
					>
						<button
							class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
						>
							Export Report
						</button>
						<button
							class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
						>
							Share Analysis
						</button>
						<button
							class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
						>
							Print Summary
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Progress bar for loading state -->
	{#if isLoading}
		<div class="absolute bottom-0 left-0 right-0">
			<div class="h-1 w-full overflow-hidden rounded-b-2xl bg-gray-200 dark:bg-gray-700">
				<div class="animate-progress h-full bg-gradient-to-r from-purple-600 to-purple-400"></div>
			</div>
		</div>
	{/if}
</header>

<style>
	@keyframes progress {
		0% {
			width: 0%;
		}
		50% {
			width: 70%;
		}
		100% {
			width: 100%;
		}
	}
	.animate-progress {
		animation: progress 2s ease-in-out infinite;
	}
</style>
