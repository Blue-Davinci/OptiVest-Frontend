<script>
	import { fly, slide } from 'svelte/transition';
    import {
		ChartArea as ChartIcon,
	} from 'lucide-svelte';
    
</script>

<div
class="flex flex-col items-center justify-center py-12 text-center"
transition:fly={{ y: 20, duration: 300 }}
>
<div class="mb-4 rounded-full bg-primary/10 p-4">
    <ChartIcon class="h-8 w-8 text-primary" />
</div>
<h3 class="mb-2 text-xl font-semibold">No Contribution Data Yet</h3>
<p class="max-w-md text-muted-foreground">
    Your contribution chart will come to life as you start tracking your goals. Every small
    step counts!
</p>
</div>