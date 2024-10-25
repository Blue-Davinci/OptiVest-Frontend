<script>
    import {FileX} from 'lucide-svelte';
    import { fly } from 'svelte/transition';

    let { searchQuery } = $props();
    </script>
<div
class="flex flex-col items-center justify-center py-12 text-center"
transition:fly={{ y: 20, duration: 300 }}
>
<div class="mb-4 rounded-full bg-primary/10 p-4">
    <FileX class="h-8 w-8 text-primary" />
</div>
<h3 class="mb-2 text-xl font-semibold">No Budgets Found</h3>
<p class="max-w-md text-muted-foreground">
    {searchQuery
        ? "We couldn't find any budgets matching your search. Try a different term?"
        : 'Create your first budget to get started on managing your finances!'}
</p>
</div>