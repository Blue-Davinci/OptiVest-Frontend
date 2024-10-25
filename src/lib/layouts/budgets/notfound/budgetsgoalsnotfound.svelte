<script>
import {Target} from 'lucide-svelte';
import { fly } from 'svelte/transition';
</script>

<div
class="flex flex-col items-center justify-center rounded-lg bg-gray-200 p-6 dark:bg-gray-700"
transition:fly={{ y: 20, duration: 300 }}
>
<Target class="mb-4 h-8 w-8 text-gray-500 dark:text-gray-300" />
<p class="text-sm text-gray-700 dark:text-gray-300">
    No goals available for this budget.
</p>
</div>