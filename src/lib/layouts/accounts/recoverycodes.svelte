<script>
    import { TOAST_TYPE_SUCCESS } from '$lib/settings/constants.js';
    import * as Dialog from '$lib/components/ui/dialog';
    import { Shield, AlertCircle } from 'lucide-svelte';
    import { fade, fly } from 'svelte/transition';
    import { toastManager } from '$lib/helpers/utilities.js';

    let { recovery_details, isDrawerOpen } = $props();
    $inspect('is drawer open', isDrawerOpen, recovery_details);

    function copyAllCodes() {
        const codes = recovery_details?.recovery_codes?.recovery_codes?.join('\n');
        navigator.clipboard.writeText(codes);
        toastManager(TOAST_TYPE_SUCCESS, 'All codes copied to clipboard');
    }

    function downloadCodes() {
        const codes = recovery_details?.recovery_codes?.recovery_codes?.join('\n');
        const blob = new Blob([codes], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mfa-recovery-codes.txt';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    function copyCode(code) {
        navigator.clipboard.writeText(code);
        toastManager(TOAST_TYPE_SUCCESS, 'Code copied to clipboard');
    }
</script>


<Dialog.Root bind:open={isDrawerOpen}>
    <Dialog.Content class="max-w-2xl p-6 overflow-hidden">
        <div class="max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            
            <!-- Header Section -->
            <Dialog.Header class="mb-6">
                <Dialog.Title class="text-2xl font-bold text-gray-900 dark:text-white">
                    Recovery Codes
                </Dialog.Title>
                <Dialog.Description class="mt-2 text-base text-gray-600 dark:text-gray-300">
                    These codes are your emergency access keys - save them securely!
                </Dialog.Description>
            </Dialog.Header>
            
            <!-- Main Content -->
            <div class="space-y-6" transition:fade={{ duration: 300 }}>
                <div class="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                    
                    <!-- Actions Section -->
                    <div class="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <h3 class="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                            <Shield class="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            Recovery Codes
                        </h3>
                        <div class="flex flex-wrap gap-2">
                            <button
                                onclick={copyAllCodes}
                                class="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                                </svg>
                                Copy All
                            </button>
                            <button
                                onclick={downloadCodes}
                                class="inline-flex items-center gap-2 rounded-lg border-2 border-purple-600 px-4 py-2 text-sm font-medium text-purple-600 transition-colors hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                </svg>
                                Download
                            </button>
                        </div>
                    </div>

                    <!-- Security Notice -->
                    <div class="mb-6 rounded-xl bg-red-50 p-4 dark:bg-red-900/30">
                        <div class="flex items-center gap-2">
                            <AlertCircle class="h-5 w-5 text-red-600 dark:text-red-400" />
                            <span class="font-medium text-red-800 dark:text-red-200">Critical Security Notice</span>
                        </div>
                        <div class="mt-3 space-y-2 text-sm text-red-700 dark:text-red-300">
                            <p><strong>⚠️ These codes are your only backup method!</strong></p>
                            <ul class="list-disc pl-5 space-y-1">
                                <li>Store these codes in a secure, offline location</li>
                                <li>Without these codes, you may permanently lose access to your account if you lose your device</li>
                                <li>Each code can only be used once</li>
                                <li>These codes will never be shown again</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Recovery Codes List -->
                    {#if recovery_details?.recovery_codes?.recovery_codes?.length > 0}
                        <div class="grid grid-cols-1 gap-3" transition:fly={{ y: 20, duration: 300 }}>
                            {#each recovery_details.recovery_codes.recovery_codes as code}
                                <div class="group relative">
                                    <div class="flex items-center justify-between rounded-lg border-2 border-gray-200 bg-gray-50 p-3 transition-colors hover:border-purple-300 dark:border-gray-700 dark:bg-gray-700/50 dark:hover:border-purple-500">
                                        <code class="font-mono text-sm font-medium text-gray-800 dark:text-gray-200 break-all">{code}</code>
                                        <button
                                            onclick={() => copyCode(code)}
                                            class="ml-3 flex-shrink-0 rounded-md p-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                                            aria-label="Copy code to clipboard"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </Dialog.Content>
</Dialog.Root>
<style></style>