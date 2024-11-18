<script>
    import { CheckCircle, Trash2, Delete } from 'lucide-svelte';
    import * as AlertDialog from '$lib/components/ui/alert-dialog';

    let {
        isPositive = false,
        itemID,
        positiveLabel = 'Approve',
        negativeLabel = 'Delete',
        dlgTitle = "Are you absolutely sure?",
        dlgMessage = "Are you sure you want to perform this action? It might be fun, or it might not. Who knows?",
        alertHandleContinue = () => {},
        alertHandleCancel = () => {},
    } = $props();
</script>

<AlertDialog.Root>
    <AlertDialog.Trigger>
        {#if isPositive}
        <button
            class="group relative flex transform items-center space-x-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 ease-in-out hover:scale-102 hover:from-green-600 hover:to-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800"
        >
            <CheckCircle class="h-4 w-4 transition-transform group-hover:scale-110" />
            <span class="relative top-[0.5px]">{positiveLabel}</span>
            <div class="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-10"></div>
        </button>
        {:else}
        <button
            class="group relative flex transform items-center space-x-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 ease-in-out hover:scale-102 hover:from-red-600 hover:to-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800"
        >
            <Trash2 class="h-4 w-4 transition-transform group-hover:scale-110" />
            <span class="relative top-[0.5px]">{negativeLabel}</span>
            <div class="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-10"></div>
        </button>
        {/if}
    </AlertDialog.Trigger>
    <AlertDialog.Content class="sm:max-w-[425px]">
        <AlertDialog.Header>
            <AlertDialog.Title class="text-xl font-semibold leading-none tracking-tight">
                {dlgTitle}
            </AlertDialog.Title>
            <AlertDialog.Description class="mt-3 text-[15px] leading-normal text-muted-foreground">
                {@html dlgMessage}
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer class="mt-6 flex gap-3">
            <AlertDialog.Cancel 
                on:click={alertHandleCancel}
                class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
                Cancel
            </AlertDialog.Cancel>
            <AlertDialog.Action 
                on:click={alertHandleContinue}
                class={`inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    isPositive 
                        ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800' 
                        : 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
                }`}
            >
                Continue
            </AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>

<style>
    :global(.scale-102) {
        transform: scale(1.02);
    }
</style>