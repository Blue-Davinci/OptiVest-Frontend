<script>
	import { INCOME_TIPS as incomeTips } from '$lib/settings/constants';
	import { LightbulbIcon } from 'lucide-svelte';
</script>

<div class="mb-8">
	<div class="mb-4 flex items-center gap-2">
		<LightbulbIcon class="h-5 w-5 text-purple-600 dark:text-purple-400" />
		<h3 class="text-lg font-semibold dark:text-white">Income Management Tips</h3>
	</div>
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each incomeTips as tip}
			<div
				class="rounded-xl border border-purple-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-purple-200 hover:shadow-md dark:border-purple-900 dark:bg-gray-800 dark:hover:border-purple-700"
			>
				<div class="mb-3 flex items-center gap-2">
					{#if tip.icon}
						<tip.icon class="h-5 w-5 text-purple-600 dark:text-purple-400" />
					{/if}
					<h4 class="font-semibold text-gray-900 dark:text-white">{tip.title}</h4>
				</div>
				<p class="text-sm text-gray-600 dark:text-gray-400">{tip.description}</p>
			</div>
		{/each}
	</div>
</div>
