<script>
	import { List } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
</script>

<a href="#1" class="block">
	<div
		class="group relative flex flex-col items-center justify-center rounded-xl bg-white py-12 text-center shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:bg-gray-800"
		transition:fly={{ y: 20, duration: 300 }}
	>
		<div
			class="mb-4 rounded-full bg-cyan-500/20 p-5 transition-colors duration-300 group-hover:bg-cyan-500/30"
		>
			<List class="h-8 w-8 text-purple-500 dark:text-purple-400" />
		</div>
		<h3 class="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
			No Transactions Found
		</h3>
		<p class="max-w-md text-gray-600 dark:text-gray-300">
			As you log expenses, they'll show up in your transactions here.
		</p>
		<span
			class="mt-4 text-sm text-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-cyan-400"
		>
			Record your first transaction →
		</span>
	</div>
</a>
