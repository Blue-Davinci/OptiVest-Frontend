<script>
	import { fly } from 'svelte/transition';
    import {
		PiggyBank,
	} from 'lucide-svelte';
    
    let {goalSearchQuery} = $props();
</script>

<div
class="flex flex-col items-center justify-center py-12 text-center"
transition:fly={{ y: 20, duration: 300 }}
>
<div class="mb-4 rounded-full bg-primary/10 p-4">
    <PiggyBank class="h-8 w-8 text-primary" />
</div>
<h3 class="mb-2 text-xl font-semibold">No Goals Found</h3>
<p class="max-w-md text-muted-foreground">
    {goalSearchQuery
        ? "We couldn't find any goals matching your search. Try a different term?"
        : 'Time to dream big! Start by setting your first financial goal.'}
</p>
</div>
