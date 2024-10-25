<script>
import {ChartBarIcon} from 'lucide-svelte';
import { fly } from 'svelte/transition';
</script>


<div
class="flex flex-col items-center justify-center py-12 text-center"
transition:fly={{ y: 20, duration: 300 }}
>
<div class="mb-4 rounded-full bg-primary/10 p-4">
    <ChartBarIcon class="h-8 w-8 text-primary" />
</div>
<h3 class="mb-2 text-xl font-semibold">No Contribution Data Yet</h3>
<p class="max-w-md text-muted-foreground">
    Your debt chart will come to life as you start making savvy decisions. 
    Remember, every dollar saved is a dollar earned, and every debt dodged is a victory!
</p>
</div>