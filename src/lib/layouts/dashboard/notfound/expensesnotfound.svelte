<script>
import {CreditCard} from 'lucide-svelte';
import { fly } from 'svelte/transition';
</script>


<a href="#1" class="block">
    <div class="group relative flex flex-col items-center justify-center py-12 text-center rounded-xl border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] dark:border-gray-700" transition:fly={{ y: 20, duration: 300 }}>
        <div class="mb-4 rounded-full bg-blue-500/20 p-5 group-hover:bg-blue-500/30 transition-colors duration-300">
            <CreditCard class="h-8 w-8 text-blue-500 dark:text-blue-400" />
        </div>
        <h3 class="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">No Income/Expense Data Found</h3>
        <p class="max-w-md text-gray-600 dark:text-gray-300">
            Track your finances here once you start adding income and expenses!
        </p>
        <span class="mt-4 text-sm text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Click to add your first transaction →
        </span>
    </div>
</a>
