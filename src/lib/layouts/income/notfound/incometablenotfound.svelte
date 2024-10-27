<script>
    import { 
        Wallet, 
        Receipt,
        Clock
    } from 'lucide-svelte';

</script>

<div
class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
>
<div class="flex flex-col items-center justify-center py-12">
    <div class="mb-6 grid grid-cols-3 gap-4">
        <Receipt class="h-12 w-12 text-purple-200 dark:text-purple-900" />
        <Wallet class="h-12 w-12 text-purple-300 dark:text-purple-800" />
        <Clock class="h-12 w-12 text-purple-400 dark:text-purple-700" />
    </div>
    <h3 class="mb-3 text-xl font-semibold text-gray-800 dark:text-white">
        Ready to Track Your Income
    </h3>
    <p class="mx-auto mb-6 max-w-md text-center text-gray-600 dark:text-gray-400">
        Start recording your income to gain insights into your earning patterns and make informed
        financial decisions.
    </p>

    <!-- Placeholder Table Header -->
    <div class="mt-8 w-full max-w-4xl rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="grid grid-cols-5 gap-4 bg-gray-50 p-4 dark:bg-gray-700">
            {#each ['Date', 'Source', 'Description', 'Amount', 'Currency'] as header}
                <div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-600"></div>
            {/each}
        </div>
        <div class="p-8 text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400">
                Your income records will appear here
            </p>
        </div>
    </div>
</div>
</div>
