<script>
import { CreditCard } from 'lucide-svelte';
import { fly } from 'svelte/transition';

let {searchQuery} = $props();
</script>


<div
	class="flex flex-col items-center justify-center py-12 text-center"
	transition:fly={{ y: 20, duration: 300 }}
>
	<div class="mb-4 rounded-full bg-primary/10 p-4">
		<CreditCard class="h-8 w-8 text-primary" />
	</div>
	<h3 class="mb-2 text-xl font-semibold">No Debts Found</h3>
	<p class="max-w-md text-muted-foreground">
		{searchQuery
			? 'No debts match your search criteria. Try broadening your search?'
			: 'You’re debt-free! Any new debts you add will appear here for tracking.'}
	</p>
</div>