<script>
	import { Target } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
</script>

<a href="#1" class="block">
	<div
		class="group relative flex flex-col items-center justify-center rounded-xl bg-white py-12 text-center shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:bg-gray-800"
		transition:fly={{ y: 20, duration: 300 }}
	>
		<div
			class="mb-4 rounded-full bg-green-500/20 p-5 transition-colors duration-300 group-hover:bg-green-500/30"
		>
			<Target class="h-8 w-8 text-green-500 dark:text-green-400" />
		</div>
		<h3 class="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">No Goals Found</h3>
		<p class="max-w-md text-gray-600 dark:text-gray-300">
			Set your financial goals to start tracking your progress here.
		</p>
		<span
			class="mt-4 text-sm text-green-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-green-400"
		>
			Create your first goal →
		</span>
	</div>
</a>
